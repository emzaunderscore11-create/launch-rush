import { create } from 'zustand';
import { LaunchState, LaunchStep, TokenLaunchConfig, TransactionStatus } from '@/types';

interface LaunchStore extends LaunchState {
  setStep: (step: LaunchStep) => void;
  setTokenConfig: (config: Partial<TokenLaunchConfig>) => void;
  updateTokenConfig: (updates: Partial<TokenLaunchConfig>) => void;
  setEstimatedFee: (fee: string) => void;
  setTransactionStatus: (status: TransactionStatus) => void;
  resetLaunch: () => void;
}

const initialState: LaunchState = {
  currentStep: 'connect',
  tokenConfig: {},
  estimatedFee: '0',
  transactionStatus: 'idle',
};

export const useLaunchStore = create<LaunchStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ currentStep: step }),
  setTokenConfig: (config) => set({ tokenConfig: config }),
  updateTokenConfig: (updates) =>
    set((state) => ({
      tokenConfig: { ...state.tokenConfig, ...updates },
    })),
  setEstimatedFee: (fee) => set({ estimatedFee: fee }),
  setTransactionStatus: (status) => set({ transactionStatus: status }),
  resetLaunch: () => set(initialState),
}));
