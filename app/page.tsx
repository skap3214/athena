"use client";
import RecommendValue from "@/components/recommend-value";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import getUser from "@/hooks/get-user";
import { checkInputType } from "@/lib/check-input-type";
import { ArrowRight, CaseUpper } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { updateGraph } from "./actions";

export default function Component() {
  const router = useRouter();
  const user = getUser();
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(value);
  };

  const submit = (input: string) => {
    const isYoutube = checkInputType(value);
    if (isYoutube) {
      console.log("Updating Graph");
      updateGraph(undefined, value);
    } else {
      console.log("Updating Graph");
      updateGraph(value);
    }
    router.push("/graph");
  };

  return (
    <section className="h-screen w-full flex mx-5 md:mx-10 lg:mx-20 2xl:mx-0 flex-col justify-center items-center">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
        athena.
      </h1>
      <h2 className="text-md md:text-xl mt-2 font-light text-primary/60">
        generate. visualize. interact.
      </h2>
      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-[600px] w-full space-y-1 flex flex-col items-end"
      >
        <Textarea
          autoFocus
          className="flex-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something or paste a YouTube video link"
        />
        <div className="flex w-full justify-between">
          <div>
            {value &&
              (checkInputType(value) ? (
                <FaYoutube className="h-5 mt-1.5 w-5" />
              ) : (
                <CaseUpper className="h-5 mt-1.5 w-5" />
              ))}
          </div>
          <Button
            size="sm"
            className="dark:hover:bg-transparent/30"
            variant="ghost"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </form>
      <RecommendValue handleClick={(value) => submit(value)} />
    </section>
  );
}
