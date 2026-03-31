import { Navigation } from "../_document";
import { useRouter } from "next/router";
import fields from "@/fields";
import { RotatingLines } from "react-loader-spinner";
import { useWeather } from "@/components/helpers/_fetcher";
import _ from "lodash";
import Head from "@/components/Head";
import Header from "@/components/Header";
import Panels from "@/components/Panels";
import PrimaryCard from "@/components/PrimaryCard";

export async function getServerSideProps({ params }) {
  const field = _.get(params, ["field", 0], "");
  const fieldName = _.get(fields, [field, "name"], "");
  return { props: { fieldName } };
}

export default function Field({ fieldName }) {
  const router = useRouter();
  const field = _.get(router.query.field, [0], "");
  const page = _.get(router.query.field, [1], "weather");

  const { data, isLoading, isError } = useWeather(field);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        ></RotatingLines>
      </div>
    );
  if (isError) return <p></p>;
  if (!data) return <p></p>;

  const name = _.get(fields, [field, "name"], "");
  const location = _.get(fields, [field, "location"], {});
  const address = _.get(fields, [field, "address"], "");
  const placeID = _.get(fields, [field, "placeID"], "");

  return (
    <>
      <Head fieldName={fieldName} />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft dark:shadow-gray-900/50 p-4 lg:sticky lg:top-20" id="fields">
              <Navigation />
            </div>
          </aside>
          <div className="w-full lg:w-2/3 space-y-6">
            <PrimaryCard
              name={name}
              data={data}
              location={location}
              address={address}
              placeID={placeID}
            />
            <Panels active={page} />
          </div>
        </div>
      </main>
    </>
  );
}
