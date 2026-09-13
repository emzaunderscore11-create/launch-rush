'use client';

import React from 'react';
import { Button, Card, Badge, Alert } from '@/components/UI';
import { LaunchedToken } from '@/types';
import { formatAddress, copyToClipboard, formatNumber, formatCurrency } from '@/lib/utils/format';
import { getChainConfig } from '@/lib/config/chains';
import toast from 'react-hot-toast';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface LaunchReviewProps {
  tokenConfig: any;
  estimatedFee: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LaunchReview: React.FC<LaunchReviewProps> = ({
  tokenConfig,
  estimatedFee,
  onConfirm,
  isLoading = false,
}) => {
  const chainConfig = getChainConfig(tokenConfig.chain);

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Copied!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            {tokenConfig.metadata?.logo ? (
              <img src={tokenConfig.metadata.logo} alt={tokenConfig.metadata.name} className="w-full h-full rounded-lg object-cover" />
            ) : (
              <div className="text-primary font-bold">{tokenConfig.metadata?.symbol?.charAt(0)}</div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{tokenConfig.metadata?.name}</h2>
            <div className="text-gray-400">Ticker: {tokenConfig.metadata?.symbol}</div>
          </div>
        </div>

        <div className="space-y-3 border-b border-secondary/30 pb-4 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Blockchain:</span>
            <Badge variant="info">{chainConfig.name}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Supply:</span>
            <span className="text-white font-semibold">{formatNumber(tokenConfig.totalSupply)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Decimals:</span>
            <span className="text-white font-semibold">{tokenConfig.decimals}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Creator Allocation:</span>
            <span className="text-white font-semibold">{formatNumber(tokenConfig.creatorAllocation)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Liquidity Amount:</span>
            <span className="text-white font-semibold">{formatNumber(tokenConfig.liquidityAmount)}</span>
          </div>
        </div>

        {tokenConfig.metadata?.description && (
          <div className="mb-4 p-3 bg-secondary/10 rounded-lg">
            <div className="text-xs font-semibold text-gray-400 mb-1">Description</div>
            <div className="text-sm text-white line-clamp-3">{tokenConfig.metadata.description}</div>
          </div>
        )}
      </Card>

      {/* Social Links */}
      {(tokenConfig.metadata?.website || tokenConfig.metadata?.twitter || tokenConfig.metadata?.telegram || tokenConfig.metadata?.discord) && (
        <Card>
          <h3 className="font-semibold text-white mb-3">Social Links</h3>
          <div className="grid grid-cols-2 gap-2">
            {tokenConfig.metadata?.website && (
              <a href={tokenConfig.metadata.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                🌐 Website
              </a>
            )}
            {tokenConfig.metadata?.twitter && (
              <a href={tokenConfig.metadata.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                𝕏 Twitter
              </a>
            )}
            {tokenConfig.metadata?.telegram && (
              <a href={tokenConfig.metadata.telegram} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                💬 Telegram
              </a>
            )}
            {tokenConfig.metadata?.discord && (
              <a href={tokenConfig.metadata.discord} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                <span>Discord</span>
              </a>
            )}
          </div>
        </Card>
      )}

      {/* Transaction Details */}
      <Card>
        <h3 className="font-semibold text-white mb-3">Transaction Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Estimated Network Fee:</span>
            <span className="text-white font-semibold">{estimatedFee} {chainConfig.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network:</span>
            <Badge variant="info">{chainConfig.name}</Badge>
          </div>
        </div>
      </Card>

      {/* Checklist */}
      <Card>
        <h3 className="font-semibold text-white mb-3">Pre-Launch Checklist</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-success" />
            <span className="text-sm text-white">Wallet connected</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-success" />
            <span className="text-sm text-white">Network selected</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-success" />
            <span className="text-sm text-white">Token information complete</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-success" />
            <span className="text-sm text-white">Supply configuration confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-success" />
            <span className="text-sm text-white">Estimated fee displayed</span>
          </div>
        </div>
      </Card>

      {/* Disclaimers */}
      <Alert
        variant="warning"
        title="⚠️ Important Disclaimer"
        message="This launch cannot guarantee buyers or profits. Market success depends on community interest and trading activity. All tokens launched are real blockchain transactions."
      />

      <Alert
        variant="info"
        title="ℹ️ Contract Authority"
        message="Upon launch, the token contract will have minting authority. Ensure you understand the implications of this for your token's supply."
      />

      <div className="flex gap-2">
        <Button fullWidth variant="secondary" size="lg" disabled={isLoading}>
          ← Back
        </Button>
        <Button fullWidth variant="primary" size="lg" isLoading={isLoading} onClick={onConfirm}>
          🚀 Launch Token
        </Button>
      </div>
    </div>
  );
};
