'use client';

import React, { useState } from 'react';
import { Button, Input, Card, Alert } from './index';
import { useWalletStore } from '@/store/walletStore';
import { ChainId } from '@/types';
import { getSupportedChains } from '@/lib/config/chains';

interface WalletConnectorProps {
  onConnected?: (wallet: any) => void;
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ onConnected }) => {
  const { setWallet, setSelectedChain, setIsConnecting, setError } = useWalletStore();
  const [manualAddress, setManualAddress] = useState('');
  const [selectedChainLocal, setSelectedChainLocal] = useState<ChainId>('solana');
  const [error, setErrorLocal] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      setErrorLocal(null);

      // Check for Phantom (Solana) or browser wallet (Base)
      if (selectedChainLocal === 'solana') {
        // @ts-ignore
        if (!window.phantom) {
          throw new Error('Please install Phantom Wallet to connect to Solana');
        }

        // @ts-ignore
        const provider = window.phantom.solana;
        const response = await provider.connect();
        const walletAddress = response.publicKey.toString();

        // Fetch balance
        const balance = '0'; // Would fetch from blockchain in production

        setWallet({
          address: walletAddress,
          chain: 'solana',
          balance,
          isConnected: true,
        });
        setSelectedChain('solana');
        onConnected?.({ address: walletAddress, chain: 'solana' });
      } else if (selectedChainLocal === 'base') {
        // @ts-ignore
        if (!window.ethereum) {
          throw new Error('Please install MetaMask or another Web3 wallet to connect to Base');
        }

        // @ts-ignore
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        const walletAddress = accounts[0];

        setWallet({
          address: walletAddress,
          chain: 'base',
          balance: '0',
          isConnected: true,
        });
        setSelectedChain('base');
        onConnected?.({ address: walletAddress, chain: 'base' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setErrorLocal(message);
      setError(message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualConnect = async () => {
    if (!manualAddress.trim()) {
      setErrorLocal('Please enter a wallet address');
      return;
    }

    try {
      setIsConnecting(true);
      setErrorLocal(null);

      // Validate address format based on chain
      if (selectedChainLocal === 'solana') {
        if (!/^[1-9A-HJ-NP-Z]{32,44}$/.test(manualAddress)) {
          throw new Error('Invalid Solana wallet address');
        }
      } else if (selectedChainLocal === 'base') {
        if (!/^0x[a-fA-F0-9]{40}$/.test(manualAddress)) {
          throw new Error('Invalid Base wallet address (must start with 0x)');
        }
      }

      setWallet({
        address: manualAddress,
        chain: selectedChainLocal,
        balance: '0',
        isConnected: true,
      });
      setSelectedChain(selectedChainLocal);
      onConnected?.({ address: manualAddress, chain: selectedChainLocal });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid wallet address';
      setErrorLocal(message);
      setError(message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-xl font-bold text-primary mb-4">Connect Wallet</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Select Blockchain</label>
          <select
            value={selectedChainLocal}
            onChange={(e) => setSelectedChainLocal(e.target.value as ChainId)}
            className="w-full px-4 py-2 bg-dark border border-secondary/30 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            {getSupportedChains().map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        {error && <Alert variant="error" message={error} />}

        <Button fullWidth onClick={handleConnectWallet} variant="primary" size="lg">
          🔌 Connect {selectedChainLocal === 'solana' ? 'Phantom' : 'MetaMask'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark text-gray-400">or connect manually</span>
          </div>
        </div>

        <div>
          <Input
            type="text"
            placeholder={selectedChainLocal === 'solana' ? 'Solana wallet address' : 'Ethereum address (0x...)'}
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
          />
        </div>

        <Button fullWidth onClick={handleManualConnect} variant="secondary" size="lg">
          Connect Address
        </Button>
      </div>
    </Card>
  );
};
