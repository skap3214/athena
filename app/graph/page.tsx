"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import { getGraph } from "../actions";
import { useTheme } from "next-themes";

const ForceGraphComponent = () => {
  const fgRef = useRef<any>();
  const [graph, setGraph] = useState(null);
  const { theme } = useTheme();

  const handleClick = useCallback(
    (node: { x: number; y: number; z: number }) => {
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
          nodeAutoColorBy="group"
          onNodeClick={handleClick}
          showNavInfo={false}
        />
      )}
    </div>
  );
};

export default ForceGraphComponent;
