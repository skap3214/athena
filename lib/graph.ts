import { GraphEdge, GraphNode } from "@/types";
import { Document } from "langchain/document";
import generateUUID from "./id";

export const filteredGraph = (graph: { nodes: any[]; links: any[] }) => {
  const uniqueNodes = new Map();
  const uniqueLinks = new Map();

  graph.nodes.forEach((node) => {
    if (!uniqueNodes.has(node.id)) {
      uniqueNodes.set(node.id, node);
    }
  });

  graph.links.forEach((link) => {
    const linkKey = `${link.source}-${link.target}-${link.content}`;
    if (!uniqueLinks.has(linkKey)) {
      uniqueLinks.set(linkKey, link);
    }
  });

  return {
    nodes: Array.from(uniqueNodes.values()),
    links: Array.from(uniqueLinks.values()),
  };
};

export function prepareDocuments(
  nodes: GraphNode[],
  links: GraphEdge[],
  documents: Document[],
) {
  let nodeDocuments: Document[] = [];
  let linkDocuments: Document[] = [];
  let rawDocuments: Document[] = [];

  for (const node of nodes) {
    nodeDocuments.push(
      new Document({
        pageContent: node.description,
        metadata: { id: node.id, docType: "node" },
      }),
    );
  }

  for (const link of links) {
    linkDocuments.push(
      new Document({
        pageContent: link.content,
        metadata: { id: link.id, docType: "edge" },
      }),
    );
  }

  for (const doc of documents) {
    rawDocuments.push(
      new Document({
        pageContent: doc.pageContent,
        metadata: { id: generateUUID(doc.pageContent), docType: "raw" },
      }),
    );
  }

  return {
    nodeDocuments: nodeDocuments,
    linkDocuments: linkDocuments,
    rawDocuments: rawDocuments,
  };
}