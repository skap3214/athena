import { Document } from "langchain/document";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 30,
});

const contextString: string = `
You are a network graph maker who extracts terms and their relations from a given context. You are provided with a context chunk (delimited by \`\`\`) Your task is to extract the ontology of terms mentioned in the given context. These terms should represent the key concepts as per the context. 
Thought 1: While traversing through each sentence, Think about the key terms mentioned in it.
    Terms may include object, entity, location, organization, person, 
    condition, acronym, documents, service, concept, etc.
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
`;

const prompt = ChatPromptTemplate.fromMessages([
    ["system", contextString],
    ["human", "{input}"],
]);
const model = new ChatOpenAI({ temperature: 0.1 });
const outputParser = new StringOutputParser();
const extract_chain = prompt.pipe(model).pipe(outputParser);

export async function loadFromYoutubeLink(url: string): Promise<Document[]> {
    const loader = YoutubeLoader.createFromUrl(url, {
        addVideoInfo: true,
    });

    const documents = await loader.load();

    console.log(documents);

    return documents;
}

export async function loadFromText(text: string): Promise<Document[]> {
    const documents = await splitter.splitText(text);
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


export async function extractRelations(documents: Document[]): Promise<Map<string, any>[]> {
    const relations = await extract_chain.batch(documents.map(doc => ({ input: doc.pageContent })));
    const relationsOutput = relations.map(rel_list => JSON.parse(rel_list))
    console.log("Relations extracted: ", relationsOutput.length)
    return relationsOutput;
}
