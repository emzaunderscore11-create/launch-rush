# LaunchRush - API Implementation Guide

## Backend API Structure

All API routes are in `src/pages/api/` and follow Next.js conventions.

### File Organization

```
src/pages/api/
├── tokens/
│   ├── new.ts              # GET - newly launched tokens
│   ├── trending.ts         # GET - trending tokens
│   ├── search.ts           # GET - search tokens
│   ├── launch.ts           # POST - launch new token
│   └── [chain]/
│       └── [address]/
│           ├── index.ts    # GET - token details
│           ├── stats.ts    # GET - token statistics
│           ├── transactions.ts  # GET - recent transactions
│           └── holders.ts   # GET - top holders
```

## Implementing Data Sources

### Option 1: Database (Recommended for Production)

```typescript
// Install Prisma
npm install @prisma/client prisma
npm install -D prisma

// Initialize
npx prisma init

// Define schema (prisma/schema.prisma)
model Token {
  id            String   @id @default(cuid())
  address       String   @unique
  chain         String
  name          String
  symbol        String
  description   String?
  logo          String?
  metadata      Json
  creator       String
  totalSupply   String
  decimals      Int
  launchedAt    DateTime @default(now())
  transactionHash String?
  verified      Boolean  @default(false)
  stats         TokenStat[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([chain])
  @@index([launchedAt])
  @@index([creator])
}

model TokenStat {
  id        String   @id @default(cuid())
  tokenId   String
  token     Token    @relation(fields: [tokenId], references: [id])
  price     Float
  liquidity Float
  volume24h Float
  holders   Int
  recordedAt DateTime @default(now())

  @@index([tokenId])
  @@index([recordedAt])
}
```

```bash
# Create migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### Option 2: Indexer API (Helius/Birdeye)

```typescript
// src/lib/api/indexers.ts

import axios from 'axios';

export const heliusApi = {
  async getTokens(limit = 20, offset = 0) {
    const response = await axios.get(
      'https://api.helius.xyz/v0/token/list',
      {
        params: {
          api_key: process.env.API_KEY_HELIUS,
          limit,
          offset,
        },
      }
    );
    return response.data;
  },

  async getTokenMetadata(tokenAddress: string) {
    const response = await axios.get(
      `https://api.helius.xyz/v0/token/metadata?address=${tokenAddress}&api-key=${process.env.API_KEY_HELIUS}`
    );
    return response.data;
  },

  async getTokenStats(tokenAddress: string) {
    // Helius provides transaction history
    const response = await axios.get(
      `https://api.helius.xyz/v0/addresses/${tokenAddress}/transactions?api-key=${process.env.API_KEY_HELIUS}`
    );
    return response.data;
  },
};

export const birdseyeApi = {
  async getTrendingTokens() {
    const response = await axios.get(
      'https://public-api.birdeye.so/v1/token/trending',
      {
        headers: {
          'X-API-KEY': process.env.API_KEY_BIRDEYE,
        },
      }
    );
    return response.data;
  },

  async getTokenPrice(tokenAddress: string) {
    const response = await axios.get(
      `https://public-api.birdeye.so/v1/token/price?address=${tokenAddress}`,
      {
        headers: {
          'X-API-KEY': process.env.API_KEY_BIRDEYE,
        },
      }
    );
    return response.data;
  },
};
```

### Option 3: RPC Direct Calls

```typescript
// src/lib/blockchain/rpc.ts

import { Connection, PublicKey } from '@solana/web3.js';

