'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, LoadingSpinner } from '@/components/UI';
import { LaunchedToken, TransactionStatus } from '@/types';
import { formatAddress, copyToClipboard } from '@/lib/utils/format';
import toast from 'react-hot-toast';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface LaunchStatusProps {
  status: TransactionStatus;
  statusMessage?: string;
  launchedToken?: LaunchedToken;
  transactionHash?: string;
}

const statusConfig = {
  idle: { icon: ClockIcon, color: 'text-gray-400', label: 'Ready' },
  preparing: { icon: ClockIcon, color: 'text-warning', label: 'Preparing...' },
  waiting: { icon: ClockIcon, color: 'text-primary', label: 'Waiting for confirmation...' },
  submitted: { icon: ClockIcon, color: 'text-primary', label: 'Submitted' },
  confirming: { icon: LoadingSpinner, color: 'text-primary', label: 'Confirming...' },
  success: { icon: CheckCircleIcon, color: 'text-success', label: 'Success!' },
  failed: { icon: XCircleIcon, color: 'text-error', label: 'Failed' },
};

export const LaunchStatus: React.FC<LaunchStatusProps> = ({
  status,
  statusMessage,
  launchedToken,
  transactionHash,
}) => {
  const config = statusConfig[status];
  const IconComponent = config.icon as any;

  const handleCopyAddress = async () => {
    if (launchedToken?.address) {
      const success = await copyToClipboard(launchedToken.address);
      if (success) toast.success('Token address copied!');
    }
  };

  const handleCopyTx = async () => {
    if (transactionHash) {
      const success = await copyToClipboard(transactionHash);
      if (success) toast.success('Transaction hash copied!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {status === 'confirming' ? (
              <LoadingSpinner size="lg" />
            ) : (
              <IconComponent className={`w-16 h-16 ${config.color}`} />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{config.label}</h2>
          {statusMessage && <p className="text-gray-400">{statusMessage}</p>}
        </div>

        {status === 'failed' && (
          <Alert variant="error" title="Launch Failed" message={statusMessage || 'An error occurred during token launch. Please try again.'} />
        )}

        {status === 'success' && launchedToken && (
          <div className="space-y-4">
            <Alert variant="success" title="✅ Token Launched Successfully!" message="Your token is now live on the blockchain." />

            <Card className="bg-primary/10 border-primary/50">
              <h3 className="font-semibold text-primary mb-3">Token Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-gray-400 text-xs mb-1">Token Address</div>
                  <div className="flex items-center gap-2">
                    <code className="text-primary font-mono text-xs break-all">{formatAddress(launchedToken.address, 6)}</code>
                    <Button size="sm" variant="ghost" onClick={handleCopyAddress}>
                      📋
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Chain</div>
                  <div className="text-white">{launchedToken.chain.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Creator Address</div>
                  <div className="text-white text-xs font-mono">{formatAddress(launchedToken.creatorAddress, 6)}</div>
                </div>
              </div>
            </Card>

            {transactionHash && (
              <Card className="bg-secondary/10">
                <h3 className="font-semibold text-white mb-3">Transaction</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 break-all">
                    <code className="text-gray-400 font-mono text-xs flex-1">{formatAddress(transactionHash, 6)}</code>
                    <Button size="sm" variant="ghost" onClick={handleCopyTx}>
                      📋
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex flex-col gap-2">
              <Button fullWidth variant="primary" size="lg" onClick={() => (window.location.href = '/token/' + launchedToken.address)}>
                View Public Page 👀
              </Button>
              <Button fullWidth variant="secondary" size="lg" onClick={() => (window.location.href = '/discover')}>
                Back to Discovery 🏠
              </Button>
            </div>
          </div>
        )}

        {status === 'waiting' && (
          <Alert variant="info" title="Waiting for Signature" message="Please confirm the transaction in your wallet." />
        )}

        {status === 'submitted' && (
          <Alert variant="info" title="Transaction Submitted" message="Your transaction has been submitted to the blockchain. Please wait for confirmation." />
        )}
      </Card>
    </div>
  );
};
