const crypto = require("crypto");
const { getWeather, getWeatherDetails } = require("./_helpers");
const fields = require("../../fields");
const { getFieldStatus, setFieldStatus, updateFieldStatus } = require("../../lib/fieldStatus");

// Disable Next.js body parser so we can verify the Slack signature
// against the raw request body.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Condition code to human-readable name lookup.
// Duplicated from components/_weatherTypes.js because that file uses
// ES module exports which can't be require()'d in an API route.
const conditionNames = {
  BlowingDust: "Blowing Dust",
  Clear: "Clear",
  Cloudy: "Cloudy",
  Foggy: "Foggy",
  Haze: "Haze",
  MostlyClear: "Mostly Clear",
  MostlyCloudy: "Mostly Cloudy",
  PartlyCloudy: "Partly Cloudy",
  Smoky: "Smoky",
  Breezy: "Breezy",
  Windy: "Windy",
  Drizzle: "Drizzle",
  HeavyRain: "Heavy Rain",
  isolatedThunderstorms: "Isolated Thunderstorms",
  Rain: "Rain",
  sunShowers: "Sun Showers",
  scatteredThunderstorms: "Scattered Thunderstorms",
  strongStorms: "Strong Storms",
  thunderstorms: "Thunderstorms",
  frigid: "Frigid",
  hail: "Hail",
  hot: "Hot",
  flurries: "Flurries",
  sleet: "Sleet",
  snow: "Snow",
  sunFlurries: "Sun Flurries",
  wintryMix: "Wintry Mix",
  blizzard: "Blizzard",
  blowingSnow: "Blowing Snow",
  freezingDrizzle: "Freezing Drizzle",
  freezingRain: "Freezing Rain",
  heavySnow: "Heavy Snow",
  hurricane: "Hurricane",
  TropicalStorm: "Tropical Storm",
};

/**
 * Read the raw request body as a string.
 */
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

/**
 * Verify that the request actually came from Slack using HMAC-SHA256.
 * @see https://api.slack.com/authentication/verifying-requests-from-slack
 */
function verifySlackRequest(rawBody, timestamp, signature) {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) {
    throw new Error("SLACK_SIGNING_SECRET is not set");
  }

  // Reject requests older than 5 minutes to prevent replay attacks.
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
  if (parseInt(timestamp, 10) < fiveMinutesAgo) {
    return false;
  }

  const sigBasestring = `v0:${timestamp}:${rawBody}`;
  const hmac = crypto
    .createHmac("sha256", signingSecret)
    .update(sigBasestring)
    .digest("hex");
  const expectedSignature = `v0=${hmac}`;

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

/**
 * Resolve user input to a field key in the fields object.
 * Supports exact match and space-to-hyphen normalization (e.g. "oak grove" → "oak-grove").
 */
function resolveFieldKey(input) {
  const normalized = input.toLowerCase().trim();
  if (fields[normalized]) return normalized;

  const hyphenated = normalized.replace(/\s+/g, "-");
  if (fields[hyphenated]) return hyphenated;

  return null;
}

/**
 * Convert precipitation amount from mm to inches.
 */
function mmToInches(mm) {
  return (mm * 0.0393701).toFixed(2);
}

/**
 * Convert Celsius to Fahrenheit.
 */
function cToF(c) {
  return Math.round((c * 9) / 5 + 32);
}

/**
 * Get the human-readable condition name for a weather code.
 */
function getConditionName(code) {
  return conditionNames[code] || code;
}

/**
 * Build a Slack Block Kit message for help/usage.
 */
function buildHelpBlocks() {
  return [
    {
      type: "header",
      text: { type: "plain_text", text: "Baseball Weather - Help" },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*Usage:*\n" +
          "• `/weather <field>` — Current conditions\n" +
          "• `/weather <field> forecast` — Current conditions + 7-day forecast\n" +
          "• `/weather list` — Show all available fields\n" +
          "• `/weather open` — Mark fields as open\n" +
          "• `/weather close [reason]` — Mark fields as closed\n" +
          "• `/weather update <message>` — Add a status update message\n" +
          "• `/weather help` — This message",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Examples:*\n`/weather murwood`\n`/weather oak grove`\n`/weather castle-rock`",
      },
    },
  ];
}

