"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import NoGraph from "@/components/no-graph";
import Magic from "@/components/magic";
import { filteredGraph } from "@/lib/filter-graph";
import { ModeProps, Message } from "@/types";

const Graph = dynamic(() => import("../components/graph"), {
  ssr: false,
});

const ForceGraphComponent = () => {
  const [input, setInput] = useState("");
  const [graph, setGraph] = useState<{ nodes: any[]; links: any[] }>({
    nodes: [],
    links: [],
  });
  const [history, setHistory] = useState<Message[]>([]);
  const [mode, setMode] = useState<ModeProps>("default");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(input);
    setInput("");
  };

  const submit = async (inputText: string) => {
    if (!inputText) return;
    if (mode === "chat") {
      setHistory((prevHistory) => [
        ...prevHistory,
        { role: "human", text: inputText },
      ]);
      setTimeout(() => {
        setHistory((prevHistory) => [
          ...prevHistory,
          { role: "ai", text: "AI response to: " + inputText },
        ]);
      }, 1000);
      return;
    }
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
            mode={mode}
            history={history}
          />
        </>
      ) : (
        <NoGraph onSubmit={submit} />
      )}
    </div>
  );
};

export default ForceGraphComponent;
