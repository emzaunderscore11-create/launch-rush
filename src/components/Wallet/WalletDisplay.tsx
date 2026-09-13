'use client';

import React from 'react';
import { useWalletStore } from '@/store/walletStore';
import { Button } from '../UI';
import { formatAddress, copyToClipboard } from '@/lib/utils/format';
import toast from 'react-hot-toast';

export const WalletDisplay: React.FC = () => {
  const { wallet, disconnect } = useWalletStore();

  if (!wallet) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(wallet.address);
    if (success) {
      toast.success('Wallet address copied!');
    }
  };

  return (
    <div className="flex items-center gap-2 bg-secondary/20 rounded-lg px-4 py-2">
      <div className="flex-1">
        <div className="text-xs text-gray-400">Connected</div>
        <div className="text-sm font-semibold text-white cursor-pointer hover:text-primary" onClick={handleCopy}>
          {formatAddress(wallet.address)}
        </div>
      </div>
      <Button size="sm" variant="ghost" onClick={disconnect}>
        Disconnect
      </Button>
    </div>
  );
};
