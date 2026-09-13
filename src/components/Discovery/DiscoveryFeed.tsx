'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, LoadingSpinner } from '@/components/UI';
import { TokenCard } from './TokenCard';
import { useDiscoveryStore } from '@/store/discoveryStore';
import { SortOption } from '@/types';
import { tokenApi } from '@/lib/api/tokenApi';
import toast from 'react-hot-toast';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: '🆕 Newest' },
  { value: 'volume', label: '📊 Highest Volume' },
  { value: 'liquidity', label: '💧 Most Liquidity' },
  { value: 'holders', label: '👥 Most Holders' },
  { value: 'trending', label: '🔥 Trending' },
];

export const DiscoveryFeed: React.FC = () => {
  const { tokens, isLoading, sortBy, hasMore, setTokens, addTokens, setIsLoading, setSortBy, setHasMore } =
    useDiscoveryStore();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    loadTokens(sortBy, 0);
  }, [sortBy]);

  const loadTokens = async (sort: SortOption, startOffset: number) => {
    try {
      setIsLoading(true);
      const response = await tokenApi.getNewTokens({
        sort,
        limit: 20,
        offset: startOffset,
      });

      if (startOffset === 0) {
        setTokens(response.tokens || []);
      } else {
        addTokens(response.tokens || []);
      }

      setHasMore(response.hasMore || false);
      setOffset(startOffset + 20);
    } catch (error) {
      console.error('Error loading tokens:', error);
      toast.error('Failed to load tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    loadTokens(sortBy, offset);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  return (
    <div className="space-y-4">
      {/* Sort Options */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SORT_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={sortBy === option.value ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleSortChange(option.value)}
            className="flex-shrink-0"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Token Grid */}
      {tokens.length === 0 && !isLoading ? (
        <Card className="text-center py-12">
          <div className="text-gray-400">No tokens found. Be the first to launch! 🚀</div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokens.map((token) => (
              <TokenCard
                key={`${token.chain}-${token.address}`}
                token={token}
                showTrendingScore={sortBy === 'trending'}
              />
            ))}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !isLoading && (
            <div className="text-center">
              <Button variant="secondary" onClick={handleLoadMore} size="lg">
                Load More Tokens
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
