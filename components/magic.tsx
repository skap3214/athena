import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { MagicProps } from "@/types";

const Magic = ({ handleSubmit, input, setInput }: MagicProps) => {
  return (
    <form
      className="flex md:w-[30%] w-full px-4 flex-row space-x-1 absolute bottom-3 left-0 z-[9999]"
      onSubmit={handleSubmit}
    >
      <Input value={input} onChange={(e) => setInput(e.target.value)} />
      <Button type="submit">
        <ArrowUp size="icon" />
      </Button>
    </form>
  );
};

export default Magic;
