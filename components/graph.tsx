"use client";
import { useCallback, useEffect, useRef } from "react";
import { ForceGraph3D } from "react-force-graph";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";

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

  useEffect(() => {
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.25, 0.4, 0);
    fgRef.current.postProcessingComposer().addPass(bloomPass);
  }, []);

  return (
    <div className="max-h-screen">
      {graph && (
        <ForceGraph3D
          ref={fgRef}
          backgroundColor="black"
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
