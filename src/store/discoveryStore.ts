import { create } from 'zustand';
import { DiscoveryToken, SortOption } from '@/types';

interface DiscoveryStore {
  tokens: DiscoveryToken[];
  isLoading: boolean;
  error: string | null;
  sortBy: SortOption;
  hasMore: boolean;
  setTokens: (tokens: DiscoveryToken[]) => void;
  addTokens: (tokens: DiscoveryToken[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSortBy: (sort: SortOption) => void;
  setHasMore: (hasMore: boolean) => void;
  reset: () => void;
}

export const useDiscoveryStore = create<DiscoveryStore>((set) => ({
  tokens: [],
  isLoading: false,
  error: null,
  sortBy: 'newest',
  hasMore: true,
  setTokens: (tokens) => set({ tokens }),
  addTokens: (tokens) => set((state) => ({ tokens: [...state.tokens, ...tokens] })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSortBy: (sortBy) => set({ sortBy, tokens: [] }),
  setHasMore: (hasMore) => set({ hasMore }),
  reset: () => set({ tokens: [], isLoading: false, error: null, sortBy: 'newest', hasMore: true }),
}));
