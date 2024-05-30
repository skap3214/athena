import { Document } from "langchain/document";
import { Dispatch, FormEventHandler, SetStateAction } from "react";

export type FileUploaderProps = {
  focus: boolean;
};

export type Relation = {
  node_1: string;
  node_2: string;
  edge: string;
}[];

export type Node = {
  id: string;
  data: string;
  metadata?: Record<string, any>;
};

export type Edge = {
  id: string;
  data: string;
  from: string;
  to: string;
  page_content: string;
  metadata?: Record<string, any>;
};

export type GraphNode = {
  id: string;
  description: string;
  document: Document;
}

export type GraphEdge = {
  id: string;
  content: string;
  source: string;
  target: string;
}

export type GraphData = {
  nodes: GraphNode[];
  links: GraphEdge[];
}

export type RecommendValueProps = {
  handleClick: (value: string) => void;
};

export type SubmitAreaProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  submit: (input: string | File) => void;
};

export type ModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type NoGraphProps = {
  onSubmit: (input: string) => void;
  loading: boolean;
  setLoading: Dispatch<boolean>;
};

export type ModeProps = "chat" | "default";

export type MagicProps = {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  input: string;
  setInput: Dispatch<string>;
  onTranscription: (transcription: string) => void;
  mode: ModeProps;
  history: any;
};

export type Message = {
  role: "ai" | "human";
  text: string;
};

export type NodeProps = {
  x: number;
  y: number;
  z: number;
  description: string;
  document: { pageContent: string };
};

export type MicrophoneProps = {
  onTranscription: (transcription: string) => void;
};
