"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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

const empty_data = {
  nodes: [],
  links: []
}
const ForceGraphComponent = () => {
  const [graph, setGraph] = useState(empty_data);

  if (!graph) {
    return (
      <div className="h-screen w-full place-content-center flex">
        <Loading />
      </div>
    );
  }

  const addDummyData = async () => {
    const dummy_text = "The biggest lesson that can be read from 70 years of AI research is that general methods that leverage computation are ultimately the most effective, and by a large margin. The ultimate reason for this is Moore's law, or rather its generalization of continued exponentially falling cost per unit of computation. Most AI research has been conducted as if the computation available to the agent were constant (in which case leveraging human knowledge would be one of the only ways to improve performance) but, over a slightly longer time than a typical research project, massively more computation inevitably becomes available. Seeking an improvement that makes a difference in the shorter term, researchers seek to leverage their human knowledge of the domain, but the only thing that matters in the long run is the leveraging of computation. These two need not run counter to each other, but in practice they tend to. Time spent on one is time not spent on the other. There are psychological commitments to investment in one approach or the other. And the human-knowledge approach tends to complicate methods in ways that make them less suited to taking advantage of general methods leveraging computation.  There were many examples of AI researchers' belated learning of this bitter lesson, and it is instructive to review some of the most prominent.";
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: dummy_text
        // or
        // url: "https://example.com"
        // or
        // file: someFileObject
      })
    })
    .then(response => response.body)
    .then(body => {
      const reader = body.getReader();
      const decoder = new TextDecoder();
      
      reader.read().then(function processText({ done, value }) {
        if (done) {
          console.log('Stream complete');
          return;
        }
    
        const graphData = JSON.parse(decoder.decode(value));
        console.log(graphData);
        
        setGraph((prevGraph) => ({
          nodes: [...prevGraph.nodes, ...graphData.nodes],
          links: [...prevGraph.links, ...graphData.links],
        }));
      
        reader.read().then(processText);
      });
    });
  };

  return (
    <div className="max-h-screen">
      <div className="z-[99999] absolute bottom-0 right-0">
        <button onClick={addDummyData} className="bg-blue-500 z-[30] cursor-pointer text-center w-full text-white p-2 rounded">Add Dummy Data</button>
      </div>
      <Graph graph={graph} />
    </div>
  );
};

export default ForceGraphComponent;
