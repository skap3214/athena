import { RecommendValueProps } from "@/types";
import { MoveUpRight } from "lucide-react";
import { Button } from "./ui/button";
export const recommendations = [
  {
    label: "What is NextJS?",
    value: "https://www.youtube.com/watch?v=vwSlYG7hFk0&pp=ygUGbmV4dGpz",
  },
  {
    label: "What is NextJS?",
    value: "https://www.youtube.com/watch?v=vwSlYG7hFk0&pp=ygUGbmV4dGpz",
  },
  {
    label: "What is NextJS?",
    value: "https://www.youtube.com/watch?v=vwSlYG7hFk0&pp=ygUGbmV4dGpz",
  },
  {
    label: "What is NextJS?",
    value: "https://www.youtube.com/watch?v=vwSlYG7hFk0&pp=ygUGbmV4dGpz",
  },
];

const RecommendValue = ({ handleClick }: RecommendValueProps) => {
  return (
    <section className="flex w-full items-center justify-center mt-2 gap-4 flex-row flex-wrap">
      {recommendations.map((recommendation, index) => (
        <Button
          size="sm"
          key={index}
          className="bg-neutral-700 rounded-xl shadow-md p-2 space-x-1 flex"
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
