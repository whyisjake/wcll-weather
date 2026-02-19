const { get } = require("@vercel/edge-config");

const EC_KEY = "field-status";

const DEFAULT_STATUS = {
  isClosed: false,
  updated: "",
  message: "The fields are open.",
  shortMessage: "Open",
  reason: "",
};

async function getFieldStatus() {
  try {
    const data = await get(EC_KEY);
    if (data) return data;
  } catch (err) {
    console.error("Edge Config read error, returning default status:", err.message);
  }
  return { ...DEFAULT_STATUS };
}

async function setFieldStatus(isClosed, reason = "") {
  const now = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const status = {
    isClosed,
    updated: now,
    message: isClosed ? "The fields are closed." : "The fields are open.",
    shortMessage: isClosed ? "Closed" : "Open",
    reason,
  };

  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const vercelToken = process.env.EC_API_TOKEN;

  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ operation: "upsert", key: EC_KEY, value: status }],
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Edge Config write failed (${res.status}): ${body}`);
  }

  return status;
}

async function updateFieldStatus(message) {
  const current = await getFieldStatus();
  const now = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const status = {
    ...current,
    reason: message,
    updated: now,
  };

  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const vercelToken = process.env.EC_API_TOKEN;

  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ operation: "upsert", key: EC_KEY, value: status }],
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Edge Config write failed (${res.status}): ${body}`);
  }

  return status;
}

module.exports = { getFieldStatus, setFieldStatus, updateFieldStatus };
