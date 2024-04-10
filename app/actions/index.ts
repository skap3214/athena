"use server"
import { Document } from "langchain/document";
import { extractRelations, loadFromText, loadFromYoutubeLink } from "./extract";
import { insertRelations } from "./insert";
import { getAllEdges, getAllNodes } from "@/supabase/actions";

export async function updateGraph(text?: string, url?: string): Promise<void> {
    // Validate input
    if ((!text && !url) || (text && url)) {
        throw new Error("Either text OR url should be given");
    }

    // Convert to documents
    let documents: Document[];
    if (url) {
        console.log("Youtube link detected");
        documents = await loadFromYoutubeLink(url);
        console.log("documents loaded: ", documents.length)
    } else {
        console.log("Text detected");
        documents = await loadFromText(text!);
        console.log("documents loaded: ", documents.length)
    }

    // Extract relations
    const relations = await extractRelations(documents);

    // Insert relations
    return insertRelations(documents, relations);
}

// export async function getGraph() {
//     const edges = await getAllEdges();
//     const nodes = await getAllNodes();
//     console.log(edges);
//     console.log(nodes);

//     const nodesFormatted = nodes.map(node => { id: node.id, description: node.data })
//     const edgesFormatted = edges.map(edge => {})
//     const graph = {
//         'nodes': nodesFormatted,
//         'links': edges
//     }
// }