import { createPublicClient, createWalletClient, http, PublicClient, WalletClient, parseEther, formatEther } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { TokenLaunchConfig, LaunchedToken, TransactionStatus } from '@/types';

interface BaseConfig {
  rpcUrl: string;
  isTestnet: boolean;
}

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
] as const;

export class BaseBlockchain {
  private publicClient: PublicClient;
  private walletClient: WalletClient | null = null;
  private config: BaseConfig;
  private chain;

  constructor(config: BaseConfig) {
    this.config = config;
    this.chain = config.isTestnet ? baseSepolia : base;
    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: http(config.rpcUrl),
    });
  }

  setWalletClient(walletClient: WalletClient): void {
    this.walletClient = walletClient;
  }

  async getBalance(walletAddress: `0x${string}`): Promise<string> {
    try {
      const balance = await this.publicClient.getBalance({
        address: walletAddress,
      });
      return formatEther(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw new Error('Failed to fetch wallet balance');
    }
  }

  async estimateTokenCreationFee(): Promise<string> {
    // Base token deployment estimates:
    // - Contract deployment: ~0.005 ETH
    // - Transaction fee: ~0.0001 ETH
    // This is approximate; actual cost varies
    const estimatedCost = 0.0051;
    return estimatedCost.toString();
  }

  async validateTokenConfig(config: TokenLaunchConfig): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(config.creatorAddress)) {
      errors.push('Invalid creator wallet address');
    }

    // Validate supply
    try {
      const supply = BigInt(config.totalSupply);
      if (supply <= 0n) {
        errors.push('Total supply must be greater than 0');
      }
    } catch {
      errors.push('Invalid total supply format');
    }

    // Validate decimals
    if (config.decimals < 0 || config.decimals > 18) {
      errors.push('Decimals must be between 0 and 18');
    }

    // Validate allocations
    try {
      const total = BigInt(config.totalSupply);
      const creator = BigInt(config.creatorAllocation);
      const liquidity = BigInt(config.liquidityAmount);

      if (creator + liquidity > total) {
        errors.push('Creator allocation + liquidity cannot exceed total supply');
      }
    } catch {
      errors.push('Invalid allocation amounts');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async createToken(
    config: TokenLaunchConfig,
    onStatusChange: (status: TransactionStatus, message?: string) => void
  ): Promise<LaunchedToken> {
    if (!this.walletClient) {
      throw new Error('Wallet client not configured');
    }

    try {
      onStatusChange('preparing', 'Preparing token contract...');

      // Simplified ERC20 contract deployment
      // In production, use OpenZeppelin contracts or similar
      const SIMPLE_ERC20_BYTECODE = '0x608060...'; // Placeholder

      onStatusChange('waiting', 'Requesting wallet signature...');

      // Deploy contract
      const hash = await this.walletClient.deployContract({
        account: config.creatorAddress as `0x${string}`,
        abi: [],
        bytecode: SIMPLE_ERC20_BYTECODE as `0x${string}`,
        args: [
          config.metadata.name,
          config.metadata.symbol,
          config.decimals,
          config.totalSupply,
        ],
      });

      onStatusChange('submitted', 'Submitting transaction to blockchain...');

      // Wait for transaction receipt
      onStatusChange('confirming', 'Confirming transaction...');
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status !== 'success') {
        throw new Error('Contract deployment failed');
      }

      const contractAddress = receipt.contractAddress;
      if (!contractAddress) {
        throw new Error('No contract address returned');
      }

      onStatusChange('success', 'Token created successfully!');

      return {
        id: contractAddress,
        address: contractAddress,
        chain: 'base',
        metadata: config.metadata,
        totalSupply: config.totalSupply,
        decimals: config.decimals,
        creatorAddress: config.creatorAddress,
        creatorAllocation: config.creatorAllocation,
        liquidityAmount: config.liquidityAmount,
        transactionHash: receipt.transactionHash,
        launchedAt: new Date(),
        blockNumber: Number(receipt.blockNumber),
        hasMintAuthority: true,
        hasFreezeAuthority: false,
        verified: false,
      };
    } catch (error) {
      console.error('Token creation failed:', error);
      onStatusChange('failed', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async getTokenInfo(tokenAddress: `0x${string}`): Promise<any> {
    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'name',
        }),
        this.publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'symbol',
        }),
        this.publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'decimals',
        }),
        this.publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'totalSupply',
        }),
      ]);

      return { name, symbol, decimals, totalSupply };
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw new Error('Failed to fetch token information');
    }
  }

  getExplorerUrl(address: string): string {
    const baseUrl = this.config.isTestnet ? 'https://sepolia.basescan.org' : 'https://basescan.org';
    return `${baseUrl}/token/${address}`;
  }
}

export const initBaseBlockchain = (rpcUrl: string, isTestnet = false): BaseBlockchain => {
  return new BaseBlockchain({ rpcUrl, isTestnet });
};
