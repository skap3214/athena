"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import getUser from "@/hooks/get-user";
import { checkInputType } from "@/lib/check-input-type";
import { ArrowRight, CaseUpper, Text } from "lucide-react";
import { useState } from "react";
import { FaYoutube } from "react-icons/fa";

export default function Component() {
  const user = getUser();
  const [value, setValue] = useState("");

  return (
    <section className="h-screen w-full flex mx-5 md:mx-10 lg:mx-20 2xl:mx-0 flex-col justify-center items-center">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
        athena.
      </h1>
      <h2 className="text-md md:text-xl mt-2 font-light text-primary/50">
        generate. visualize. interact.
      </h2>
      <form className="mt-6 max-w-[600px] w-full space-y-1 flex flex-col items-end">
        <Textarea
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
          <Button size="sm" variant="ghost">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </section>
  );
}
