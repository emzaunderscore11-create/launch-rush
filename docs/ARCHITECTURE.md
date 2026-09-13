# LaunchRush - Architecture & Technical Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js/React)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Dashboard (Token Creation Flow)                     │   │
│  │  - TokenInfoForm                                     │   │
│  │  - SupplyConfig                                      │   │
│  │  - LaunchReview                                      │   │
│  │  - LaunchStatus                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Discovery (Token Feed)                              │   │
│  │  - DiscoveryFeed                                     │   │
│  │  - TokenCard                                         │   │
│  │  - TokenSearch                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Token Pages (Public)                                │   │
│  │  - PublicTokenPage                                   │   │
│  │  - CreatorDashboard                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  State Management (Zustand)                          │   │
│  │  - walletStore                                       │   │
│  │  - launchStore                                       │   │
│  │  - discoveryStore                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js API)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/tokens/new          - Newly launched tokens    │   │
│  │  /api/tokens/trending     - Trending scores          │   │
│  │  /api/tokens/[chain]/[addr] - Token details          │   │
│  │  /api/tokens/launch       - Token creation request   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Blockchain Layer (Web3.js / Ethers.js)         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Solana Integration                                  │   │
│  │  - SolanaBlockchain class                            │   │
│  │  - @solana/web3.js                                   │   │
│  │  - @solana/spl-token                                 │   │
│  │  - Phantom Wallet Adapter                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Base Integration                                    │   │
│  │  - BaseBlockchain class                              │   │
│  │  - ethers.js / viem                                  │   │
│  │  - RainbowKit / Wagmi                                │   │
│  │  - MetaMask Adapter                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Blockchain RPC Endpoints                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Solana RPC (Helius or public endpoint)              │   │
│  │  Base RPC (Infura, Alchemy, or public endpoint)      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Indexer APIs (Optional)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Helius (Solana)                                     │   │
│  │  Birdeye (Token metrics)                             │   │
��  │  Moralis (Cross-chain)                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  Database (PostgreSQL)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tokens table                                        │   │
│  │  TokenStats table                                    │   │
│  │  TokenTransactions table                             │   │
│  │  Users table (optional)                              │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────���─────────────────────────────────────────────┘
```

## Data Flow

### Token Launch Flow

```
1. User → Frontend (index.tsx)
   ↓
2. Connect Wallet (WalletConnector)
   ↓
3. Select Blockchain (Solana/Base)
   ↓
4. Enter Token Info (TokenInfoForm)
   ↓
5. Enter Supply Config (SupplyConfig)
   ↓
6. Review Details (LaunchReview)
   ↓
7. Confirm Launch → API (/api/tokens/launch)
   ↓
8. Blockchain Transaction
   - Solana: SPL Token Creation
   - Base: ERC-20 Deployment
   ↓
9. Wait for Confirmation (LaunchStatus)
   ↓
10. Get Public Token Page
```

### Token Discovery Flow

```
1. User → Discover Page (discover.tsx)
   ↓
2. Select Sort Option (TokenCard)
   ↓
3. API Request → /api/tokens/new
   ↓
4. Query Database or Indexer
   ↓
5. Return Token List
   ↓
6. Display Token Cards (TokenCard)
   ↓
7. User clicks token → Public Token Page
```

## Component Architecture

### Core Components

```typescript
// UI Components (components/UI/)
- Button: Reusable button with variants
- Input: Form input with validation styling
- Textarea: Multi-line input
- Card: Container component
- Badge: Status/tag component
- Alert: Notification component
- LoadingSpinner: Loading indicator

// Wallet Components (components/Wallet/)
- WalletConnector: Phantom/MetaMask connection UI
- WalletDisplay: Show connected wallet address

// Token Creation (components/TokenCreation/)
- TokenInfoForm: Name, symbol, description, logo
- SupplyConfig: Total supply, allocation, decimals
- LaunchReview: Final review before launch
- LaunchStatus: Transaction status and results

// Discovery (components/Discovery/)
- DiscoveryFeed: Token list with sorting
- TokenCard: Individual token card

// Token Page (components/TokenPage/)
- PublicTokenPage: Full token details page

