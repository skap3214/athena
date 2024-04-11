"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getGraph } from "../actions";
import Loading from "@/components/loading";

const Graph = dynamic(() => import("../../components/graph"), {
  ssr: false,
});

const ForceGraphComponent = () => {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const graphData = await getGraph();
        setGraph(graphData);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchGraph();
  }, []);

  if (!graph) {
    return (
      <div className="h-screen w-full place-content-center flex">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-h-screen">
      <Graph graph={graph} />
    </div>
  );
};

export default ForceGraphComponent;
