import { create } from 'zustand';
import { WalletConnection, ChainId } from '@/types';

interface WalletStore {
  wallet: WalletConnection | null;
  selectedChain: ChainId | null;
  isConnecting: boolean;
  error: string | null;
  setWallet: (wallet: WalletConnection | null) => void;
  setSelectedChain: (chain: ChainId) => void;
  setIsConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  selectedChain: null,
  isConnecting: false,
  error: null,
  setWallet: (wallet) => set({ wallet, error: null }),
  setSelectedChain: (chain) => set({ selectedChain: chain }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  setError: (error) => set({ error }),
  disconnect: () => set({ wallet: null, selectedChain: null, error: null }),
}));
