"use client";
import { useCallback, useRef } from "react";
import { ForceGraph3D } from "react-force-graph";
import { useTheme } from "next-themes";

const Graph = ({ graph }: any) => {
  const fgRef = useRef<any>();
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

export default Graph;
