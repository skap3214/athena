"use client"
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { useRouter } from "next/navigation";

const Header = () => {
  return (
    <div className="sticky z-20 bg-neutral-950 p-2 px-4 flex flex-row justify-between top-0">
      <div className="flex items-center justify-center h-ful">
        <span
          onClick={() => window.location.reload()}
          className="text-2xl text-neutral-200 cursor-pointer font-semibold"
        >
          athena.
        </span>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <div className="border rounded-lg p-2 hover:bg-neutral-700 cursor-pointer">
            <Menu className="cursor-pointer1 hover:scale-105 text-neutral-300" />
          </div>
        </SheetTrigger>
        <SheetContent className="justify-between flex flex-col">
          <SheetHeader>
            <SheetTitle>Chat History</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col justify-center items-center h-full py-4">
            <div className="text-neutral-500">Coming soon!</div>
          </div>
          <SheetFooter className="flex justify-between flex-row-reverse">
            <ModeToggle />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
