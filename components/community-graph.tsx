import React from "react";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import Link from "next/link";

const CommunityGraph = () => {
  return (
    <Link href="/graph" className="mt-3">
      <Button className="space-x-2 bg-neutral-700 rounded-xl flex">
        <span>Community graph</span>
        <Globe className="h-4 w-4" />
      </Button>
    </Link>
  );
};

export default CommunityGraph;
