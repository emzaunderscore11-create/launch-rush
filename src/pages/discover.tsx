'use client';

import React, { useState } from 'react';
import { DiscoveryFeed } from '@/components/Discovery/DiscoveryFeed';
import { TokenSearch } from '@/components/UI/TokenSearch';
import { Card, Button } from '@/components/UI';
import { WalletDisplay } from '@/components/Wallet/WalletDisplay';
import { useWalletStore } from '@/store/walletStore';
import Link from 'next/link';

const Discover = () => {
  const { wallet } = useWalletStore();
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (tokenAddress: string, chain: string) => {
    setIsSearching(true);
    try {
      // Mock search - in production, fetch from API
      console.log(`Searching for ${tokenAddress} on ${chain}`);
      // setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-darker">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-dark/80 backdrop-blur border-b border-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              🚀 LaunchRush
            </Link>
            <div className="flex items-center gap-4">
              {wallet && <WalletDisplay />}
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Discover Tokens</h1>
          <p className="text-gray-400">Explore newly launched and trending meme tokens</p>
        </div>

        {/* Search Widget */}
        <div className="mb-8">
          <TokenSearch onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {/* Feed */}
        <DiscoveryFeed />
      </div>
    </div>
  );
};

export default Discover;
