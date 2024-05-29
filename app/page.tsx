"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import NoGraph from "@/components/no-graph";
import Magic from "@/components/magic";

const Graph = dynamic(() => import("../components/graph"), {
  ssr: false,
});

const ForceGraphComponent = () => {
  const [input, setInput] = useState("");
  const [graph, setGraph] = useState<any>({ nodes: [], links: [] });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(input);
    setInput("");
  };

  const submit = async (inputText: string) => {
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: inputText,
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
        <>
          <Graph graph={graph} />
          <Magic
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            onTranscription={submit}
          />
        </>
      ) : (
        <NoGraph onSubmit={submit} />
      )}
    </div>
  );
};

export default ForceGraphComponent;
