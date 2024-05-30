import { GraphNode, GraphEdge } from "@/types";
import {
  extractRelationsStreaming,
  loadFromText,
  loadFromYoutubeLink,
} from "./extract";
import { Document } from "langchain/document";
import generateUUID, { generateUniqueUUID } from "@/lib/id";
import { Vectorstore, resetVectorstore } from "./config";

async function prepareDocuments(
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

export async function* updateGraphStreaming(
  text?: string,
  url?: string,
  file?: File,
  init: boolean = false,
): AsyncGenerator<{ nodes: GraphNode[]; links: GraphEdge[] }, void, unknown> {
  // Validate input
  let inputCount = 0;
  if (text) inputCount++;
  if (url) inputCount++;
  if (file) inputCount++;

  if (inputCount !== 1) {
    throw new Error("Exactly one of text, url, or file should be provided");
  }

  // Initialize accumulators
  const allNodes: Map<string, GraphNode> = new Map();
  const allLinks: GraphEdge[] = [];
  const allDocumentsSet: Set<string> = new Set();
  const allDocuments: Document[] = [];

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

  // Extract relations
  for await (const output of extractRelationsStreaming(documents)) {
    const rel_list = output.relations;
    const doc = output.document;

    if (!allDocumentsSet.has(doc.pageContent)) {
      allDocumentsSet.add(doc.pageContent);
      allDocuments.push(doc);
    }

    for (const relation of rel_list) {
      const node_1_data = relation.node_1;
      const edge_data = relation.edge;
      const node_2_data = relation.node_2;

      const node_1: GraphNode = {
        id: generateUUID(node_1_data),
        description: node_1_data,
        document: doc,
      };

      const node_2: GraphNode = {
        id: generateUUID(node_2_data),
        description: node_2_data,
        document: doc,
      };

      const edge: GraphEdge = {
        id: generateUniqueUUID(),
        content: edge_data,
        source: node_1.id,
        target: node_2.id,
      };

      // Add nodes to the map if they don't already exist
      if (!allNodes.has(node_1.id)) {
        allNodes.set(node_1.id, node_1);
      }
      if (!allNodes.has(node_2.id)) {
        allNodes.set(node_2.id, node_2);
      }

      // Add link to the array
      allLinks.push(edge);
    }

    const graphData = {
      nodes: Array.from(allNodes.values()),
      links: allLinks,
    };

    yield graphData;
  }

  const prepDocs = await prepareDocuments(
    Array.from(allNodes.values()),
    allLinks,
    allDocuments,
  );
  const allDocs = [
    ...prepDocs.linkDocuments,
    ...prepDocs.nodeDocuments,
    ...prepDocs.rawDocuments,
  ];
  if (init) {
    let Vectorstore = resetVectorstore();
    Vectorstore.addDocuments(allDocs);
  } else {
    Vectorstore.addDocuments(allDocs);
  }
}
