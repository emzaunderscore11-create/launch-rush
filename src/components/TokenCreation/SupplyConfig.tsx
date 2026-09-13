'use client';

import React, { useState } from 'react';
import { Button, Input, Card, Alert } from '@/components/UI';
import { useLaunchStore } from '@/store/launchStore';

interface SupplyConfigProps {
  onSubmit: (config: { totalSupply: string; decimals: number; creatorAllocation: string; liquidityAmount: string }) => void;
  isLoading?: boolean;
}

export const SupplyConfig: React.FC<SupplyConfigProps> = ({ onSubmit, isLoading = false }) => {
  const { updateTokenConfig } = useLaunchStore();
  const [totalSupply, setTotalSupply] = useState('');
  const [decimals, setDecimals] = useState('9');
  const [creatorAllocation, setCreatorAllocation] = useState('');
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!totalSupply.trim()) newErrors.totalSupply = 'Total supply is required';
    if (!creatorAllocation.trim()) newErrors.creatorAllocation = 'Creator allocation is required';
    if (!liquidityAmount.trim()) newErrors.liquidityAmount = 'Liquidity amount is required';

    try {
      const total = BigInt(totalSupply);
      const creator = BigInt(creatorAllocation);
      const liquidity = BigInt(liquidityAmount);

      if (total <= 0n) newErrors.totalSupply = 'Total supply must be greater than 0';
      if (creator < 0n) newErrors.creatorAllocation = 'Creator allocation cannot be negative';
      if (liquidity < 0n) newErrors.liquidityAmount = 'Liquidity amount cannot be negative';
      if (creator + liquidity > total) {
        newErrors.allocation = 'Creator allocation + liquidity cannot exceed total supply';
      }
    } catch {
      newErrors.format = 'Invalid number format';
    }

    const dec = parseInt(decimals);
    if (isNaN(dec) || dec < 0 || dec > 9) {
      newErrors.decimals = 'Decimals must be between 0 and 9';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const config = {
        totalSupply,
        decimals: parseInt(decimals),
        creatorAllocation,
        liquidityAmount,
      };
      updateTokenConfig(config);
      onSubmit(config);
    }
  };

  const calculateRemaining = () => {
    try {
      const total = BigInt(totalSupply || '0');
      const creator = BigInt(creatorAllocation || '0');
      const liquidity = BigInt(liquidityAmount || '0');
      const remaining = total - creator - liquidity;
      return remaining >= 0n ? remaining.toString() : 'Invalid';
    } catch {
      return 'N/A';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-6">Supply Configuration</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Total Supply */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Total Supply *</label>
          <Input
            type="number"
            placeholder="1000000000"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            step="1"
          />
          <div className="text-xs text-gray-400 mt-1">Total amount of tokens to create</div>
          {errors.totalSupply && <div className="text-error text-sm mt-1">{errors.totalSupply}</div>}
        </div>

        {/* Decimals */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Decimals *</label>
          <select
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
            className="w-full px-4 py-3 bg-dark border border-secondary/30 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            {[0, 1, 2, 3, 4, 5, 6, 8, 9].map((dec) => (
              <option key={dec} value={dec}>
                {dec} decimals
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-400 mt-1">Number of decimal places</div>
        </div>

        {/* Creator Allocation */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Creator Allocation *</label>
          <Input
            type="number"
            placeholder="250000000"
            value={creatorAllocation}
            onChange={(e) => setCreatorAllocation(e.target.value)}
            step="1"
          />
          <div className="text-xs text-gray-400 mt-1">Tokens reserved for creator</div>
          {errors.creatorAllocation && <div className="text-error text-sm mt-1">{errors.creatorAllocation}</div>}
        </div>

        {/* Liquidity Amount */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-white">Liquidity Amount *</label>
          <Input
            type="number"
            placeholder="500000000"
            value={liquidityAmount}
            onChange={(e) => setLiquidityAmount(e.target.value)}
            step="1"
          />
          <div className="text-xs text-gray-400 mt-1">Tokens to add to liquidity pool</div>
          {errors.liquidityAmount && <div className="text-error text-sm mt-1">{errors.liquidityAmount}</div>}
        </div>

        {/* Summary */}
        <Card className="bg-secondary/10 border-primary/30">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Supply:</span>
              <span className="text-white font-semibold">{totalSupply || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Creator Allocation:</span>
              <span className="text-white font-semibold">{creatorAllocation || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Liquidity Amount:</span>
              <span className="text-white font-semibold">{liquidityAmount || '0'}</span>
            </div>
            <div className="border-t border-secondary/30 pt-2 flex justify-between">
              <span className="text-gray-400">Remaining (for trading):</span>
              <span className="text-primary font-semibold">{calculateRemaining()}</span>
            </div>
          </div>
        </Card>

        {errors.allocation && <Alert variant="error" message={errors.allocation} />}
        {errors.format && <Alert variant="error" message={errors.format} />}

        <Alert
          variant="warning"
          title="Transparency"
          message="These allocations will be publicly visible. Be honest about your token distribution."
        />

        <Button type="submit" fullWidth variant="primary" size="lg" isLoading={isLoading}>
          Review & Launch →
        </Button>
      </form>
    </Card>
  );
};
