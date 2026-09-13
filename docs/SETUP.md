# LaunchRush Configuration Guide

## Environment Variables

### Required for Development

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### Blockchain Configuration

#### Solana
- **NEXT_PUBLIC_SOLANA_RPC_URL**: Your Solana RPC endpoint
  - Mainnet: `https://api.mainnet-beta.solana.com`
  - Devnet: `https://api.devnet.solana.com`
  - Recommended: Use Helius (https://www.helius.dev) for better performance

- **NEXT_PUBLIC_SOLANA_NETWORK**: Network to use (`mainnet-beta` or `devnet`)

#### Base
- **NEXT_PUBLIC_BASE_RPC_URL**: Base network RPC
  - Mainnet: `https://mainnet.base.org`
  - Sepolia Testnet: `https://sepolia.base.org`

### API Keys (Backend Only)

These should NEVER be exposed in frontend code:

- **API_KEY_HELIUS**: For Solana indexing (get at https://www.helius.dev)
- **API_KEY_BIRDEYE**: For token metrics (get at https://birdeye.so)
- **API_KEY_MORALIS**: For cross-chain data (get at https://moralis.io)

### Database

- **DATABASE_URL**: PostgreSQL connection string
  ```
  postgresql://user:password@localhost:5432/launch_rush
  ```

### Security

- **JWT_SECRET**: Secret key for signing JWTs (generate a strong random string)
  ```bash
  openssl rand -base64 32
  ```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your API keys and RPC URLs
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Blockchain Integration

### Solana

The application uses:
- `@solana/web3.js` for blockchain interaction
- `@solana/wallet-adapter-react` for wallet connections
- Phantom Wallet for user authentication

For token creation on Solana:
1. User connects Phantom wallet
2. Create SPL token using `spl-token` library
3. Initialize token metadata using Metaplex
4. Set up liquidity pool on Raydium/Orca

### Base

The application uses:
- `ethers.js` for blockchain interaction
- `wagmi` for React hooks
- `RainbowKit` for wallet connection UI
- MetaMask/other EVM wallets

For token creation on Base:
1. User connects MetaMask or other EVM wallet
2. Deploy ERC-20 contract
3. Set token metadata
4. Add liquidity to Uniswap V3/V4

## API Structure

### Endpoints

```
GET  /api/tokens/new                          - Get newly launched tokens
GET  /api/tokens/trending                     - Get trending tokens
GET  /api/tokens/:chain/:address              - Get token details
GET  /api/tokens/:chain/:address/stats        - Get token statistics
GET  /api/tokens/:chain/:address/transactions - Get recent transactions
GET  /api/tokens/:chain/:address/holders      - Get top holders
POST /api/tokens/launch                       - Launch new token
GET  /api/tokens/search                       - Search tokens
```

## Database Schema (Optional)

If using PostgreSQL with Prisma:

```prisma
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
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model TokenStat {
  id        String   @id @default(cuid())
  tokenId   String
  price     Float
  liquidity Float
  volume24h Float
  holders   Int
  recordedAt DateTime @default(now())
}
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard.

### Docker

```bash
# Build
docker build -t launch-rush .

# Run
docker run -p 3000:3000 --env-file .env.production launch-rush
```

### Manual Server

```bash
# Build
npm run build

# Run with PM2
npm install -g pm2
pm2 start "npm start" --name launch-rush
```

## Testing

### Local Development

1. Use Solana Devnet for testing token creation
2. Use Base Sepolia for EVM testing
3. Test wallet connections with fake wallets

### Testnet Configuration

Update `.env.local` for testnet:

```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_BASE_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_APP_ENV=development
```

## Monitoring & Logging

- Use application logging for errors
- Monitor blockchain transaction status
- Track API performance
- Log all user actions for compliance

## Security Best Practices

✅ Never expose private keys
✅ Validate all user inputs
✅ Use HTTPS in production
✅ Implement rate limiting
✅ Keep dependencies updated
✅ Use environment variables for secrets
✅ Implement CSRF protection
✅ Use Content Security Policy headers

## Troubleshooting

### Wallet Connection Issues

- Ensure Phantom/MetaMask is installed
- Check network is correct in wallet
- Clear browser cache and restart

### Token Launch Failures

- Verify sufficient SOL/ETH for fees
- Check token configuration validity
- Review transaction logs
- Ensure RPC endpoint is responsive

### Performance Issues

- Check RPC endpoint rate limits
- Implement caching for token data
- Use CDN for static assets
- Optimize database queries

## Support

For issues:
1. Check GitHub issues
2. Review documentation
3. Open a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Error logs
