import Head from "next/head";
import _ from "lodash";
import fields from "@/fields";
import { useRouter } from "next/router";

const SITE_URL = "https://fields.wclittleleague.org";

export default function NewHead({ fieldName } = {}) {
  const router = useRouter();
  const name = fieldName || _.get(fields, [router.query.field, "name"], "");
  const pageTitle = name
    ? `${name} – Walnut Creek Little League`
    : "Walnut Creek Little League Field Weather";
  const pageUrl = `${SITE_URL}${router.asPath}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content="Field weather, status, and forecasts for Walnut Creek Little League." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        content="Field weather, status, and forecasts for Walnut Creek Little League."
      />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="Walnut Creek Little League" />
      <meta
        property="og:image"
        content="https://cdn1.sportngin.com/attachments/logo_graphic/c47d-185345966/wcll_logo_medium.png"
      />
    </Head>
  );
}
