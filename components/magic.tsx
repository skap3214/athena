import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { MagicProps, Message as MessageType } from "@/types";
import Microphone from "./microphone";
import { cn } from "@/lib/utils";
import Message from "./message";
import useScroll from "@/hooks/use-scroll";

const Magic = ({
  handleSubmit,
  input,
  setInput,
  onTranscription,
  mode,
  history,
}: MagicProps) => {
  const placeholder =
    mode === "default" ? "Add documents" : "Chat with your graph";
  const messageContainerRef = useRef(null);
  useScroll(messageContainerRef, history);

  return (
    <div
      className={cn(
        "w-full p-4 ml-2 mb-2 rounded md:w-[30%] flex-col flex absolute bottom-0 left-0 z-[9999]",
        mode === "chat" && "md:h-[50vh] h-[20vh]",
      )}
    >
      {mode === "chat" && (
        <div
          ref={messageContainerRef}
          className="h-full mb-2 rounded-md space-y-2 overflow-y-auto"
        >
          {history.map((message: MessageType, index: number) => (
            <Message key={index} role={message.role}>
              {message.text}
            </Message>
          ))}
        </div>
      )}
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
