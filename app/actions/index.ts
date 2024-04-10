"use server";
import { Document } from "langchain/document";
import { extractRelations, loadFromText, loadFromYoutubeLink } from "./extract";
import { insertRelations } from "./insert";
import { getAllEdges, getAllNodes } from "@/supabase/actions";
import { Node, Edge } from "@/types";

export async function updateGraph(text?: string, url?: string): Promise<void> {
  // Validate input
  if ((!text && !url) || (text && url)) {
    throw new Error("Either text OR url should be given");
  }

  // Convert to documents
  let documents: Document[];
  if (url) {
    documents = await loadFromYoutubeLink(url);
  } else {
    documents = await loadFromText(text!);
  }

  // Extract relations
  const relations = await extractRelations(documents);

  // Insert relations
  return insertRelations(documents, relations);
}

export async function getGraph(): Promise<any> {
  const edges = await getAllEdges();
  const nodes = await getAllNodes();

  const formattedNodes = nodes.map((node: Node) => ({
    id: node.id,
    description: node.data,
  }));

  const formattedEdges = edges.map((edge: Edge) => ({
    source: edge.from,
    target: edge.to,
    content: edge.data,
  }));

  const graphData = {
    nodes: formattedNodes,
    links: formattedEdges,
  };
  return graphData;
}
