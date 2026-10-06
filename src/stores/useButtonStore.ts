import { create } from "zustand";
import type { Button } from "@/stores/types";
import { withDefaultButtons } from "@/shared/defaultButtons";

interface ButtonStore {
  buttons: Button[];
  setButtons: (update: Button[] | ((prev: Button[]) => Button[])) => void;
}

export const useButtonStore = create<ButtonStore>((set) => ({
  buttons: withDefaultButtons(),

  setButtons: (update) =>
    set((state) => ({
      buttons: typeof update === "function" ? update(state.buttons) : update,
    })),
}));
