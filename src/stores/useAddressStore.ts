import { create } from "zustand";

interface AddressState {
  address: string;
  setAddress: (newAddress: string) => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  address: "https://google.com",
  setAddress: (newAddress) => set({ address: newAddress }),
}));
