"use server";
import { Document } from "langchain/document";
import { extractRelations, loadFromText, loadFromYoutubeLink, extractRelationsStreaming } from "./extract";
import { insertRelations } from "./insert";
import {
  filterNewDocuments,
  getAllEdges,
  getAllNodes,
} from "@/supabase/actions";
import { Node, Edge } from "@/types";
import generateUUID from "@/lib/id";

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
      console.log("Loading youtube...");
      documents = await loadFromYoutubeLink(url);
      console.log("Documents extracted.");
    } else {
      console.log("Loading text...");
      documents = await loadFromText(text!);
    }
  }

  // Make sure documents are not duplicate
  console.log("Filtering documents");
  documents = await filterNewDocuments(documents);
  console.log("Documents filtered.");

  // Extract relations
  const relations = await extractRelations(documents);

  // Insert relations
  return insertRelations(documents, relations);
}

export async function* updateGraphStreaming(
  text?: string,
  url?: string,
  file?: File,
): AsyncGenerator<any, void, unknown> {
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
      console.log("Loading youtube...");
      documents = await loadFromYoutubeLink(url);
      console.log("Documents extracted.");
    } else {
      console.log("Loading text...");
      documents = await loadFromText(text!);
    }
  }

  // Make sure documents are not duplicate
  // console.log("Filtering documents");
  // documents = await filterNewDocuments(documents);
  // console.log("Documents filtered.");

  // Extract relations
  for await (const output of extractRelationsStreaming(documents)) {
    const rel_list = output.relations;
    const doc = output.document;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    for (const relation of rel_list) {
      const node_1_data = relation.node_1;
      const edge_data = relation.edge;
      const node_2_data = relation.node_2;

      const node_1: Node = {
        id: generateUUID(node_1_data),
        data: node_1_data,
      };

      const node_2: Node = {
        id: generateUUID(node_2_data),
        data: node_2_data,
      };

      const edge: Edge = {
        id: generateUUID(edge_data),
        data: edge_data,
        from: node_1.id,
        to: node_2.id,
        page_content: doc.pageContent,
      };
      nodes.push(node_1);
      nodes.push(node_2);
      edges.push(edge);
  }
    const graphData = {
      nodes: nodes,
      links: edges,
    };

    yield graphData;
  }
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
