"use client";
import { checkInputType } from "@/lib/check-input-type";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateGraph } from "./actions";
import { toast } from "sonner";
import SubmitArea from "@/components/submit-area";
import Loading from "@/components/loading";
import RecommendValue from "@/components/recommend-value";
import CommunityGraph from "@/components/community-graph";
// import { loadFromPDF } from "./actions/extract";

export default function Component() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (input: string | File) => {
    if (!input) return;
    setValue("");
    try {
      setLoading(true);
      if (input instanceof File) {
        await updateGraph(undefined, undefined, input);
      } else {
        const isYoutube = checkInputType(input);
        if (isYoutube) {
          await updateGraph(undefined, input);
        } else {
          await updateGraph(input);
        }
      }
      router.push("/graph");
    } catch (err) {
      toast.error("Internal server error");
      setLoading(false);
    }
  };

  return (
    <section className="h-screen w-full flex mx-5 md:mx-10 lg:mx-20 2xl:mx-0 flex-col justify-center items-center">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
        athena.
      </h1>
      <h2 className="text-md md:text-xl mt-2 font-light text-primary/60">
        generate. visualize. interact.
      </h2>
      {loading ? (
        <Loading />
      ) : (
        <>
          <SubmitArea value={value} setValue={setValue} submit={submit} />
          <RecommendValue handleClick={(value) => submit(value)} />
          <div className="absolute bottom-0 mb-8">
            <CommunityGraph />
          </div>
        </>
      )}
    </section>
  );
}
