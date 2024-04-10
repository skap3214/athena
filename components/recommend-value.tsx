import { RecommendValueProps } from "@/types";
import { MoveUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { data } from "@/data";

export const recommendations = [
  {
    label: "But what is a neural network? 3b1b",
    value: "https://www.youtube.com/watch?v=aircAruvnKk",
  },
  {
    label: "Nasa 2025 Mission Fact Sheet",
    value: data,
  },
  {
    label: "FTX Bankruptcy Explained!",
    value: "https://www.youtube.com/watch?v=zTFhnpf-IE0",
  },
  // {
  //   label: "What is NextJS?",
  //   value: "https://www.youtube.com/watch?v=vwSlYG7hFk0&pp=ygUGbmV4dGpz",
  // },
];

const RecommendValue = ({ handleClick }: RecommendValueProps) => {
  return (
    <section className="flex w-full items-center justify-center mt-2 gap-4 flex-row flex-wrap">
      {recommendations.map((recommendation, index) => (
        <Button
          size="sm"
          key={index}
          className="bg-neutral-700 rounded-md shadow-md p-2 space-x-1 flex"
          onClick={() => handleClick(recommendation.value)}
        >
          <span className="text-xs">{recommendation.label}</span>
          <MoveUpRight className="h-4 w-4" />
        </Button>
      ))}
    </section>
  );
};

export default RecommendValue;
