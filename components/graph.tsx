"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import { GeistMono } from "geist/font/mono";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { NodeProps } from "@/types";

const Graph = ({ graph }: any) => {
  const [doc, setDoc] = useState<NodeProps | null>(null);
  const fgRef = useRef<any>();

  const handleClick = useCallback(
    (node: NodeProps) => {
      setDoc(node);
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
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.25,
      0.4,
      0,
    );
    fgRef?.current?.postProcessingComposer().addPass(bloomPass);
  }, []);

  return (
    <div className={`${GeistMono.className} max-h-screen`}>
      <div className="absolute max-w-[40%] w-fit text-right flex flex-col space-y-1 z-20 m-2 p-2 text-white top-0 right-0">
        <span className="text-3xl font-semibold mb-2 uppercase">
          {doc?.description}
        </span>
        <div className="text-lg text-neutral-300">
          {doc?.document.pageContent}
        </div>
      </div>
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
