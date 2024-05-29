"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import NoGraph from "@/components/no-graph";
import Magic from "@/components/magic";
import { filteredGraph } from "@/lib/filter-graph";

const Graph = dynamic(() => import("../components/graph"), {
  ssr: false,
});

const ForceGraphComponent = () => {
  const [input, setInput] = useState("");
  const [graph, setGraph] = useState<{ nodes: any[]; links: any[] }>({
    nodes: [],
    links: [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(input);
    setInput("");
  };

  const submit = async (inputText: string) => {
    fetch("/api/add", {
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
          setGraph((prevGraph) => {
            const newGraph = {
              nodes: [...prevGraph.nodes, ...graphData.nodes],
              links: [...prevGraph.links, ...graphData.links],
            };
            return filteredGraph(newGraph);
          });

          reader.read().then(processText);
        });
      });
  };

  console.log(graph);

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
