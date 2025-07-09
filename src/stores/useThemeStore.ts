import { create } from "zustand";

type ThemeState = {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,

  setIsDarkMode: (value: boolean) => {
    document.documentElement.classList.toggle("dark", value);
    set({ isDarkMode: value });
  },
}));
