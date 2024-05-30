import { ChatGroq } from "@langchain/groq";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {
    JsonOutputParser,
    StringOutputParser
  } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { OpenAIEmbeddings } from "@langchain/openai";

// Models
export const ExtractLLM = new ChatGroq({ temperature: 0.1, model: "llama3-70b-8192" });
export const ChatLLM = new ChatGroq({ temperature: 0.1, model: "llama3-70b-8192" });
export const Embeddings = new OpenAIEmbeddings( {modelName: "text-embedding-3-large"} );

// Vectorstore
export let Vectorstore = new MemoryVectorStore(Embeddings)

export function resetVectorstore() {
  Vectorstore = new MemoryVectorStore(Embeddings);
  return Vectorstore;
}

// Relations Extraction chain
const extractSystemPrompt: string = `
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

const extractPrompt = ChatPromptTemplate.fromMessages([
  ["system", extractSystemPrompt],
  ["human", "```{input}```"],
]);

const extractOutputParser = new JsonOutputParser();

export const extractChain = extractPrompt.pipe(ExtractLLM).pipe(extractOutputParser);

// RAG chat chain
const ragSystemPrompt: string = `\
You are a helpful assistant. You are tasked with answering questions about a retrieved context given to you in delimiters.
\`\`\`
{context}
\`\`\`
If you don't know the answer, just say you don't know.\
`;

export const ragPrompt = ChatPromptTemplate.fromMessages([
  ["system", ragSystemPrompt],
  ["human", "```{input}```"],
]);

export const ragOutputParser = new StringOutputParser();

export const ragChain = ragPrompt.pipe(ChatLLM).pipe(ragOutputParser);