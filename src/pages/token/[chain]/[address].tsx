'use client';

import React, { useState, useEffect } from 'react';
import { LaunchedToken, TokenStats } from '@/types';
import { useRouter } from 'next/router';
import { PublicTokenPage } from '@/components/TokenPage/PublicTokenPage';
import { Card, LoadingSpinner, Alert } from '@/components/UI';
import { tokenApi } from '@/lib/api/tokenApi';
import { WalletDisplay } from '@/components/Wallet/WalletDisplay';
import { useWalletStore } from '@/store/walletStore';
import Link from 'next/link';

const TokenDetailPage = () => {
  const router = useRouter();
  const { chain, address } = router.query;
  const { wallet } = useWalletStore();
  const [token, setToken] = useState<LaunchedToken | null>(null);
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [holders, setHolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chain || !address) return;

    const loadTokenData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In production, fetch from API
        // const tokenData = await tokenApi.getToken(address as string, chain as string);
        // const statsData = await tokenApi.getTokenStats(address as string, chain as string);
        // const txData = await tokenApi.getTokenTransactions(address as string, chain as string);
        // const holdersData = await tokenApi.getTokenHolders(address as string, chain as string);

        // Mock data
        console.log('Loading token:', { chain, address });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load token');
      } finally {
        setIsLoading(false);
      }
    };

    loadTokenData();
  }, [chain, address]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-darker flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-darker">
        <nav className="bg-dark/80 backdrop-blur border-b border-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                🚀 LaunchRush
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="error" title="Error" message={error} />
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-darker">
        <nav className="bg-dark/80 backdrop-blur border-b border-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                🚀 LaunchRush
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <p className="text-gray-400">Token not found</p>
          </Card>
        </div>
      </div>
    );
  }

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
              <Link href="/discover">
                <div className="text-primary hover:underline cursor-pointer">← Back to Discover</div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PublicTokenPage token={token} stats={stats || undefined} transactions={transactions} holders={holders} />
      </div>
    </div>
  );
};

export default TokenDetailPage;
