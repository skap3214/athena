import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { MagicProps } from "@/types";
import Microphone from "./microphone";

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
    <form
      className="flex md:w-[30%] w-full px-4 flex-row space-x-1 absolute bottom-3 left-0 z-[9999]"
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
  );
};

export default Magic;
