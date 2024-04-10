import { Node, Edge } from '@/types';
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function insertNode(data: string, metadata?: Record<string, any>): Promise<string> {
    // Check if a node with the same data already exists
    const { data: existingNode, error } = await client
        .from('nodes') // Add missing type argument for 'from' method
        .select('id')
        .eq('data', data)
        .single();

    if (error && error.code !== 'PGRST116') {
        throw error;
    }

    if (existingNode) {
        // Node already exists, return the existing node ID
        return existingNode.id;
    } else {
        // Insert a new node
        const { data: insertedNode, error: insertError } = await client
            .from('nodes')
            .insert({ data, metadata })
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
    metadata?: Record<string, any>
): Promise<string> {
    // Get the IDs of the source and target nodes
    const fromNodeId = await insertNode(fromNodeData);
    const toNodeId = await insertNode(toNodeData);

    // Check if an edge with the same data already exists
    const { data: existingEdge, error } = await client
        .from('edges')
        .select('id')
        .eq('data', data)
        .single();

    if (error && error.code !== 'PGRST116') {
        throw error;
    }

    if (existingEdge) {
        // Edge already exists, return the existing edge ID
        return existingEdge.id;
    } else {
        // Insert a new edge
        const { data: insertedEdge, error: insertError } = await client
            .from('edges')
            .insert({
                data,
                from: fromNodeId,
                to: toNodeId,
                page_content: pageContent,
                metadata,
            })
            .single();

        if (insertError) {
            throw insertError;
        }

        return insertedEdge.id;
    }
}

export async function getAllNodes(): Promise<Node[]> {
    // Retrieve all nodes from the "nodes" table
    const { data: nodes, error } = await client.from('nodes').select('*');

    if (error) {
        throw error;
    }

    return nodes;
}

export async function getAllEdges(): Promise<Edge[]> {
    // Retrieve all edges from the "edges" table
    const { data: edges, error } = await client.from('edges').select('*');

    if (error) {
        throw error;
    }

    return edges;
}