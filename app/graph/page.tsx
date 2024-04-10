"use client";
import { useEffect, useRef, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import { getGraph } from "../actions";
import { useTheme } from "next-themes";

const ForceGraphComponent = () => {
  const fgRef = useRef();
  const [graph, setGraph] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const graphData = await getGraph();
        setGraph(graphData);
      } catch (error) {
        // console.error('Error fetching graph data:', error);
      }
    };

    fetchGraph();
  }, []);

  return (
    <div className="max-h-screen">
      {graph && (
        <ForceGraph3D
          ref={fgRef}
          backgroundColor={theme === "light" ? "#FFFF" : "#0A0A0A"}
          graphData={graph!}
          nodeLabel="description"
          nodeAutoColorBy="group"
        />
      )}
    </div>
  );
};

export default ForceGraphComponent;
