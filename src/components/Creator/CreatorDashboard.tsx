'use client';

import React from 'react';
import { Card, Button } from '@/components/UI';
import { LaunchedToken } from '@/types';
import { getChainConfig } from '@/lib/config/chains';
import Link from 'next/link';

interface CreatorDashboardProps {
  token: LaunchedToken;
  stats?: any;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ token, stats }) => {
  const chainConfig = getChainConfig(token.chain);
  const publicPageUrl = `/token/${token.chain}/${token.address}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{token.metadata?.name}</h1>
            <p className="text-gray-400">Launched {new Date(token.launchedAt).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <Link href={publicPageUrl}>
              <Button variant="primary">View Public Page</Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs text-gray-400 mb-1">Price</div>
          <div className="text-2xl font-bold text-primary">${stats?.price?.toFixed(8) || '0'}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400 mb-1">Market Cap</div>
          <div className="text-2xl font-bold text-white">${(stats?.marketCap || 0).toLocaleString()}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400 mb-1">24h Volume</div>
          <div className="text-2xl font-bold text-white">${(stats?.volume24h || 0).toLocaleString()}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400 mb-1">Holders</div>
          <div className="text-2xl font-bold text-success">{stats?.holders || 0}</div>
        </Card>
      </div>

      {/* Charts Section */}
      <Card>
        <h2 className="text-lg font-bold text-white mb-4">Analytics</h2>
        <div className="bg-dark/50 rounded-lg h-64 flex items-center justify-center text-gray-400">
          Charts integration (Recharts ready for implementation)
        </div>
      </Card>

      {/* Token Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-white mb-3">Token Configuration</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Symbol:</span>
              <span className="text-white">{token.metadata?.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Supply:</span>
              <span className="text-white">{Number(token.totalSupply).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Decimals:</span>
              <span className="text-white">{token.decimals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Creator Allocation:</span>
              <span className="text-primary">{Number(token.creatorAllocation).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Liquidity:</span>
              <span className="text-success">{Number(token.liquidityAmount).toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-white mb-3">Contract Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Address:</div>
              <code className="text-xs bg-dark/50 p-2 rounded block break-all">{token.address}</code>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Blockchain:</div>
              <span className="text-white">{chainConfig.name}</span>
            </div>
            <a
              href={`${chainConfig.explorerUrl}/token/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              View on Explorer →
            </a>
          </div>
        </Card>
      </div>

      {/* Share Section */}
      <Card>
        <h3 className="font-semibold text-white mb-3">Share Your Token</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            fullWidth
            variant="secondary"
            size="sm"
            onClick={() => {
              const text = `Check out $${token.metadata?.symbol} on LaunchRush!`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${window.location.href}`, '_blank');
            }}
          >
            𝕏 Twitter
          </Button>
          <Button
            fullWidth
            variant="secondary"
            size="sm"
            onClick={() => {
              window.open(`https://t.me/share/url?url=${window.location.href}`, '_blank');
            }}
          >
            Telegram
          </Button>
          <Button
            fullWidth
            variant="secondary"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            Copy Link
          </Button>
          <Button fullWidth variant="secondary" size="sm" onClick={() => window.print()}>
            Print/Share
          </Button>
        </div>
      </Card>
    </div>
  );
};
