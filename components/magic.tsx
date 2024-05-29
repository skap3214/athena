import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { MagicProps } from "@/types";
import Microphone from "./microphone";
import { cn } from "@/lib/utils";

const Magic = ({
  handleSubmit,
  input,
  setInput,
  onTranscription,
}: MagicProps) => {
  const [mode, setMode] = useState("default");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setMode((prevMode) => (prevMode === "default" ? "chat" : "default"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const placeholder = mode === "default" ? "Add documents" : "Chat";

  return (
    <div
      className={cn(
        "w-full p-4 ml-2 mb-2 rounded md:w-[30%] overflow-y-auto flex absolute bottom-0 left-0 z-[9999]",
        mode === "chat" && "md:h-[50vh] h-[20vh]",
      )}
    >
      <form
        className="flex items-end flex-row w-full space-x-1"
        onSubmit={handleSubmit}
      >
        <Microphone onTranscription={onTranscription} />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
        />
        <Button type="submit">
          <ArrowUp size="icon" />
        </Button>
      </form>
    </div>
  );
};

export default Magic;
