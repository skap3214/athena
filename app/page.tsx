"use client";
import getUser from "@/hooks/get-user";
import { checkInputType } from "@/lib/check-input-type";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { updateGraph } from "./actions";
import { toast } from "sonner";
import SubmitArea from "@/components/submit-area";
import Loading from "@/components/loading";
import RecommendValue from "@/components/recommend-value";
import CommunityGraph from "@/components/community-graph";

export default function Component() {
  const router = useRouter();
  const user = getUser();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(value);
  };

  const submit = async (input: string) => {
    if (!input) return;
    setValue("");
    try {
      setLoading(true);
      const isYoutube = checkInputType(input);
      if (isYoutube) {
        await updateGraph(undefined, input);
      } else {
        await updateGraph(input);
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
        <SubmitArea
          handleSubmit={handleSubmit}
          value={value}
          setValue={setValue}
        />
      )}
      <RecommendValue handleClick={(value) => submit(value)} />
      <div className="absolute bottom-0 mb-8">
        <CommunityGraph />
      </div>
    </section>
  );
}
