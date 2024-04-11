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
    <Button className="space-x-1.5" onClick={handleGoogleAuth}>
      <span>Sign In</span>
      <FaGoogle />
    </Button>
  );
};

export default SignInButton;
