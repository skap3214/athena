import { Document } from "langchain/document";
import { insertEdge, insertNode } from "@/supabase/actions";

export async function insertRelations(
  documents: Document[],
  relations: any[],
): Promise<void> {
  const batchSize = 10; // Set the desired batch size

  for (let i = 0; i < documents.length; i += batchSize) {
    const batchDocuments = documents.slice(i, i + batchSize);
    const batchRelations = relations.slice(i, i + batchSize);

    const promises = batchDocuments.map(async (document, index) => {
      const documentRelations = batchRelations[index];

      for (const relation of documentRelations) {
        if (!relation) {
          continue;
        }
        const { node_1, node_2, edge } = relation;

        // Insert nodes
        const node1Id = await insertNode(node_1, document.metadata);
        const node2Id = await insertNode(node_2, document.metadata);

        // Insert edge
        await insertEdge(
          edge,
          node_1,
          node_2,
          document.pageContent,
          document.metadata,
        );
      }
    });

    await Promise.all(promises);
  }
}
