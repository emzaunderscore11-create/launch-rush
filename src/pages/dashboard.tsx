'use client';

import React, { useState } from 'react';
import { useLaunchStore } from '@/store/launchStore';
import { useWalletStore } from '@/store/walletStore';
import { TokenInfoForm } from '@/components/TokenCreation/TokenInfoForm';
import { SupplyConfig } from '@/components/TokenCreation/SupplyConfig';
import { LaunchReview } from '@/components/TokenCreation/LaunchReview';
import { LaunchStatus } from '@/components/TokenCreation/LaunchStatus';
import { WalletConnector } from '@/components/Wallet/WalletConnector';
import { WalletDisplay } from '@/components/Wallet/WalletDisplay';
import { Card, Alert } from '@/components/UI';
import { getChainConfig } from '@/lib/config/chains';
import Link from 'next/link';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { currentStep, setStep, tokenConfig, setEstimatedFee, transactionStatus, setTransactionStatus } = useLaunchStore();
  const { wallet, selectedChain } = useWalletStore();
  const [statusMessage, setStatusMessage] = useState('');

  if (!wallet) {
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
          <WalletConnector onConnected={() => setStep('create')} />
        </div>
      </div>
    );
  }

  const handleTokenInfoSubmit = async (metadata: any) => {
    setStep('create');
  };

  const handleSupplySubmit = async (config: any) => {
    const chainConfig = getChainConfig(selectedChain as any);
    setEstimatedFee(chainConfig.minCreationFee);
    setStep('review');
  };

  const handleLaunchConfirm = async () => {
    setStep('confirm');
    setTransactionStatus('preparing');
    setStatusMessage('Preparing token creation...');

    try {
      // Simulate token launch
      setTimeout(() => {
        setTransactionStatus('waiting');
        setStatusMessage('Waiting for wallet signature...');
      }, 1000);

      setTimeout(() => {
        setTransactionStatus('submitted');
        setStatusMessage('Transaction submitted to blockchain...');
      }, 3000);

      setTimeout(() => {
        setTransactionStatus('confirming');
        setStatusMessage('Confirming transaction...');
      }, 5000);

      setTimeout(() => {
        setTransactionStatus('success');
        setStatusMessage('Token launched successfully!');
      }, 8000);
    } catch (error) {
      setTransactionStatus('failed');
      setStatusMessage(error instanceof Error ? error.message : 'Launch failed');
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
            <WalletDisplay />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`flex-1 text-center pb-4 border-b-2 ${currentStep === 'connect' ? 'border-primary' : 'border-secondary/30'}`}>
              <div className={`text-sm font-semibold ${currentStep === 'connect' ? 'text-primary' : 'text-gray-400'}`}>Wallet</div>
            </div>
            <div className={`flex-1 text-center pb-4 border-b-2 ${currentStep === 'create' ? 'border-primary' : 'border-secondary/30'}`}>
              <div className={`text-sm font-semibold ${currentStep === 'create' ? 'text-primary' : 'text-gray-400'}`}>Info</div>
            </div>
            <div className={`flex-1 text-center pb-4 border-b-2 ${currentStep === 'review' ? 'border-primary' : 'border-secondary/30'}`}>
              <div className={`text-sm font-semibold ${currentStep === 'review' ? 'text-primary' : 'text-gray-400'}`}>Review</div>
            </div>
            <div className={`flex-1 text-center pb-4 border-b-2 ${currentStep === 'confirm' ? 'border-primary' : 'border-secondary/30'}`}>
              <div className={`text-sm font-semibold ${currentStep === 'confirm' ? 'text-primary' : 'text-gray-400'}`}>Launch</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          {currentStep === 'create' && (
            <div className="space-y-4">
              <TokenInfoForm onSubmit={handleTokenInfoSubmit} />
              <SupplyConfig onSubmit={handleSupplySubmit} />
            </div>
          )}

          {currentStep === 'review' && (
            <LaunchReview
              tokenConfig={tokenConfig}
              estimatedFee={tokenConfig.estimatedFee || '0'}
              onConfirm={handleLaunchConfirm}
            />
          )}

          {currentStep === 'confirm' && (
            <LaunchStatus
              status={transactionStatus}
              statusMessage={statusMessage}
              launchedToken={transactionStatus === 'success' ? (tokenConfig as any) : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