/**
 * Build a Slack Block Kit message listing all available fields.
 */
function buildListBlocks() {
  const fieldList = Object.entries(fields)
    .map(([key, field]) => `• \`${key}\` — ${field.name}`)
    .join("\n");

  return [
    {
      type: "header",
      text: { type: "plain_text", text: "Available Fields" },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: fieldList },
    },
  ];
}

/**
 * Build a Slack Block Kit message with weather data for a specific field.
 */
function buildWeatherBlocks(fieldKey, currentData, forecastData, includeForecast, fieldStatus) {
  const field = fields[fieldKey];
  const current = currentData.currentWeather;
  const details = getWeatherDetails(current);

  const blocks = [];
  const RAIN_THRESHOLD_MM = 0.2 / 0.0393701; // ~5.08mm

  // Rain warnings from forecast data (always checked when available).
  if (forecastData) {
    const days = forecastData.forecastDaily.days;
    const rainyDays = days.filter(
      (day) => day.precipitationAmount > RAIN_THRESHOLD_MM
    );

    if (rainyDays.length > 0) {
      const dayNames = rainyDays.map((day) => {
        const date = new Date(day.forecastStart);
        return date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "America/Los_Angeles",
        });
      });

      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            ":rotating_light: *Rain Warning — Fields may close*\n" +
            `>0.2" of rain expected on: *${dayNames.join(", ")}*`,
        },
      });
      blocks.push({ type: "divider" });
    }
  }

  // Header with field name and status.
  const statusText = fieldStatus.isClosed ? ":red_circle: Closed" : ":large_green_circle: Open";
  blocks.push({
    type: "header",
    text: {
      type: "plain_text",
      text: `${field.name}`,
    },
  });
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Status:* ${statusText}`,
    },
  });

  // Current conditions.
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Current Conditions*",
    },
  });
  blocks.push({
    type: "section",
    fields: [
      {
        type: "mrkdwn",
        text: `:thermometer: *Temp:* ${details.temperature}°F`,
      },
      {
        type: "mrkdwn",
        text: `:dash: *Wind:* ${details.windSpeed} mph ${details.windDirectionText}`,
      },
      {
        type: "mrkdwn",
        text: `:cloud: *Cloud Cover:* ${details.cloudCover}%`,
      },
      {
        type: "mrkdwn",
        text: `:sunny: *UV Index:* ${details.uvIndex}`,
      },
      {
        type: "mrkdwn",
        text: `:partly_sunny: *Conditions:* ${getConditionName(current.conditionCode)}`,
      },
    ],
  });

  // 7-day forecast (only when requested).
  if (includeForecast && forecastData) {
    const days = forecastData.forecastDaily.days;

    blocks.push({ type: "divider" });
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: "*7-Day Forecast*" },
    });

    for (const day of days) {
      const date = new Date(day.forecastStart);
      const dayName = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "America/Los_Angeles",
      });

      const high = cToF(day.temperatureMax);
      const low = cToF(day.temperatureMin);
      const condition = getConditionName(day.conditionCode);
      const precipChance = Math.round((day.precipitationChance || 0) * 100);
      const precipAmount = mmToInches(day.precipitationAmount || 0);
      const isHeavyRain = day.precipitationAmount > RAIN_THRESHOLD_MM;
      const warning = isHeavyRain ? " :warning:" : "";

      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            `*${dayName}*  —  ${condition}\n` +
            `:arrow_up: ${high}°F  :arrow_down: ${low}°F` +
            `  |  :droplet: ${precipChance}% chance, ${precipAmount}"${warning}`,
        },
      });
    }
  }

  // Attribution footer.
  blocks.push({ type: "divider" });
  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: "Weather data provided by Apple WeatherKit",
      },
    ],
  });

  return blocks;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rawBody = await getRawBody(req);

    // Verify Slack signature (skip in development if no secret is set).
    const slackSignature = req.headers["x-slack-signature"];
    const slackTimestamp = req.headers["x-slack-request-timestamp"];

    if (process.env.SLACK_SIGNING_SECRET) {
      if (!slackSignature || !slackTimestamp) {
        return res.status(401).json({ error: "Missing Slack signature headers" });
      }
      if (!verifySlackRequest(rawBody, slackTimestamp, slackSignature)) {
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    // Parse the URL-encoded form body from Slack.
    const params = new URLSearchParams(rawBody);
    const rawText = (params.get("text") || "").trim();
    const text = rawText.toLowerCase();

    // Route: help
    if (text === "help") {
      return res.status(200).json({
        response_type: "ephemeral",
        blocks: buildHelpBlocks(),
      });
    }

    // Route: list
    if (text === "list") {
      return res.status(200).json({
        response_type: "ephemeral",
        blocks: buildListBlocks(),
      });
    }

    // Route: open
    if (text === "open") {
      const newStatus = await setFieldStatus(false);
      return res.status(200).json({
        response_type: "in_channel",
        text: `:large_green_circle: Fields are now *open*. Updated ${newStatus.updated}.`,
      });
    }

    // Route: update <message>
    if (text.startsWith("update")) {
      const message = rawText.replace(/^update\s*/i, "").trim();
      if (!message) {
        return res.status(200).json({
          response_type: "ephemeral",
          text: ":warning: Please provide a message. Usage: `/weather update <message>`",
        });
      }
      const newStatus = await updateFieldStatus(message);
      const statusText = newStatus.isClosed ? ":red_circle: Closed" : ":large_green_circle: Open";
      return res.status(200).json({
        response_type: "in_channel",
        text: `:pencil: *Field status update* (${newStatus.updated})\n${statusText} — ${message}`,
      });
    }

    // Route: close [reason]
    if (text.startsWith("close")) {
      const reason = rawText.replace(/^close\s*/i, "").trim();
      const newStatus = await setFieldStatus(true, reason);
      const reasonText = reason ? ` Reason: _${reason}_` : "";
      return res.status(200).json({
        response_type: "in_channel",
        text: `:red_circle: Fields are now *closed*. Updated ${newStatus.updated}.${reasonText}`,
      });
    }

    // Check if the user wants the forecast (e.g. "/weather murwood forecast").
    const parts = text.split(/\s+/);
    const includeForecast = parts.includes("forecast");
    const fieldInput = parts.filter((p) => p !== "forecast").join(" ");

    // Route: field lookup (default to Castle Rock if no field specified)
    const fieldKey = resolveFieldKey(fieldInput || "castle-rock");
    if (!fieldKey) {
      return res.status(200).json({
        response_type: "ephemeral",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `:x: Field \`${fieldInput}\` not found. Use \`/weather list\` to see available fields.`,
            },
          },
        ],
      });
    }

    // Fetch weather data and field status. Always get forecast for rain
    // warnings; full forecast display is controlled by the includeForecast flag.
    const mockReq = { query: { school: fieldKey } };
    const [currentData, forecastData, fieldStatus] = await Promise.all([
      getWeather(mockReq, "currentWeather"),
      getWeather(mockReq, "forecastDaily"),
      getFieldStatus(),
    ]);

    const blocks = buildWeatherBlocks(fieldKey, currentData, forecastData, includeForecast, fieldStatus);

    return res.status(200).json({
      response_type: "in_channel",
      blocks,
    });
  } catch (error) {
    console.error("Slack weather bot error:", error);
    return res.status(200).json({
      response_type: "ephemeral",
      text: "Something went wrong fetching the weather. Please try again later.",
    });
  }
}
