import { Dispatch, SetStateAction } from "react";

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
  from: string; // Node id
  to: string; // Node id
  page_content: string;
  metadata?: Record<string, any>;
};

export type RecommendValueProps = {
  handleClick: (value: string) => void;
};

export type SubmitAreaProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  submit: (input: string | File) => void;
};
