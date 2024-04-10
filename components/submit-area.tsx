import { SubmitAreaProps } from "@/types";
import { Textarea } from "./ui/textarea";
import { checkInputType } from "@/lib/check-input-type";
import { CaseUpper, ArrowRight } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import CommunityGraph from "./community-graph";
import RecommendValue from "./recommend-value";
import { Button } from "./ui/button";

const SubmitArea = ({
  handleSubmit,
  value,
  setValue,
  submit,
}: SubmitAreaProps) => {
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-[600px] w-full space-y-1 flex flex-col items-end"
      >
        <Textarea
          autoFocus
          className="flex-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something or paste a YouTube video link"
        />
        <div className="flex w-full justify-between">
          <div>
            {value &&
              (checkInputType(value) ? (
                <FaYoutube className="h-5 mt-1.5 w-5" />
              ) : (
                <CaseUpper className="h-5 mt-1.5 w-5" />
              ))}
          </div>
          <Button
            size="sm"
            className="dark:hover:bg-transparent/30"
            variant="ghost"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </form>
      <RecommendValue handleClick={(value) => submit(value)} />
      <div className="absolute bottom-0 mb-8">
        <CommunityGraph />
      </div>
    </>
  );
};

export default SubmitArea;
