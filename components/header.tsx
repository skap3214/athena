"use client";
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

const Header = () => {
  return (
    <div className="absolute z-20 w-full bg-transparent p-2 px-4 flex flex-row justify-between top-0">
      <div className="flex items-center justify-center h-ful">
        <span
          onClick={() => window.location.replace("/")}
          className="text-2xl cursor-pointer font-semibold"
        >
          athena.
        </span>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <div className="border rounded-lg p-2 cursor-pointer">
            <Menu className="cursor-pointer1 hover:scale-105" />
          </div>
        </SheetTrigger>
        <SheetContent className="justify-between flex flex-col">
          <SheetHeader>
            <SheetTitle>Chat</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col justify-center items-center h-full py-4">
            <div className="text-neutral-500">Coming soon!</div>
          </div>
          <SheetFooter className="flex justify-between flex-row-reverse">
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
