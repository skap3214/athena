import { Document } from "langchain/document";
import { extractRelations, loadFromText, loadFromYoutubeLink } from "./extract";
import { insertRelations } from "./insert";



export async function updateGraph(text?: string, url?: string): Promise<void> {
    // Validate input
    if ((!text && !url) || (text && url)) {
        throw new Error("Either text OR url should be given");
    }

    // Convert to documents
    let documents: Document[];
    if (url) {
        documents = await loadFromYoutubeLink(url);
    } else {
        documents = await loadFromText(text!);
    }

    // Extract relations
    const relations = await extractRelations(documents);

    // Insert relations
    return insertRelations(documents, relations);
}