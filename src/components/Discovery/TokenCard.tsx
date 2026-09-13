'use client';

import React from 'react';
import { Card, Badge, Button } from '@/components/UI';
import { DiscoveryToken } from '@/types';
import { formatNumber, formatCurrency, formatTime } from '@/lib/utils/format';
import Link from 'next/link';

interface TokenCardProps {
  token: DiscoveryToken;
  showTrendingScore?: boolean;
}

export const TokenCard: React.FC<TokenCardProps> = ({ token, showTrendingScore = false }) => {
  return (
    <Link href={`/token/${token.chain}/${token.address}`}>
      <Card className="cursor-pointer hover:border-primary/50 transition-all h-full">
        <div className="flex gap-3 mb-4">
          {/* Logo */}
          <div className="w-12 h-12 rounded-lg bg-secondary/20 flex-shrink-0 overflow-hidden">
            {token.metadata?.logo ? (
              <img
                src={token.metadata.logo}
                alt={token.metadata.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-primary">
                {token.metadata?.symbol?.charAt(0)}
              </div>
            )}
          </div>

          {/* Header */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{token.metadata?.name}</h3>
                <div className="text-xs text-gray-400">${token.metadata?.symbol}</div>
              </div>
              {showTrendingScore && token.trendingScore && (
                <Badge variant="success">#{token.trendingScore}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-dark/50 rounded p-2">
            <div className="text-xs text-gray-400">Price</div>
            <div className="text-sm font-semibold text-primary">
              {token.stats?.price ? formatCurrency(token.stats.price) : 'N/A'}
            </div>
          </div>
          <div className="bg-dark/50 rounded p-2">
            <div className="text-xs text-gray-400">24h Volume</div>
            <div className="text-sm font-semibold text-white">
              {token.stats?.volume24h ? formatCurrency(token.stats.volume24h) : 'N/A'}
            </div>
          </div>
          <div className="bg-dark/50 rounded p-2">
            <div className="text-xs text-gray-400">Liquidity</div>
            <div className="text-sm font-semibold text-white">
              {token.stats?.liquidity ? formatCurrency(token.stats.liquidity) : 'N/A'}
            </div>
          </div>
          <div className="bg-dark/50 rounded p-2">
            <div className="text-xs text-gray-400">Holders</div>
            <div className="text-sm font-semibold text-white">
              {token.stats?.holders ? formatNumber(token.stats.holders) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-secondary/20 pt-3">
          <span>Launched {formatTime(token.launchedAt.getTime())}</span>
          <Badge variant="info">{token.chain.toUpperCase()}</Badge>
        </div>
      </Card>
    </Link>
  );
};
