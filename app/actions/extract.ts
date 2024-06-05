import { Document } from "langchain/document";
import { YoutubeGrabTool } from "@/lib/youtube";
import { Vectorstore, extractChain } from "./config";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GraphData, GraphEdge, GraphNode } from "@/types";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 30,
});

export async function loadFromYoutubeLink(url: string): Promise<Document[]> {
  const videoId = YoutubeGrabTool.retrieveVideoId(url);
  const transcript = await YoutubeGrabTool.fetchTranscript(videoId);
  let documents: Document[] = [];

  for (const item of transcript) {
    const document = new Document({
      pageContent: item.text,
      metadata: { start: item.duration, source: videoId },
    });
    documents.push(document);
  }

  documents = await splitter.splitDocuments(documents);
  return documents;
}

// export async function loadFromPDF(file: File): Promise<Document[]> {
//     // Generate a unique temporary file path
//     const tempFilePath = path.join(os.tmpdir(), `temp-${Date.now()}.pdf`);

//     // Write the File object to the temporary file path
//     await new Promise<void>((resolve, reject) => {
//         const fileReader = new FileReader();

//         fileReader.onload = () => {
//             fs.writeFile(tempFilePath, new Uint8Array(fileReader.result as ArrayBuffer), (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
//         };

//         fileReader.onerror = () => {
//             reject(new Error('Failed to read the file.'));
//         };

//         fileReader.readAsArrayBuffer(file);
//     });

//     try {
//         // Load the PDF using the temporary file path
//         const loader = new PDFLoader(
//             tempFilePath,
//             {
//                 pdfjs: () => import("pdfjs-dist/legacy/build/pdf.js").then(m => m.default),
//                 parsedItemSeparator: "",
//             }
//         );
//         const docs = await loader.load();
//         const documents = await splitter.splitDocuments(docs);
//         return documents;
//     } catch (error: any) {
//         fs.unlinkSync(tempFilePath);
//         throw new Error(`Failed to load PDF: ${error.message}`);
//     } finally {
//         // Delete the temporary file
//         fs.unlinkSync(tempFilePath);
//     }
// }

export async function loadFromText(text: string): Promise<Document[]> {
  console.log("Splitting");
  const documents = await splitter.splitText(text);
  console.log("Formatting");
  const docOutput = documents.map(
    (doc) => new Document({ pageContent: doc, metadata: {} }),
  );
  return docOutput;
}

export async function splitDocuments(
  documents: Document[],
): Promise<Document[]> {
  const docOutput = await splitter.splitDocuments(documents);
  return docOutput;
}

export async function extractRelations(
  documents: Document[],
): Promise<Map<string, any>[]> {
  console.log("Extracting...");
  let relations: Map<string, any>[] = [];
  let count = 1;
  console.log("Extracting from: ", documents.length);
  for (const doc of documents) {
    console.log(`extracting doc ${count}`);
    count++;
    const rel_list: any = await extractChain.invoke({
      input: doc.pageContent,
    });
    console.log(rel_list);
    relations.push(rel_list);
  }
  console.log(relations);
  return relations;
}

export async function* extractRelationsStreaming(
  documents: Document[],
): AsyncGenerator<any, void, unknown> {
  let count = 1;
  console.log("Documents: ", documents.length);
  for (const doc of documents) {
    console.log(`Extract doc no.${count}`);
    count++;
    const rel_list: any = await extractChain.invoke({
      input: doc.pageContent,
    });
    yield {
      relations: rel_list,
      document: doc,
    };
  }
}
