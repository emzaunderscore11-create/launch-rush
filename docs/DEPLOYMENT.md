# LaunchRush - Deployment Guide

## Quick Start Deployment

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Vercel account (for Vercel deployment)

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/emzaunderscore11-create/launch-rush.git
cd launch-rush

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# 4. Run development server
npm run dev

# Open http://localhost:3000
```

### Production Deployment (Vercel)

#### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project directory
vercel

# Follow prompts to connect GitHub and deploy
```

#### Option 2: Using GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Configure environment variables in Vercel dashboard
6. Click "Deploy"

### Environment Variables for Production

Set these in your Vercel project settings:

```
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_ENV=production

API_KEY_HELIUS=your_helius_key
API_KEY_BIRDEYE=your_birdeye_key
API_KEY_MORALIS=your_moralis_key

DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Docker Deployment

```dockerfile
# Dockerfile (create in project root)
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

```bash
# Build and run Docker image
docker build -t launch-rush .
docker run -p 3000:3000 --env-file .env.production launch-rush
```

### AWS/Self-Hosted Deployment

```bash
# 1. Build application
npm run build

# 2. Install PM2 globally
npm install -g pm2

# 3. Start with PM2
pm2 start "npm start" --name launch-rush

# 4. Enable auto-restart on reboot
pm2 startup
pm2 save

# 5. Monitor
pm2 monit
```

### Nginx Configuration (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### SSL/TLS Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d your-domain.com

# Configure auto-renewal
sudo systemctl enable certbot.timer
```

## Performance Optimization

### Image Optimization

```bash
# Use Next.js Image component for automatic optimization
import Image from 'next/image';

<Image
  src={logoUrl}
  alt="Logo"
  width={200}
  height={200}
  loading="lazy"
/>
```

### Caching Strategy

```typescript
// Enable ISR (Incremental Static Regeneration)
export async function getStaticProps() {
  return {
    props: { /* data */ },
    revalidate: 60, // Revalidate every 60 seconds
  };
}
```

### CDN Setup

Vercel includes automatic CDN caching. For self-hosted:

```bash
# Use Cloudflare for free CDN
# 1. Sign up at cloudflare.com
# 2. Add your domain
# 3. Update nameservers
# 4. Enable caching rules
```

## Monitoring & Analytics

### Application Monitoring

```bash
# Install PM2 Plus for monitoring
pm2 install pm2-auto-pull
pm2 install pm2-logrotate
```

### Error Tracking

```typescript
// Integration example (Sentry)
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Analytics

```bash
# Add Google Analytics
# Install gtag
npm install @react-ga/core @react-ga/page_view_tracker
```

## Database Setup

### PostgreSQL with Prisma

```bash
# Install Prisma
npm install @prisma/client prisma

# Initialize Prisma
npx prisma init

# Create migrations
npx prisma migrate dev --name init

# Deploy to production
npx prisma migrate deploy
```

## Maintenance

### Regular Updates

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update security vulnerabilities
npm audit fix
```

### Backup Strategy

```bash
# PostgreSQL backup
pg_dump launch_rush > backup.sql

# Restore
psql launch_rush < backup.sql

# Automated backups (cron)
0 2 * * * pg_dump launch_rush > /backups/$(date +%Y%m%d).sql
```

## Scaling

### Horizontal Scaling

1. Use load balancer (Nginx, HAProxy)
2. Run multiple Node instances
3. Use sticky sessions for WebSocket
4. Database connection pooling (PgBouncer)

### Vertical Scaling

1. Increase server resources
2. Optimize database queries
3. Enable caching layers (Redis)
4. Use CDN for static assets

## Troubleshooting

### Common Issues

**Build fails with "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Application crashes after deploy**
```bash
# Check logs
vercel logs
# or for PM2
pm2 logs launch-rush
```

**High memory usage**
```bash
# Check process size
pm2 monit

# Implement caching strategy
# Reduce unnecessary data loading
```

## Support

For deployment issues:
1. Check deployment logs
2. Review environment variables
3. Verify database connectivity
4. Check blockchain RPC endpoints
5. Open GitHub issue with detailed logs
