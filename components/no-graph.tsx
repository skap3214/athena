"use client";
import { checkInputType } from "@/lib/check-input-type";
import { useState } from "react";
import { toast } from "sonner";
import SubmitArea from "@/components/submit-area";
import Loading from "@/components/loading";
import RecommendValue from "@/components/recommend-value";
import CommunityGraph from "@/components/community-graph";
import getUser from "@/hooks/get-user";
import { useModal } from "@/hooks/use-modal-store";
import SignInButton from "@/components/sign-in-button";
import { cn } from "@/lib/utils";
import { NoGraphProps } from "@/types";
import { GeistSans } from "geist/font/sans";

export default function NoGraph({ onSubmit }: NoGraphProps) {
  const user = getUser();
  const [value, setValue] = useState("");

  const [loading, setLoading] = useState(false);
  const { onOpen } = useModal();

  const submit = async (input: string | File) => {
    if (!input) return;
    if (
      !(input instanceof File) &&
      !checkInputType(input) &&
      input.length < 100
    ) {
      toast.warning("Input should be at least 100 words");
      return;
    }
    if (!user?.id) {
      onOpen();
      return;
    }
    setLoading(true);
    setValue("");
    try {
      if (!(input instanceof File)) {
        await onSubmit(input);
      }
    } catch (err) {
      toast.error("Internal server error");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <section
      className={`${GeistSans.className} px-4 h-screen w-full flex flex-col justify-center items-center`}
    >
      <div
        className={cn("absolute bottom-0 right-0 p-2 hidden", !user && "flex")}
      >
        <SignInButton />
      </div>
      <h1 className="font-bold tracking-tighter text-5xl xl:text-6xl/none">
        athena.
      </h1>
      <h2 className="text-md md:text-xl mt-2 font-light text-primary/60">
        graph of knowledge. made by you.
      </h2>
      {loading ? (
        <Loading />
      ) : (
        <>
          <SubmitArea value={value} setValue={setValue} submit={submit} />
          <RecommendValue handleClick={(value) => submit(value)} />
          <div className="absolute bottom-0 mb-8">
            {/* <CommunityGraph /> */}
          </div>
        </>
      )}
    </section>
  );
}
