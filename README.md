# LaunchRush

🚀 Production-ready mobile-first meme token launch platform with transparent blockchain integration.

## Overview

LaunchRush is a legitimate, fast, and user-friendly platform for creating and launching meme tokens on blockchain networks. It emphasizes transparency, real blockchain transactions, and honest market activity—no fake volume, no manipulation, no false promises.

### Core Features

- **Fast Token Launch**: Minimal-click flow from wallet connection to live token
- **Mobile-First Design**: Optimized for Android and mobile browsers
- **Transparent Security**: Full contract details, creator allocation, liquidity info before launch
- **Public Token Pages**: Professional, shareable pages for each launched token
- **Real-Time Discovery**: Trending and newly-launched token feeds with real metrics
- **Share System**: Instant sharing to Twitter/X, Telegram with QR codes
- **Multi-Chain Support**: Solana and Base initially, extensible architecture

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Environment variables configured (see `.env.example`)

### Installation

```bash
# Clone the repository
git clone https://github.com/emzaunderscore11-create/launch-rush.git
cd launch-rush

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys and RPC URLs

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard/       # Main dashboard
│   ├── TokenCreation/   # Token creation flow
│   ├── TokenPage/       # Public token page
│   ├── Discovery/       # Feed and discovery
│   ├── Wallet/          # Wallet connection
│   ├── UI/              # Reusable UI components
│   └── Layout/          # Layout components
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   ├── dashboard/       # Creator dashboard
│   ├── token/           # Public token pages
│   ├── discover/        # Discovery pages
│   └── index.tsx        # Home page
├── lib/                 # Utilities
│   ├── blockchain/      # Blockchain interactions
│   ├── api/             # API clients
│   └── utils/           # Helper functions
├── types/               # TypeScript types
├── store/               # Zustand state management
├── hooks/               # Custom React hooks
├── styles/              # Global styles
└── api/                 # Backend API structure
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Solana Web3.js, Ethers.js, Wagmi, RainbowKit
- **State Management**: Zustand
- **Database**: Prisma + PostgreSQL (optional)
- **Real-time**: WebSocket support for live updates
- **Notifications**: React Hot Toast
- **Charts**: Recharts

## Security & Transparency

✅ **No Private Key Storage**: Never stores wallet seed phrases or private keys
✅ **Real Transactions Only**: All blockchain operations require explicit wallet signatures
✅ **Full Transparency**: Contract addresses, creator allocations, and fees always visible
✅ **No Fake Activity**: Real data only—no artificial volume, holders, or trading
✅ **Clear Disclaimers**: No guaranteed buyers or profits promised
✅ **Error States**: Clear explanation of transaction failures

## API Configuration

The application requires RPC URLs for blockchain interaction:

### Solana
- **Mainnet**: `https://api.mainnet-beta.solana.com`
- **Devnet**: `https://api.devnet.solana.com`
- **Custom RPC** (Helius recommended): Set via `NEXT_PUBLIC_SOLANA_RPC_URL`

### Base
- **Mainnet**: `https://mainnet.base.org`
- **Sepolia Testnet**: `https://sepolia.base.org`

### Indexer APIs (Optional)
- **Helius**: Solana data and token info
- **Birdeye**: Token metrics and pricing
- **Moralis**: Cross-chain data

## Development

```bash
# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Format code
npm run format

# Linting
npm run lint
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t launch-rush .

# Run container
docker run -p 3000:3000 --env-file .env.production launch-rush
```

## Important Notes

🔒 **API Keys**: Store all sensitive API keys in backend environment variables only. Never expose in frontend code.

⚠️ **Blockchain Safety**: Always test on testnet before mainnet deployment.

📱 **Mobile First**: Design decisions prioritize mobile users. Desktop is secondary.

🎯 **Honest Marketing**: Share features honestly. No fake metrics or misleading claims.

## Contributing

Contributions are welcome! Please follow:

1. Create a feature branch
2. Keep commits atomic and well-described
3. Test thoroughly on testnet
4. Submit PR with clear description

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Open a GitHub issue
- Check documentation in `/docs`
- Review blockchain integration examples in `/examples`

## Roadmap

- [x] Solana support
- [x] Base support
- [ ] Polygon support
- [ ] Arbitrum support
- [ ] Token metadata standards
- [ ] Advanced analytics
- [ ] Creator rewards
- [ ] Community governance

---

**Remember**: This tool is for legitimate meme token launches only. Users are responsible for compliance with local laws and regulations.
