"use client";
import dynamic from "next/dynamic";
import { useRef, useState, useCallback, useEffect } from "react";
import { getGraph } from "../actions";
import { useTheme } from "next-themes";

const ForceGraph3D = dynamic(
  () => import("react-force-graph").then((mod) => mod.ForceGraph3D),
  {
    ssr: false,
  },
);

const ForceGraphComponent = () => {
  const fgRef = useRef<any>();
  const [graph, setGraph] = useState(null);
  const { theme } = useTheme();

  const handleClick = useCallback(
    (node: any) => {
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      fgRef.current?.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        3000,
      );
    },
    [fgRef],
  );

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
          nodeAutoColorBy="id"
          onNodeClick={handleClick}
          showNavInfo={false}
          linkLabel="content"
          linkAutoColorBy="content"
          linkWidth={2}
        />
      )}
    </div>
  );
};

export default ForceGraphComponent;
