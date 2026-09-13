import type { NextApiRequest, NextApiResponse } from 'next';

// Mock data endpoint - replace with real database queries

interface TokenResponse {
  tokens: any[];
  total: number;
  hasMore: boolean;
}

const mockTokens = [
  {
    id: '1',
    address: 'EPjFWdd5Au...', // Truncated for example
    chain: 'solana',
    metadata: {
      name: 'Moon Doge',
      symbol: 'MDOGE',
      description: 'A meme token to the moon',
      logo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3C/svg%3E',
    },
    totalSupply: '1000000000',
    decimals: 9,
    creatorAddress: 'MoonDoge...', // Truncated
    creatorAllocation: '200000000',
    liquidityAmount: '300000000',
    transactionHash: 'tx123...',
    launchedAt: new Date(),
    blockNumber: 123456789,
    hasMintAuthority: true,
    hasFreezeAuthority: true,
    verified: false,
    stats: {
      address: 'EPjFWdd5Au...',
      chain: 'solana',
      price: 0.00001,
      liquidity: 50000,
      marketCap: 10000,
      volume24h: 5000,
      holders: 150,
      age: 3600,
      lastUpdate: new Date(),
    },
    trendingScore: 1,
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sort = 'newest', limit = 20, offset = 0, chain } = req.query;

    // In production, query database here
    const filteredTokens = mockTokens.filter((t) => !chain || t.chain === chain);

    // Mock pagination
    const paginatedTokens = filteredTokens.slice(Number(offset), Number(offset) + Number(limit));

    return res.status(200).json({
      tokens: paginatedTokens,
      total: filteredTokens.length,
      hasMore: Number(offset) + Number(limit) < filteredTokens.length,
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return res.status(500).json({ error: 'Failed to fetch tokens' });
  }
}
