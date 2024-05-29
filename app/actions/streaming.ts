import { Node, Edge } from "@/types";
import {
  extractRelationsStreaming,
  loadFromText,
  loadFromYoutubeLink,
} from "./extract";
import { Document } from "langchain/document";
import generateUUID from "@/lib/id";

export async function* updateGraphStreaming(
  text?: string,
  url?: string,
  file?: File,
): AsyncGenerator<
  { nodes: Map<string, any>[]; links: Map<string, any>[] },
  void,
  unknown
> {
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
    let nodes: any[] = [];
    let edges: any[] = [];
    for (const relation of rel_list) {
      const node_1_data = relation.node_1;
      const edge_data = relation.edge;
      const node_2_data = relation.node_2;

      const node_1 = {
        id: generateUUID(node_1_data),
        description: node_1_data,
        document: doc,
      };

      const node_2 = {
        id: generateUUID(node_2_data),
        description: node_2_data,
        document: doc,
      };

      const edge = {
        id: generateUUID(edge_data),
        content: edge_data,
        source: node_1.id,
        target: node_2.id,
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
