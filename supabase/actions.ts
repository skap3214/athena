import { Node, Edge } from "@/types";
import { createClient } from "@supabase/supabase-js";
import { Document } from "langchain/document";

// Create a single supabase client for interacting with your database
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function insertNode(
  data: string,
  metadata?: Record<string, any>,
): Promise<string> {
  // Check if a node with the same data already exists
  const { data: existingNode, error } = await client
    .from("nodes") // Add missing type argument for 'from' method
    .select("id")
    .eq("data", data)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }
  if (existingNode) {
    // Node already exists, return the existing node ID
    return existingNode.id;
  } else {
    // Insert a new node
    const { data: insertedNode, error: insertError } = await client
      .from("nodes")
      .insert({ data, metadata })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }
    return insertedNode.id;
  }
}

export async function insertEdge(
  data: string,
  fromNodeData: string,
  toNodeData: string,
  pageContent: string,
  metadata?: Record<string, any>,
): Promise<string> {
  // Get the IDs of the source and target nodes
  const fromNodeId = await insertNode(fromNodeData);
  const toNodeId = await insertNode(toNodeData);

  // Check if an edge with the same data already exists
  const { data: existingEdge, error } = await client
    .from("edges")
    .select("id")
    .eq("data", data)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }
  if (existingEdge) {
    // Edge already exists, return the existing edge ID
    return existingEdge.id;
  } else {
    // Insert a new edge
    const { data: insertedEdge, error: insertError } = await client
      .from("edges")
      .upsert({
        data,
        from: fromNodeId,
        to: toNodeId,
        page_content: pageContent,
        metadata,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return insertedEdge.id;
  }
}

export async function filterNewDocuments(
  documents: Document[],
): Promise<Document[]> {
  const batchSize = 1;
  const newDocuments: Document[] = [];

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    const pageContents = batch.map((doc) => doc.pageContent);

    const { data: existingEdges, error } = await client
      .from("edges")
      .select()
      .in("page_content", pageContents);

    if (error) {
      throw error;
    }

    const existingPageContents = new Set(
      existingEdges.map((edge) => edge.page_content),
    );

    const newBatchDocuments = batch.filter(
      (doc) => !existingPageContents.has(doc.pageContent),
    );

    newDocuments.push(...newBatchDocuments);
  }

  return newDocuments;
}

export async function getAllNodes(): Promise<Node[]> {
  const pageSize = 600;
  let page = 0;
  let nodes: Node[] = [];

  while (true) {
    const { data: pageNodes, error } = await client
      .from('nodes')
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      throw error;
    }

    nodes = [...nodes, ...pageNodes];

    if (pageNodes.length < pageSize) {
      break;
    }

    page++;
  }

  return nodes;
}

export async function getAllEdges(): Promise<Edge[]> {
  const pageSize = 600;
  let page = 0;
  let edges: Edge[] = [];

  while (true) {
    const { data: pageEdges, error } = await client
      .from('edges')
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      throw error;
    }

    edges = [...edges, ...pageEdges];

    if (pageEdges.length < pageSize) {
      break;
    }

    page++;
  }

  return edges;
}
