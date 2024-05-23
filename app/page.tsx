"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

const Graph = dynamic(() => import("../components/graph"), {
  ssr: false,
});

const ForceGraphComponent = () => {
  const [input, setInput] = useState("");
  const [graph, setGraph] = useState<any>({ nodes: [], links: [] });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput("");
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: input,
      }),
    })
      .then((response) => response.body)
      .then((body) => {
        const reader = body?.getReader();
        const decoder = new TextDecoder();

        reader?.read().then(function processText({ done, value }) {
          if (done) {
            return;
          }

          const graphData = JSON.parse(decoder.decode(value));

          setGraph((prevGraph: any) => ({
            nodes: [...prevGraph.nodes, ...graphData.nodes],
            links: [...prevGraph.links, ...graphData.links],
          }));

          reader.read().then(processText);
        });
      });
  };

  return (
    <div className="max-h-screen">
      {graph.nodes.length > 0 ? (
        <Graph graph={graph} />
      ) : (
        <div className="h-screen text-3xl items-center w-full place-content-center flex">
          Input something!
        </div>
      )}
      <form
        className="flex md:w-[30%] w-full px-4 flex-row space-x-1 absolute bottom-3 left-0 z-[9999]"
        onSubmit={handleSubmit}
      >
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button type="submit">
          <ArrowUp size="icon" />
        </Button>
      </form>
    </div>
  );
};

export default ForceGraphComponent;
