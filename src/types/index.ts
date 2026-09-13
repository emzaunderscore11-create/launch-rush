// Blockchain Types
export type ChainId = 'solana' | 'base';

export interface BlockchainConfig {
  id: ChainId;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  currency: string;
  decimals: number;
  chainId?: number; // For EVM chains
}

export interface WalletConnection {
  address: string;
  chain: ChainId;
  balance: string;
  isConnected: boolean;
}

// Token Types
export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  logo: string; // IPFS hash or URL
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

export interface TokenLaunchConfig {
  metadata: TokenMetadata;
  totalSupply: string;
  decimals: number;
  creatorAllocation: string;
  liquidityAmount: string;
  chain: ChainId;
  creatorAddress: string;
}

export interface LaunchedToken {
  id: string;
  address: string;
  chain: ChainId;
  metadata: TokenMetadata;
  totalSupply: string;
  decimals: number;
  creatorAddress: string;
  creatorAllocation: string;
  liquidityAmount: string;
  transactionHash: string;
  launchedAt: Date;
  blockNumber: number;
  hasMintAuthority: boolean;
  hasFreezeAuthority: boolean;
  verified: boolean;
}

export interface TokenStats {
  address: string;
  chain: ChainId;
  price: number;
  liquidity: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  age: number; // seconds
  lastUpdate: Date;
}

export interface TokenTransaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  type: 'transfer' | 'burn' | 'mint';
  status: 'pending' | 'confirmed' | 'failed';
}

// Launch Flow
export type LaunchStep = 'connect' | 'create' | 'review' | 'launch' | 'confirm' | 'complete';

export interface LaunchState {
  currentStep: LaunchStep;
  tokenConfig: Partial<TokenLaunchConfig>;
  estimatedFee: string;
  transactionStatus: TransactionStatus;
}

export type TransactionStatus = 'idle' | 'preparing' | 'waiting' | 'submitted' | 'confirming' | 'success' | 'failed';

export interface TransactionError {
  code: string;
  message: string;
  reason?: string;
}

// Discovery Types
export interface DiscoveryToken extends LaunchedToken {
  stats: TokenStats;
  trendingScore?: number;
}

export type SortOption = 'newest' | 'volume' | 'liquidity' | 'holders' | 'trending';

export interface DiscoveryFeed {
  tokens: DiscoveryToken[];
  total: number;
  hasMore: boolean;
  sort: SortOption;
}

// Creator Dashboard
export interface CreatorStats {
  tokenAddress: string;
  launchTime: Date;
  currentPrice: number;
  liquidity: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  transactions: TokenTransaction[];
  creatorAllocation: string;
}

// Share Data
export interface ShareData {
  tokenAddress: string;
  tokenName: string;
  shortUrl: string;
  qrCode: string;
  message: string;
  chainExplorer: string;
}