export class SolanaRPC {
  private connection: Connection;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl);
  }

  async getTokenMetadata(tokenAddress: string) {
    const pubkey = new PublicKey(tokenAddress);
    const accountInfo = await this.connection.getParsedAccountInfo(pubkey);
    return accountInfo.value?.data;
  }

  async getTokenHolders(tokenAddress: string) {
    const pubkey = new PublicKey(tokenAddress);
    // Query all token accounts holding this mint
    const accounts = await this.connection.getProgramAccounts(
      new PublicKey('TokenkegQfeZyiNwAJsyFbPVwwQkYk9cqZH7PmVP21'),
      {
        filters: [
          {
            dataSize: 165, // Token account size
          },
          {
            memcmp: {
              offset: 0,
              bytes: pubkey.toBase58(),
            },
          },
        ],
      }
    );
    return accounts;
  }
}
```

## Implementing API Endpoints

### Example: Get Newly Launched Tokens

```typescript
// src/pages/api/tokens/new.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sort = 'newest', limit = 20, offset = 0, chain } = req.query;
    const parsedLimit = Math.min(Number(limit), 100); // Max 100
    const parsedOffset = Math.max(Number(offset), 0);

    // Build query
    const where: any = {};
    if (chain && chain !== 'all') {
      where.chain = chain;
    }

    // Get tokens
    const tokens = await prisma.token.findMany({
      where,
      include: {
        stats: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
      orderBy:
        sort === 'newest'
          ? { launchedAt: 'desc' }
          : sort === 'trending'
          ? { stats: { _count: 'desc' } }
          : { launchedAt: 'desc' },
      skip: parsedOffset,
      take: parsedLimit,
    });

    const total = await prisma.token.count({ where });

    return res.status(200).json({
      tokens,
      total,
      hasMore: parsedOffset + parsedLimit < total,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to fetch tokens' });
  }
}
```

### Example: Launch Token

```typescript
// src/pages/api/tokens/launch.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { TokenLaunchConfig } from '@/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config: TokenLaunchConfig = req.body;

    // Validate request
    if (!config.metadata || !config.totalSupply || !config.creatorAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if token already exists
    const existing = await prisma.token.findUnique({
      where: { address: config.creatorAddress },
    });

    if (existing) {
      return res.status(409).json({ error: 'Token already registered' });
    }

    // Store in database (blockchain transaction happens client-side)
    const token = await prisma.token.create({
      data: {
        address: config.creatorAddress, // Will be updated after blockchain confirmation
        chain: config.chain,
        name: config.metadata.name,
        symbol: config.metadata.symbol,
        description: config.metadata.description,
        logo: config.metadata.logo,
        creator: config.creatorAddress,
        totalSupply: config.totalSupply,
        decimals: config.decimals,
        metadata: config.metadata,
      },
    });

    return res.status(200).json({
      status: 'created',
      token,
      message: 'Token launch request created. Sign transaction in wallet.',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to launch token' });
  }
}
```

## Real-Time Updates with WebSocket

```typescript
// Backend: Use Next.js WebSocket support or Socket.io

// Frontend: Subscribe to token updates
import { useEffect, useState } from 'react';

export const useTokenUpdates = (tokenAddress: string, chain: string) => {
  const [stats, setStats] = useState<TokenStats | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/tokens/${chain}/${tokenAddress}/subscribe`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStats(data);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [tokenAddress, chain]);

  return stats;
};
```

## Caching Strategy

```typescript
// Add Redis caching
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function getCachedTokens(cacheKey: string) {
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
}

async function setCachedTokens(cacheKey: string, data: any, ttl = 300) {
  await redis.setex(cacheKey, ttl, JSON.stringify(data));
}
```

## Rate Limiting

```typescript
// src/lib/middleware/rateLimit.ts

import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});
```

## Error Handling

```typescript
// Consistent error responses
export const apiError = (message: string, statusCode = 500) => ({
  error: message,
  statusCode,
  timestamp: new Date().toISOString(),
});
```

## Testing API Endpoints

```bash
# Test newly launched tokens
curl "http://localhost:3000/api/tokens/new?sort=newest&limit=5"

# Test token search
curl "http://localhost:3000/api/tokens/search?q=doge&chain=solana"

# Test token details
curl "http://localhost:3000/api/tokens/solana/EPjFWdd5Au..."

# Test launch (requires POST)
curl -X POST http://localhost:3000/api/tokens/launch \
  -H "Content-Type: application/json" \
  -d @token_config.json
```
