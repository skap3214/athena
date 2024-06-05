"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { LinkProps, NodeProps } from "@/types";
import { X } from "lucide-react";
import { Button } from "./ui/button";

const NODE_R = 8;

const Graph = ({ graph, source: sources }: any) => {
  const [doc, setDoc] = useState<NodeProps | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const fgRef = useRef<any>();

  useEffect(() => {
    if (sources.length === 0) return;
    handleClick(mapNodeIdToNode(sources[0].node_1.id));
    for (const source of sources) {
      highlightNodes.add(mapNodeIdToNode(source.node_1.id));
      highlightNodes.add(mapNodeIdToNode(source.node_2.id));
      highlightLinks.add(mapLinkIdToLink(source.edge.id));
    }
  }, [sources]);

  function mapNodeIdToNode(nodeId: string) {
    for (const node of graph.nodes) {
      if (node.id === nodeId) {
        return node;
      }
    }
  }

  function mapLinkIdToLink(linkId: string) {
    for (const link of graph.links) {
      if (link.id === linkId) {
        return link;
      }
    }
  }

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

  const findConnections = (nodeId: string) => {
    const connections: any = [];
    if (graph !== null) {
      for (const connection of graph.links) {
        if (
          connection.source.id === nodeId ||
          connection.target.id === nodeId
        ) {
          connections.push({
            connection,
          });
        }
      }
      return connections;
    }
  };

  const updateHighlight = () => {
    setHighlightNodes(new Set(highlightNodes));
    setHighlightLinks(new Set(highlightLinks));
  };

  const handleNodeHighlight = (node: NodeProps) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      findConnections(node.id)?.forEach((connection: any) => {
        highlightNodes.add(connection.connection.target);
        highlightNodes.add(connection.connection.source);
      });
      findConnections(node.id)?.forEach((connection: any) =>
        highlightLinks.add(connection.connection),
      );
    }
    updateHighlight();
  };

  const handleLinkHighlight = (link: LinkProps) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }
    updateHighlight();
  };

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
    <div className="max-h-screen">
      {doc && (
        <div className="absolute max-w-[40%] w-fit text-right items-end flex flex-col space-y-1 z-20 m-2 p-2 text-white top-0 right-0">
          <div className="text-2xl md:text-3xl flex-row h-full items-center flex space-x-2 font-semibold mb-2 uppercase">
            <span>{doc?.description}</span>
            <Button
              variant="secondary"
              className="rounded-full h-6 w-6 p-1"
              size="icon"
              onClick={() => setDoc(null)}
            >
              <X />
            </Button>
          </div>
          <div className="md:text-lg text-neutral-300">
            {doc?.document.pageContent}
          </div>
        </div>
      )}
      {graph && (
        <ForceGraph3D
          ref={fgRef}
          backgroundColor="black"
          graphData={graph}
          nodeLabel="description"
          nodeAutoColorBy="id"
          onNodeClick={handleClick}
          showNavInfo={false}
          linkLabel="content"
          linkAutoColorBy="content"
          linkWidth={(link) => (highlightLinks.has(link) ? 6 : 1)}
          linkDirectionalParticles={4}
          linkDirectionalParticleWidth={(link) =>
            highlightLinks.has(link) ? 6 : 0
          }
          onNodeHover={handleNodeHighlight as any}
          onLinkHover={handleLinkHighlight as any}
          nodeThreeObject={(node) => {
            const obj = new THREE.Mesh(
              new THREE.SphereGeometry(NODE_R),
              new THREE.MeshBasicMaterial({
                color: highlightNodes.has(node) ? "yellow" : node.color,
              }),
            );
            if (highlightNodes.has(node)) {
              const ring = new THREE.Mesh(
                new THREE.RingGeometry(NODE_R * 1.4, NODE_R * 1.6, 32),
                new THREE.MeshBasicMaterial({
                  side: THREE.DoubleSide,
                }),
              );
              ring.position.set(node.x, node.y, node.z);
              ring.lookAt(fgRef.current.cameraPosition());
              obj.add(ring);
            }
            return obj;
          }}
        />
      )}
    </div>
  );
};

export default Graph;
