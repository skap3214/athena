"use server";
import { Document } from "langchain/document";
import { extractRelations, loadFromText, loadFromYoutubeLink } from "./extract";
import { insertRelations } from "./insert";
import {
  filterNewDocuments,
  getAllEdges,
  getAllNodes,
} from "@/supabase/actions";
import { Node, Edge } from "@/types";

export async function updateGraph(
  text?: string,
  url?: string,
  file?: File,
): Promise<void> {
  // Validate input
  let inputCount = 0;
  if (text) inputCount++;
  if (url) inputCount++;
  if (file) inputCount++;

  if (inputCount !== 1) {
    throw new Error("Exactly one of text, url, or file should be provided");
  }

  // Convert to documents
  let documents: Document[];
  if (file) {
    console.log("Coming soon...");
    return;
    // documents = await loadFromPDF(file);
  } else {
    if (url) {
      documents = await loadFromYoutubeLink(url);
      console.log("Documents extracted.");
    } else {
      documents = await loadFromText(text!);
    }
  }

  // Make sure documents are not duplicate
  documents = await filterNewDocuments(documents);
  console.log("Documents filtered.");

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
