"use client";
import { AuthModal } from "@/components/modals/auth-modal";
import { GeistSans } from "geist/font/sans";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`${GeistSans.className}`}>
      <AuthModal />
    </div>
  );
};
