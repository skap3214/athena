"use client";
import { SubmitAreaProps } from "@/types";
import { Textarea } from "./ui/textarea";
import { checkInputType } from "@/lib/check-input-type";
import { CaseUpper, ArrowRight, Paperclip } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SubmitArea = ({ handleSubmit, value, setValue }: SubmitAreaProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      console.log(selectedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const labelText = isDragOver
    ? "Drop file here"
    : file
      ? "File uploaded"
      : "Drop a file, type or input YouTube link";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-[600px] w-full space-y-1 flex flex-col items-end"
      >
        <label
          className="w-full"
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Textarea
            autoFocus
            className={cn(
              "flex-1",
              isDragOver && "bg-neutral-700 dark:bg-neutral-400",
            )}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={labelText}
          />
          <div className="mt-1 flex w-full justify-between">
            <div className="h-full flex items-center justify-center">
              <label
                htmlFor="file-upload"
                className="flex space-x-1.5 h-7 rounded-md p-2 cursor-pointer bg-neutral-800 dark:bg-neutral-200 dark:hover:bg-neutral-100 text-primary-foreground hover:bg-neutral-800/90"
              >
                <span className="h-full flex items-center justify-center text-sm overflow-visible">
                  Upload
                </span>
                <Paperclip className="h-3 w-3" />
                <input
                  accept="application/pdf"
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="flex space-x-1 mb-8">
              <div className="h-full mt-10 flex items-center justify-center">
                {value &&
                  (checkInputType(value) ? (
                    <FaYoutube className="h-5 mt-0.5 w-5" />
                  ) : (
                    <CaseUpper className="h-5 mt-0.5 w-5" />
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
          </div>
        </label>
      </form>
    </>
  );
};

export default SubmitArea;