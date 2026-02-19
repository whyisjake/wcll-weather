import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";

export default function LarryByrne() {
  return (
    <>
      <Head>
        <title>Larry Byrne – Walnut Creek Little League</title>
        <meta
          name="description"
          content="Remembering Larry Byrne, who volunteered for 40 years to build and maintain the Continental Little League baseball field."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="shortcut icon"
          href="https://assets.ngin.com/site_files/2365/favicon.ico"
        />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-baseball-green-900 dark:text-baseball-green-300 mb-2">
            Larry Byrne
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            January 9, 1926 &ndash; February 8, 2015 &middot; Resident of
            Concord
          </p>

          <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <img
              src="/larry-byrne.jpg"
              alt="Larry Byrne"
              className="float-right ml-4 mb-4 rounded-lg w-36"
            />
            <p>
              Laurence J. Byrne passed away surrounded by family members. He was
              born in San Mateo, CA and worked for PG&amp;E for 34 years. He
              served in the U.S. Army during WWII and was a proud Veteran.
            </p>

            <p>
              For 40 years he volunteered to build and maintain the Continental
              Little League baseball field, which was later named the{" "}
              <strong>Larry Byrne Veterans Field</strong>. He coached the Little
              League baseball team &ldquo;The Tigers&rdquo; for several years.
            </p>

            <p>
              &ldquo;Larry was known in the community for helping children
              develop their potential in sports.&rdquo; He had a great sense of
              Irish humor and a kind spirit, serving as an amazing father,
              friend, and coach.
            </p>

            <p>
              <strong>Survivors:</strong> Children John Byrne, Brian Byrne, and
              Athena Byrne; grandchildren Ethan and Brandi.
            </p>

            <p>
              <strong>Memorial Service:</strong> Sunday, February 22, 2015,
              12pm&ndash;3pm at Ygnacio Valley Elementary, Larry Byrne Veterans
              Field, 2217 Chalomar Road in Concord.
            </p>

            <p>
              <strong>Donations:</strong> Continental Little League, P.O. Box
              30971, Walnut Creek, CA 94598.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Originally published in the{" "}
              <a
                href="https://www.eastbaytimes.com/obituaries/larry-byrne/"
                className="text-baseball-sky-600 hover:text-baseball-sky-700 transition-colors underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                East Bay Times
              </a>{" "}
              and{" "}
              <a
                href="https://www.legacy.com/us/obituaries/eastbaytimes/name/larry-byrne-obituary?id=17068146"
                className="text-baseball-sky-600 hover:text-baseball-sky-700 transition-colors underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Legacy.com
              </a>
              .
            </p>
            <p className="mt-4">
              <Link
                href="/field/yve/details"
                className="text-baseball-sky-600 hover:text-baseball-sky-700 transition-colors underline"
              >
                &larr; Back to Ygnacio Valley Elementary
              </Link>
            </p>
          </div>
        </article>
      </main>
    </>
  );
}
