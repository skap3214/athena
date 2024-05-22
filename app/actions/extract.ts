import { Document } from "langchain/document";
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser, JsonOutputParser } from "@langchain/core/output_parsers";
// import fs from 'fs';
// import os from 'os';
// import path from 'path';
import { YoutubeGrabTool } from "@/lib/youtube";

function getVideoId(videoUrl: string): string {
  const match = videoUrl.match(
    /(?:(?:https?:)?\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)/,
  );
  return match ? match[1] : "";
}
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 30,
});
const contextString: string = `
You are a network graph maker who extracts terms and their relations from a given context. You are provided with a context chunk (delimited by \`\`\`) Your task is to extract the ontology of terms mentioned in the given context. These terms should represent the key concepts as per the context. 
Thought 1: While traversing through each sentence, Think about the key terms mentioned in it.
    Terms should include object, entity, location, organization, person, 
    condition, acronym, documents, service, concept or similar
    Terms should be as atomistic and singular as possible.

Thought 2: Think about how these terms can have one on one relation with other terms.
    Terms that are mentioned in the same sentence or the same paragraph are typically related to each other.
    Terms can be related to many other terms

Thought 3: Find out the relation between each such related pair of terms. 

Format your output as a list of json. Each element of the list contains a pair of terms and the relation between them, like the following: 
[
   {{
       "node_1": "A concept from extracted ontology",
       "node_2": "A related concept from extracted ontology",
       "edge": "relationship between the two concepts, node_1 and node_2 in one or two sentences"
   }}, {{...}}
]
YOUR RESPONSE SHOULD ALWAYS BE JSON COMPATIBLE. Do not add markdown in your response, just plain JSON.`;
const prompt = ChatPromptTemplate.fromMessages([
  ["system", contextString],
  ["human", "```{input}```"],
]);
const model = new ChatGroq({ temperature: 0.1, model: "llama3-70b-8192" });
// const model = new ChatOpenAI({ temperature: 0.1 });
const outputParser = new JsonOutputParser();
const extract_chain = prompt.pipe(model).pipe(outputParser);

// export async function loadFromYoutubeLink(url: string): Promise<Document[]> {
//     const loader = YoutubeLoader.createFromUrl(url, {
//         addVideoInfo: false,
//     });

//     const documents = await loader.load();

//     return documents;
// }

export async function loadFromYoutubeLink(url: string): Promise<Document[]> {
  const videoId = getVideoId(url);
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
  // const relations = await extract_chain.batch(
    // documents.map((doc) => ({ input: doc.pageContent })),
    // { maxConcurrency: 1 }
  // );
  let relations: any = [];
  let count = 1;
  console.log("Extracting from: ", documents.length)
  for (const doc of documents) {
    const pageContent = doc.pageContent;
    const metadata = doc.metadata;
    console.log(`extracting doc ${count}`);
    count++;
    const rel_list = await extract_chain.invoke({input: doc.pageContent})
    console.log(rel_list);
    relations.push(rel_list);
  }
  console.log(relations);
  return relations;
  const relationsOutput = relations.map((rel_list) => {
    if (rel_list.startsWith("```json") && rel_list.endsWith("```")) {
      // Remove the markdown formatting
      const jsonString = rel_list.slice(7, -3).trim();
      return JSON.parse(jsonString);
    } else {
      try {
        // Assume the rel_list is a direct JSON string
        return JSON.parse(rel_list);
      } catch (error) {
        // console.log("Failed JSON parsing: ", error);
        return [];
      }
    }
  });

  return relationsOutput;
}
