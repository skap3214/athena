"use client";
import { data } from "@/data";
import { useRef } from "react";
import { ForceGraph3D } from "react-force-graph";

const ForceGraphComponent = () => {
  const fgRef = useRef<any>();

  return (
    <div className="max-h-screen">
      <ForceGraph3D
        ref={fgRef}
        backgroundColor="#0A0A0A"
        graphData={data}
        nodeLabel="description"
        nodeAutoColorBy="group"
      />
    </div>
  );
};

export default ForceGraphComponent;
