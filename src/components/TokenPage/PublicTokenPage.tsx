'use client';

import React from 'react';
import { Button, Card, Badge } from '@/components/UI';
import { LaunchedToken, TokenStats } from '@/types';
import { formatAddress, copyToClipboard, formatCurrency, formatNumber, formatTime } from '@/lib/utils/format';
import { getChainConfig } from '@/lib/config/chains';
import toast from 'react-hot-toast';
import QRCode from 'qrcode.react';
import { ShareIcon, DocumentDuplicateIcon, LinkIcon } from '@heroicons/react/24/outline';

interface PublicTokenPageProps {
  token: LaunchedToken;
  stats?: TokenStats;
  transactions?: any[];
  holders?: any[];
}

export const PublicTokenPage: React.FC<PublicTokenPageProps> = ({
  token,
  stats,
  transactions = [],
  holders = [],
}) => {
  const chainConfig = getChainConfig(token.chain);
  const tokenUrl = `${process.env.NEXT_PUBLIC_APP_URL}/token/${token.chain}/${token.address}`;

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(token.address);
    if (success) toast.success('Address copied!');
  };

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(tokenUrl);
    if (success) toast.success('URL copied!');
  };

  const handleShareTwitter = () => {
    const text = `🚀 Check out $${token.metadata.symbol} (${token.metadata.name}) launched on ${chainConfig.name}! #memecoin #crypto`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(tokenUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    const text = `🚀 Check out $${token.metadata.symbol} (${token.metadata.name}) on LaunchRush!`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(tokenUrl)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />

        <div className="relative flex gap-6 items-start mb-6">
          <div className="w-24 h-24 rounded-xl bg-secondary/20 flex-shrink-0 overflow-hidden">
            {token.metadata?.logo ? (
              <img src={token.metadata.logo} alt={token.metadata.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
                {token.metadata?.symbol?.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{token.metadata?.name}</h1>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="info">${token.metadata?.symbol}</Badge>
              <Badge variant="info">{chainConfig.name}</Badge>
              <Badge variant="success">LIVE</Badge>
            </div>
            <p className="text-gray-400">{token.metadata?.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <Button fullWidth variant="primary" size="md" onClick={handleCopyAddress}>
            <DocumentDuplicateIcon className="w-4 h-4" />
            Copy Address
          </Button>
          <Button fullWidth variant="secondary" size="md" onClick={handleShareTwitter}>
            𝕏 Twitter
          </Button>
          <Button fullWidth variant="secondary" size="md" onClick={handleShareTelegram}>
            💬 Telegram
          </Button>
          <Button fullWidth variant="primary" size="md" onClick={handleCopyUrl}>
            <LinkIcon className="w-4 h-4" />
            Copy Link
          </Button>
        </div>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs text-gray-400 mb-1">Price</div>
          <div className="text-2xl font-bold text-primary">{stats?.price ? formatCurrency(stats.price) : 'N/A'}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400 mb-1">24h Volume</div>
          <div className="text-2xl font-bold text-white">{stats?.volume24h ? formatCurrency(stats.volume24h) : 'N/A'}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400 mb-1">Market Cap</div>
          <div className="text-2xl font-bold text-white">{stats?.marketCap ? formatCurrency(stats.marketCap) : 'N/A'}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400 mb-1">Liquidity</div>
          <div className="text-2xl font-bold text-success">{stats?.liquidity ? formatCurrency(stats.liquidity) : 'N/A'}</div>
        </Card>
      </div>

      {/* Token Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">Token Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Supply:</span>
              <span className="text-white font-semibold">{formatNumber(token.totalSupply)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Decimals:</span>
              <span className="text-white font-semibold">{token.decimals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Holders:</span>
              <span className="text-white font-semibold">{stats?.holders ? formatNumber(stats.holders) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Token Age:</span>
              <span className="text-white font-semibold">{stats?.age ? formatTime(stats.age) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Creator Allocation:</span>
              <span className="text-white font-semibold">{formatNumber(token.creatorAllocation)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-white mb-4">Contract Details</h2>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Address:</div>
              <div className="font-mono text-xs break-all bg-dark/50 p-2 rounded">{token.address}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Creator:</div>
              <div className="font-mono text-xs break-all bg-dark/50 p-2 rounded">{token.creatorAddress}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Blockchain:</div>
              <Badge>{chainConfig.name}</Badge>
            </div>
            <a
              href={`${chainConfig.explorerUrl}/token/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-primary hover:underline"
            >
              View on Explorer →
            </a>
          </div>
        </Card>
      </div>

      {/* Share QR Code */}
      <Card className="text-center">
        <h2 className="text-lg font-bold text-white mb-4">Share This Token</h2>
        <div className="flex justify-center mb-4">
          <QRCode value={tokenUrl} size={200} bgColor="#0A0E27" fgColor="#00D9FF" />
        </div>
        <p className="text-sm text-gray-400">Scan to share or copy the link above</p>
      </Card>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">Recent Transactions</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transactions.map((tx, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm p-2 bg-dark/50 rounded">
                <div className="text-gray-400">{tx.type}</div>
                <div className="text-white font-semibold">{formatNumber(tx.amount)}</div>
                <div className="text-xs text-gray-500">{formatTime(tx.timestamp)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top Holders */}
      {holders.length > 0 && (
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">Top Holders</h2>
          <div className="space-y-2">
            {holders.slice(0, 10).map((holder, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div>#{idx + 1} {formatAddress(holder.address)}</div>
                <div className="text-right">
                  <div className="text-white font-semibold">{formatNumber(holder.amount)}</div>
                  <div className="text-xs text-gray-400">{(holder.percentage || 0).toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Social Links */}
      {(token.metadata?.website || token.metadata?.twitter || token.metadata?.telegram || token.metadata?.discord) && (
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">Official Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {token.metadata?.website && (
              <a
                href={token.metadata.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-secondary/20 rounded-lg text-center hover:bg-secondary/30 transition"
              >
                🌐 Website
              </a>
            )}
            {token.metadata?.twitter && (
              <a
                href={token.metadata.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-secondary/20 rounded-lg text-center hover:bg-secondary/30 transition"
              >
                𝕏 Twitter
              </a>
            )}
            {token.metadata?.telegram && (
              <a
                href={token.metadata.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-secondary/20 rounded-lg text-center hover:bg-secondary/30 transition"
              >
                💬 Telegram
              </a>
            )}
            {token.metadata?.discord && (
              <a
                href={token.metadata.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-secondary/20 rounded-lg text-center hover:bg-secondary/30 transition"
              >
                Discord
              </a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
