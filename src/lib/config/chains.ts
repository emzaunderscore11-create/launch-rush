export const BLOCKCHAIN_CONFIGS = {
  solana: {
    id: 'solana',
    name: 'Solana',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
    explorerUrl: 'https://solscan.io',
    currency: 'SOL',
    decimals: 9,
    minCreationFee: '0.00203928',
  },
  base: {
    id: 'base',
    name: 'Base',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    currency: 'ETH',
    chainId: 8453,
    decimals: 18,
    minCreationFee: '0.005',
  },
};

export type SupportedChain = keyof typeof BLOCKCHAIN_CONFIGS;

export const getSupportedChains = (): Array<{ id: SupportedChain; name: string }> => [
  { id: 'solana', name: 'Solana' },
  { id: 'base', name: 'Base' },
];

export const getChainConfig = (chainId: SupportedChain) => BLOCKCHAIN_CONFIGS[chainId];
