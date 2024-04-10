import { Document } from "langchain/document";
import { Relation } from "@/types";
import { insertEdge, insertNode } from "@/supabase/actions";

export async function insertRelations(
  documents: Document[],
  relations: any[],
): Promise<void> {
  console.log("Inserting...");
  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const documentRelations = relations[i];
    for (const relation of documentRelations) {
      console.log(`i: ${i} node_1: ${relation.node_1} node_2: ${relation.node_2} edge: ${relation.edge}`)
      const { node_1, node_2, edge } = relation;

      // Insert nodes
      const node1Id = await insertNode(node_1, document.metadata);
      console.log("Node1 inserted");
      const node2Id = await insertNode(node_2, document.metadata);
      console.log("Node2 inserted");

      // Insert edge
      await insertEdge(
        edge,
        node_1,
        node_2,
        document.pageContent,
        document.metadata,
      );
    }
  }
}
