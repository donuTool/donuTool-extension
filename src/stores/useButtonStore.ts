import { create } from "zustand";

interface Button {
  id: string;
  image: string;
  status: string;
  top?: number;
  left?: number;
}

interface ButtonStore {
  buttons: Button[];
  setButtons: (update: Button[] | ((prev: Button[]) => Button[])) => void;
}

export const useButtonStore = create<ButtonStore>((set) => ({
  buttons: [
    {
      id: "goBack",
      image: "arrow-left",
      status: "IN_TOOLBAR",
      top: 15,
      left: 93.3,
    },
    {
      id: "goForward",
      image: "arrow-right",
      status: "IN_TOOLBAR",
      top: 53.3,
      left: 109.2,
    },
    { id: "newTab", image: "new", status: "IN_TOOLBAR", top: 93.3, left: 93.3 },
    {
      id: "moveToNextTab",
      image: "arrow-right-to-line",
      status: "IN_TOOLBAR",
      top: 109.2,
      left: 53.3,
    },
    {
      id: "moveToPrevTab",
      image: "arrow-left-to-line",
      status: "IN_TOOLBAR",
      top: 92.5,
      left: 15.8,
    },
    { id: "reload", image: "rotate", status: "IN_LIST" },
    { id: "close", image: "close", status: "IN_LIST" },
    { id: "translate", image: "languages", status: "IN_LIST" },
    { id: "downloadImages", image: "image-down", status: "IN_LIST" },
    { id: "bookmark", image: "star", status: "IN_LIST" },
    { id: "bookmark2", image: "bookmark", status: "IN_LIST" },
    { id: "copyTabAddress", image: "clipboard-copy", status: "IN_LIST" },
    { id: "print", image: "printer", status: "IN_LIST" },
    { id: "capture", image: "camera", status: "IN_LIST" },
  ],

  setButtons: (update) =>
    set((state) => ({
      buttons: typeof update === "function" ? update(state.buttons) : update,
    })),
}));
