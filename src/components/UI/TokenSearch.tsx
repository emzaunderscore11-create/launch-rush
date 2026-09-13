'use client';

import React, { useState } from 'react';
import { Button, Input, Card, Alert } from '@/components/UI';
import { copyToClipboard, isValidWalletAddress } from '@/lib/utils/format';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface TokenSearchProps {
  onSearch: (tokenAddress: string, chain: string) => void;
  isLoading?: boolean;
}

export const TokenSearch: React.FC<TokenSearchProps> = ({ onSearch, isLoading = false }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('solana');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    setError(null);

    if (!tokenAddress.trim()) {
      setError('Please enter a token address');
      return;
    }

    if (!isValidWalletAddress(tokenAddress.trim(), selectedChain as 'solana' | 'base')) {
      setError(`Invalid ${selectedChain} token address format`);
      return;
    }

    onSearch(tokenAddress.trim(), selectedChain);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <MagnifyingGlassIcon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-white">Search Token</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Blockchain</label>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="w-full px-4 py-2 bg-dark border border-secondary/30 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option value="solana">Solana</option>
            <option value="base">Base</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Token Address</label>
          <Input
            type="text"
            placeholder={selectedChain === 'solana' ? 'Enter Solana token address' : 'Enter contract address (0x...)'}
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>

        {error && <Alert variant="error" message={error} />}

        <Button fullWidth variant="primary" size="lg" onClick={handleSearch} isLoading={isLoading}>
          Search Token
        </Button>
      </div>
    </Card>
  );
};
