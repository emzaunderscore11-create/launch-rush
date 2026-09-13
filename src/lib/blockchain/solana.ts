import { Connection, PublicKey, Transaction, sendAndConfirmTransaction, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { TokenLaunchConfig, LaunchedToken, ChainId, TransactionStatus } from '@/types';

const SOLANA_DECIMALS = 9;

interface SolanaConfig {
  rpcUrl: string;
  network: 'mainnet-beta' | 'devnet' | 'testnet-genesys';
}

export class SolanaBlockchain {
  private connection: Connection;
  private config: SolanaConfig;

  constructor(config: SolanaConfig) {
    this.config = config;
    this.connection = new Connection(config.rpcUrl, 'confirmed');
  }

  async getBalance(walletAddress: string): Promise<string> {
    try {
      const pubkey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(pubkey);
      return (balance / LAMPORTS_PER_SOL).toString();
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw new Error('Failed to fetch wallet balance');
    }
  }

  async estimateTokenCreationFee(): Promise<string> {
    // Solana token creation costs:
    // - Account creation: ~0.00203928 SOL
    // - Transaction fee: ~0.00005 SOL
    const MINT_CREATION_COST = 0.00203928;
    const TX_FEE = 0.00005;
    return (MINT_CREATION_COST + TX_FEE).toString();
  }

  async validateTokenConfig(config: TokenLaunchConfig): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate addresses
    try {
      new PublicKey(config.creatorAddress);
    } catch {
      errors.push('Invalid creator wallet address');
    }

    // Validate supply
    if (BigInt(config.totalSupply) <= 0n) {
      errors.push('Total supply must be greater than 0');
    }

    // Validate decimals
    if (config.decimals < 0 || config.decimals > 9) {
      errors.push('Decimals must be between 0 and 9 for Solana');
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
    onStatusChange: (status: TransactionStatus, message?: string) => void,
    signTransaction: (tx: Transaction) => Promise<Transaction>
  ): Promise<LaunchedToken> {
    try {
      onStatusChange('preparing', 'Preparing token creation...');

      const creatorPubkey = new PublicKey(config.creatorAddress);
      const mintKeypair = Keypair.generate();
      const mint = mintKeypair.publicKey;

      // Get or create associated token account
      onStatusChange('waiting', 'Requesting wallet signature...');

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        new Keypair(), // Placeholder - will be signed by user
        mint,
        creatorPubkey
      );

      // Create mint transaction
      const transaction = new Transaction().add(
        await createMint(
          this.connection,
          new Keypair(), // Placeholder
          creatorPubkey,
          creatorPubkey, // freeze authority
          config.decimals
        )
      );

      onStatusChange('waiting', 'Waiting for wallet confirmation...');
      const signedTx = await signTransaction(transaction);

      onStatusChange('submitted', 'Submitting transaction to blockchain...');
      const txHash = await this.connection.sendRawTransaction(signedTx.serialize());

      onStatusChange('confirming', 'Confirming transaction...');
      const confirmation = await this.connection.confirmTransaction(txHash, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed on blockchain');
      }

      const blockNumber = await this.connection.getSlot();

      onStatusChange('success', 'Token created successfully!');

      return {
        id: mint.toBase58(),
        address: mint.toBase58(),
        chain: 'solana',
        metadata: config.metadata,
        totalSupply: config.totalSupply,
        decimals: config.decimals,
        creatorAddress: config.creatorAddress,
        creatorAllocation: config.creatorAllocation,
        liquidityAmount: config.liquidityAmount,
        transactionHash: txHash,
        launchedAt: new Date(),
        blockNumber,
        hasMintAuthority: true,
        hasFreezeAuthority: true,
        verified: false,
      };
    } catch (error) {
      console.error('Token creation failed:', error);
      onStatusChange('failed', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async getTokenInfo(tokenAddress: string): Promise<any> {
    try {
      const mint = new PublicKey(tokenAddress);
      const info = await this.connection.getParsedAccountInfo(mint);
      return info.value?.data;
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw new Error('Failed to fetch token information');
    }
  }

  async getTokenSupply(tokenAddress: string): Promise<string> {
    try {
      const mint = new PublicKey(tokenAddress);
      const supply = await this.connection.getTokenSupply(mint);
      return supply.value.amount;
    } catch (error) {
      console.error('Error fetching token supply:', error);
      throw new Error('Failed to fetch token supply');
    }
  }

  async subscribeToTokenUpdates(tokenAddress: string, callback: (data: any) => void): Promise<number> {
    try {
      const mint = new PublicKey(tokenAddress);
      const subscriptionId = this.connection.onAccountChange(mint, (account, context) => {
        callback({
          account,
          slot: context.slot,
        });
      });
      return subscriptionId;
    } catch (error) {
      console.error('Error subscribing to updates:', error);
      throw error;
    }
  }

  unsubscribeFromUpdates(subscriptionId: number): void {
    this.connection.removeAccountChangeListener(subscriptionId);
  }

  getExplorerUrl(address: string): string {
    const baseUrl = this.config.network === 'mainnet-beta' ? 'https://solscan.io' : 'https://solscan.io';
    return `${baseUrl}/token/${address}`;
  }
}

export const initSolanaBlockchain = (rpcUrl: string, network: 'mainnet-beta' | 'devnet' = 'mainnet-beta'): SolanaBlockchain => {
  return new SolanaBlockchain({ rpcUrl, network });
};