// Creator Dashboard (components/Creator/)
- CreatorDashboard: Analytics and management
```

## State Management

### Zustand Stores

```typescript
// walletStore
- wallet: WalletConnection | null
- selectedChain: ChainId | null
- isConnecting: boolean
- error: string | null

// launchStore
- currentStep: LaunchStep
- tokenConfig: Partial<TokenLaunchConfig>
- estimatedFee: string
- transactionStatus: TransactionStatus

// discoveryStore
- tokens: DiscoveryToken[]
- isLoading: boolean
- error: string | null
- sortBy: SortOption
- hasMore: boolean
```

## API Design

### Token Endpoints

```typescript
// Get newly launched tokens
GET /api/tokens/new?sort=newest&limit=20&offset=0&chain=solana
Response: {
  tokens: LaunchedToken[],
  total: number,
  hasMore: boolean
}

// Get trending tokens (with score calculation)
GET /api/tokens/trending?limit=20&offset=0
Response: {
  tokens: DiscoveryToken[],
  hasMore: boolean
}

// Get token details
GET /api/tokens/:chain/:address
Response: LaunchedToken & { stats: TokenStats }

// Get token statistics
GET /api/tokens/:chain/:address/stats
Response: TokenStats

// Get recent transactions
GET /api/tokens/:chain/:address/transactions?limit=50
Response: {
  transactions: TokenTransaction[]
}

// Get top holders
GET /api/tokens/:chain/:address/holders?limit=20
Response: {
  holders: Holder[]
}

// Launch token
POST /api/tokens/launch
Body: TokenLaunchConfig
Response: {
  status: 'created',
  tokenAddress: string,
  message: string
}

// Search tokens
GET /api/tokens/search?q=query&chain=solana
Response: {
  results: LaunchedToken[]
}
```

## Blockchain Integration Details

### Solana Token Creation

```typescript
// Steps:
1. Create mint keypair
2. Create associated token account
3. Mint initial supply to creator
4. Add liquidity to Raydium
5. Freeze mint authority (optional)
6. Update metadata via Metaplex
```

### Base Token Creation (ERC-20)

```typescript
// Steps:
1. Deploy ERC-20 contract
2. Set token metadata
3. Mint initial supply
4. Add liquidity to Uniswap
5. Lock liquidity (optional)
```

## Security Considerations

✅ **No Private Key Storage**
- Never store wallet seed phrases
- No custody of user funds
- User signs all transactions

✅ **Input Validation**
- Validate wallet addresses
- Validate numeric inputs
- Validate token metadata

✅ **API Security**
- Rate limiting on token launch
- Input sanitization
- CORS configuration

✅ **Contract Security**
- No arbitrary code execution
- Standard token contracts only
- User controls minting

## Performance Optimization

### Frontend
- Code splitting by route
- Lazy loading components
- Image optimization
- CSS minification
- JavaScript minification

### Backend
- Database query optimization
- Caching frequently accessed data
- Pagination for large datasets
- Connection pooling

### Blockchain
- Batch RPC calls where possible
- Use indexers for historical data
- WebSocket subscriptions for live updates

## Error Handling

### Transaction States
```
idle → preparing → waiting → submitted → confirming → success/failed
```

### Error Messages
- User-friendly explanations
- Actionable next steps
- Link to explorer for debugging
- Retry options where applicable

## Testing Strategy

### Unit Tests
- Utility functions
- State management
- Component rendering

### Integration Tests
- API endpoints
- Wallet connection
- Token creation flow

### E2E Tests
- Full launch flow on testnet
- Discovery and search
- Token page functionality

## Future Enhancements

1. **Multi-chain Support**
   - Polygon
   - Arbitrum
   - Optimism
   - BNB Chain

2. **Advanced Features**
   - Token burning
   - Staking contracts
   - Governance tokens
   - Airdrop functionality

3. **Analytics**
   - Price charts
   - Volume analysis
   - Holder distribution
   - Trading activity

4. **Community**
   - Comments/discussions
   - Creator verification
   - Community voting
   - Rewards program

5. **Integrations**
   - Payment processing
   - NFT minting
   - Discord bots
   - Trading bots
