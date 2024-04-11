"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import SignInButton from "../sign-in-button";

export function AuthModal() {
  const { isOpen, onClose } = useModal();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>
            To continue, please log in or create an account
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant="secondary">
            Not Now
          </Button>
          <SignInButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
