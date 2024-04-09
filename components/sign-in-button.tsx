import React from "react";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import { createClient } from "@/supabase/client";
import { toast } from "sonner";

const SignInButton = () => {
  const supabase = createClient();
  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      toast.error(error.message);
    }
  };
  return (
    <Button
      className="space-x-2 h-10 flex flex-row items-center justify-center rounded-md bg-neutral-900 px-8 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 dark:focus-visible:ring-neutral-300"
      onClick={handleGoogleAuth}
    >
      <FaGoogle />
      <span>Sign In</span>
    </Button>
  );
};

export default SignInButton;
