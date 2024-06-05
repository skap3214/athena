"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import NoGraph from "@/components/no-graph";
import Magic from "@/components/magic";
import { filteredGraph } from "@/lib/graph";
import { ModeProps, Message, GraphNode, GraphEdge } from "@/types";
import Loading from "@/components/loading";
import { Document } from "langchain/document";
import getUser from "@/hooks/get-user";

const Graph = dynamic(() => import("../components/graph"), {
  ssr: false,
});

const ForceGraphComponent = () => {
  const [source, setSource] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const userId: string | undefined = getUser()?.id;
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
    if (!userId) return;
    if (!inputText) return;
    if (mode === "chat") {
      setHistory((prevHistory) => [
        ...prevHistory,
        { role: "human", text: inputText },
      ]);

      try {
        const response = await fetch("http://127.0.0.1:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: inputText,
            user_id: userId,
            chat_type: "node",
          }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let streamedText = "";

        if (reader) {
          let accumulatedText = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            streamedText += decoder.decode(value, { stream: true });
            console.log(streamedText);
            try {
              const data = JSON.parse(streamedText);
              accumulatedText += data.delta;
              if (source !== data.source) setSource(data.sources);

              setHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                const lastMessage = newHistory[newHistory.length - 1];
                if (lastMessage && lastMessage.role === "ai") {
                  lastMessage.text = accumulatedText;
                } else {
                  newHistory.push({ role: "ai", text: accumulatedText });
                }
                return newHistory;
              });
            } catch (error) {
              throw error;
              console.error("Error parsing JSON:", error);
            }
            streamedText = "";
          }
        }
      } catch (error) {
        throw error
        console.error("Error streaming chat response:", error);
      }
      return;
    }
    fetch("http://127.0.0.1:8000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: inputText,
        user_id: userId,
        // graph_id: "1", Add this back once we allow multiple "conversations" per user_id
        init: graph.nodes.length < 1,
        stream: true
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
          const document = graphData.document
          const relations = graphData.relations
          console.log(document);
          console.log(relations);
          let nodes: GraphNode[] = []
          let links: GraphEdge[] = []
          for (const rel_list of relations) {
            console.log(rel_list);
            nodes.push({
              description: rel_list.node_1.name,
              document: new Document({pageContent: document.page_content, metadata: document.metadata}),
              id: rel_list.node_1.id
            })
            nodes.push({
              description: rel_list.node_2.name,
              document: new Document({pageContent: document.page_content, metadata: document.metadata}),
              id: rel_list.node_2.id
            })
            links.push({
              source: rel_list.node_1.id,
              target: rel_list.node_2.id,
              content: rel_list.edge.name,
              id: rel_list.edge.id
            })
          }
          console.log(nodes);
          console.log(links);
          setGraph((prevGraph) => {
            console.log(prevGraph.nodes);
            console.log(prevGraph.links);
            const newGraph = {
              nodes: [...prevGraph.nodes, ...nodes],
              links: [...prevGraph.links, ...links],
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

  if (loading && graph.nodes.length === 0) {
    return (
      <div className="h-screen items-center w-full flex border justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-h-screen">
      {graph.nodes.length > 0 ? (
        <>
          <Graph graph={graph} source={source} />
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
        <NoGraph onSubmit={submit} loading={loading} setLoading={setLoading} />
      )}
    </div>
  );
};

export default ForceGraphComponent;
