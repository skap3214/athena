import { Document } from "langchain/document";
import { Relation } from "@/types";
import { insertEdge, insertNode } from "@/supabase/actions";

export async function insertRelations(
  documents: Document[],
  relations: any[],
): Promise<void> {
  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const documentRelations = relations[i];

    for (const relation of documentRelations) {
      const { node_1, node_2, edge } = relation;

      // Insert nodes
      const node1Id = await insertNode(node_1, { source: "document" });
      const node2Id = await insertNode(node_2, { source: "document" });

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
