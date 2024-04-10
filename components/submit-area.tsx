"use client";
import { SubmitAreaProps } from "@/types";
import { Textarea } from "./ui/textarea";
import { checkInputType } from "@/lib/check-input-type";
import {
  CaseUpper,
  ArrowRight,
  Paperclip,
  FileCheck,
  Delete,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Button } from "./ui/button";
import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const SubmitArea = ({ value, setValue, submit }: SubmitAreaProps) => {
  const [file, setFile] = useState<File | null>(null);
  // const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setValue("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (file) {
      submit(file);
      return;
    }
    submit(value);
  };

  // const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
  //   event.preventDefault();
  //   setIsDragOver(true);
  // };

  // const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
  //   event.preventDefault();
  //   setIsDragOver(true);
  // };

  // const handleDragLeave = () => {
  //   setIsDragOver(false);
  // };

  // const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
  //   event.preventDefault();
  //   setIsDragOver(false);
  // };

  const handleClear = () => {
    setFile(null);
    setValue("");
  };

  // const labelText = isDragOver
  //   ? "Drop file here"
  //   : file
  //     ? `${file.name} uploaded`
  //     : "Drop a file, type or input YouTube link";

  const labelText = "Type anything or Input YouTube link";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-[600px] w-full space-y-1 flex flex-col items-end"
      >
        <label
          className="w-full"
        // onDragOver={handleDragOver}
        // onDragEnter={handleDragEnter}
        // onDragLeave={handleDragLeave}
        // onDrop={handleDrop}
        >
          <Textarea
            disabled={!!file}
            autoFocus
            className={cn(
              "flex-1",
              // isDragOver && "bg-neutral-700 dark:bg-neutral-400",
            )}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={labelText}
          />
          <div className="mt-1 flex w-full justify-between">
            <div className="h-full flex items-center justify-center space-x-1">
              <label
                htmlFor="file-upload"
                className="flex space-x-1.5 h-7 rounded-md p-2 bg-neutral-800/50 dark:bg-neutral-200/50 text-primary-foreground cursor-not-allowed"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="h-full flex items-center justify-center text-sm overflow-visible">
                      Upload
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Coming soon</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Paperclip className="h-3 w-3" />
                {/* <input
                  accept="application/pdf"
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleChange}
                /> */}
              </label>
              <span
                onClick={handleClear}
                className={cn(
                  "items-center justify-center space-x-1.5 h-7 rounded-md p-2 pl-1.5 cursor-pointer hover:bg-transparent/5 hover:dark:bg-transparent/50 hover:text-accent-foreground hidden text-sm overflow-visible",
                  (value || file) && "flex",
                )}
              >
                <Delete className="h-4 w-4 dark:text-neutral-200 text-neutral-700" />
              </span>
            </div>
            <div className="flex space-x-1 mb-8">
              <div className="h-full flex items-center justify-center">
                {file ? (
                  <FileCheck className="h-5 mt-0.5 w-5" />
                ) : (
                  value &&
                  (checkInputType(value) ? (
                    <FaYoutube className="h-5 mt-0.5 w-5" />
                  ) : (
                    <CaseUpper className="h-5 mt-0.5 w-5" />
                  ))
                )}
              </div>
              <Button
                size="sm"
                className="dark:hover:bg-transparent/30"
                variant="ghost"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </label>
      </form>
    </>
  );
};

export default SubmitArea;
