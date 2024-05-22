"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getGraph } from "../actions";
import Loading from "@/components/loading";

const Graph = dynamic(() => import("../../components/graph"), {
  ssr: false,
});

const data = {
  nodes: [
    {
      id: "284b8891-74b9-4d21-8184-6bad76e31dbf",

      description: "time",
    },

    {
      id: "f4d95b0f-0b2a-4b4d-8cbf-8f3ebf3584c2",

      description: "research project",
    },

    {
      id: "9bd20c3a-94f8-4833-8a43-5bcc63806de6",

      description: "AI research",
    },

    {
      id: "81eda161-4eeb-4ffe-979a-bdd2c8efd908",

      description: "computation",
    },

    {
      id: "01c2a896-55ee-4c5f-b34c-69f423d53623",

      description: "investment",
    },

    {
      id: "33f4e8be-5688-4eff-b4a9-1825f913c967",

      description: "human knowledge",
    },

    {
      id: "e80a70b8-d219-47c3-8265-7f0bcb6bc9f5",

      description: "Moore's law",
    },

    {
      id: "621dcb92-82a8-4c5d-a246-061376580873",

      description: "domain",
    },

    {
      id: "83099259-7e1d-4b33-98fb-b83b1cd45534",

      description: "approach",
    },

    {
      id: "28cb980b-536b-4281-a007-3d8768b349b3",

      description: "human-knowledge approach",
    },

    {
      id: "013ff7a8-75dd-4ae1-9961-323675914e6a",

      description: "improvement",
    },

    {
      id: "8347c98d-78a1-4013-a5fe-32658afcf6ac",

      description: "performance",
    },

    {
      id: "83a1553d-72b0-4dd4-9338-cc65ffa25673",

      description: "agent",
    },

    {
      id: "b6cdbdb6-2404-4957-bce7-255bd80c3d21",

      description: "methods",
    },

    {
      id: "ee377636-a00f-48be-baad-faad1137667e",

      description: "researchers",
    },

    {
      id: "beae0d33-4176-4a89-9f79-51c0b220f377",

      description: "long run",
    },

    {
      id: "6d565b81-fce6-4e21-8344-34ee5d02f856",

      description: "AI researchers",
    },

    {
      id: "2e229ab2-82be-4d6d-b294-9563325c954d",

      description: "bitter lesson",
    },
  ],
  links: [
    {
      source: "f4d95b0f-0b2a-4b4d-8cbf-8f3ebf3584c2",

      target: "81eda161-4eeb-4ffe-979a-bdd2c8efd908",

      content: "research project leverages computation",
    },

    {
      source: "9bd20c3a-94f8-4833-8a43-5bcc63806de6",

      target: "81eda161-4eeb-4ffe-979a-bdd2c8efd908",

      content: "AI research leverages computation",
    },

    {
      source: "284b8891-74b9-4d21-8184-6bad76e31dbf",

      target: "01c2a896-55ee-4c5f-b34c-69f423d53623",

      content: "Time is spent on investment in one approach.",
    },

    {
      source: "01c2a896-55ee-4c5f-b34c-69f423d53623",

      target: "83099259-7e1d-4b33-98fb-b83b1cd45534",

      content: "Investment is made in one approach.",
    },

    {
      source: "81eda161-4eeb-4ffe-979a-bdd2c8efd908",

      target: "e80a70b8-d219-47c3-8265-7f0bcb6bc9f5",

      content:
        "Moore's law generalizes the exponentially falling cost per unit of computation",
    },

    {
      source: "33f4e8be-5688-4eff-b4a9-1825f913c967",

      target: "621dcb92-82a8-4c5d-a246-061376580873",

      content: "human knowledge is of the domain",
    },

    {
      source: "9bd20c3a-94f8-4833-8a43-5bcc63806de6",

      target: "33f4e8be-5688-4eff-b4a9-1825f913c967",

      content: "AI research has been conducted leveraging human knowledge",
    },

    {
      source: "83099259-7e1d-4b33-98fb-b83b1cd45534",

      target: "28cb980b-536b-4281-a007-3d8768b349b3",

      content: "Human-knowledge approach is a type of approach.",
    },

    {
      source: "013ff7a8-75dd-4ae1-9961-323675914e6a",

      target: "8347c98d-78a1-4013-a5fe-32658afcf6ac",

      content: "improvement makes a difference in performance",
    },

    {
      source: "81eda161-4eeb-4ffe-979a-bdd2c8efd908",

      target: "83a1553d-72b0-4dd4-9338-cc65ffa25673",

      content: "computation is available to the agent",
    },

    {
      source: "28cb980b-536b-4281-a007-3d8768b349b3",

      target: "b6cdbdb6-2404-4957-bce7-255bd80c3d21",

      content: "Human-knowledge approach complicates methods.",
    },

    {
      source: "ee377636-a00f-48be-baad-faad1137667e",

      target: "33f4e8be-5688-4eff-b4a9-1825f913c967",

      content: "researchers seek to leverage human knowledge",
    },

    {
      source: "b6cdbdb6-2404-4957-bce7-255bd80c3d21",

      target: "81eda161-4eeb-4ffe-979a-bdd2c8efd908",

      content:
        "Methods leveraging computation are affected by human-knowledge approach.",
    },

    {
      source: "81eda161-4eeb-4ffe-979a-bdd2c8efd908",

      target: "beae0d33-4176-4a89-9f79-51c0b220f377",

      content: "computation matters in the long run",
    },

    {
      source: "6d565b81-fce6-4e21-8344-34ee5d02f856",

      target: "2e229ab2-82be-4d6d-b294-9563325c954d",

      content: "AI researchers learned a bitter lesson.",
    },
  ],
};

const ForceGraphComponent = () => {
  const [graph, setGraph] = useState(data);

  if (!graph) {
    return (
      <div className="h-screen w-full place-content-center flex">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-h-screen">
      <Graph graph={graph} />
    </div>
  );
};

export default ForceGraphComponent;
