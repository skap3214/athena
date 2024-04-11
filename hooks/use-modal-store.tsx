import { ModalStore } from "@/types";
import { create } from "zustand";

export const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  data: {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
