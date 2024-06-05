import { GraphNode, GraphEdge, GraphData } from "@/types";
import {
  extractRelationsStreaming,
  loadFromText,
  loadFromYoutubeLink,
} from "./extract";
import { Document } from "langchain/document";
import { formatDocumentsAsString } from "langchain/util/document";
import generateUUID, { generateUniqueUUID } from "@/lib/id";
import { Vectorstore, ragChain, resetVectorstore } from "./config";
import { prepareDocuments } from "@/lib/graph";

export async function* updateGraphStreaming(
  text?: string,
  url?: string,
  file?: File,
  init: boolean = false,
): AsyncGenerator<GraphData, void, unknown> {
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

  const prepDocs = prepareDocuments(
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
    console.log("New vectorstore created.");
    Vectorstore.addDocuments(allDocs);
    console.log(`Added ${allDocs.length} to vectorstore`);
  } else {
    Vectorstore.addDocuments(allDocs);
    console.log(`Added ${allDocs.length} to vectorstore`);
  }
}

export async function* chatStreaming(
  question: string,
  type: "raw" | "node" | "edge" = "node",
): AsyncGenerator<any, void, unknown> {
  // Create retriever
  const retriever = Vectorstore.asRetriever({
    k: 5,
    filter: (document) => document.metadata.docType == type,
  });

  const documents = await retriever.invoke(question);
  const context = formatDocumentsAsString(documents);

  const input = {
    context: context,
    input: question,
  };
  const stream = await ragChain.stream(input);

  for await (const chunk of stream) {
    const out = {
      token: chunk,
      source: documents,
    };

    yield out;
  }
}
