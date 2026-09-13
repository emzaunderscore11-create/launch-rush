import React from 'react';
import type { NextPage } from 'next';
import { WalletConnector } from '@/components/Wallet/WalletConnector';
import { Button, Card } from '@/components/UI';
import Link from 'next/link';
import { ArrowRightIcon, SparklesIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-darker">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-dark/80 backdrop-blur border-b border-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              🚀 LaunchRush
            </div>
            <div className="flex gap-2">
              <Link href="/discover">
                <Button variant="ghost" size="sm">
                  Discover
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Launch Your Meme Token in Minutes
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              Fast, transparent, and honest meme token launches. Real blockchain transactions, real community, real trading.
            </p>
            <div className="flex gap-3">
              <Link href="#launch">
                <Button variant="primary" size="lg">
                  <RocketLaunchIcon className="w-5 h-5" />
                  Start Launching
                </Button>
              </Link>
              <Link href="/discover">
                <Button variant="secondary" size="lg">
                  Explore Tokens
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-primary/30">
            <div className="text-center">
              <SparklesIcon className="w-24 h-24 text-primary mx-auto mb-4" />
              <p className="text-gray-400">Your token page will look amazing</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card>
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">From wallet connection to live token in under 5 minutes. Minimal clicks, maximum efficiency.</p>
          </Card>
          <Card>
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-white mb-2">Transparent & Secure</h3>
            <p className="text-gray-400 text-sm">All contract details, allocations, and fees visible before launch. No hidden information.</p>
          </Card>
          <Card>
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-bold text-white mb-2">Mobile First</h3>
            <p className="text-gray-400 text-sm">Optimized for Android and mobile browsers. Large buttons, simple navigation on any phone.</p>
          </Card>
        </div>

        {/* Launch Section */}
        <div id="launch" className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Ready to Launch?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <WalletConnector onConnected={() => {}} />
            
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">How It Works</h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">1.</span>
                  <span className="text-gray-400">Connect your wallet (Phantom, MetaMask)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">2.</span>
                  <span className="text-gray-400">Select blockchain (Solana or Base)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">3.</span>
                  <span className="text-gray-400">Enter token details and supply</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">4.</span>
                  <span className="text-gray-400">Review and confirm launch</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">5.</span>
                  <span className="text-gray-400">Sign transaction and get public page</span>
                </li>
              </ol>
            </Card>
          </div>
        </div>

        {/* Important Notes */}
        <Card className="border-warning/50 bg-warning/5 mb-12">
          <h3 className="font-bold text-warning mb-3">⚠️ Important Disclaimer</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>✓ LaunchRush does NOT create fake buyers or artificial trading volume</li>
            <li>✓ We do NOT guarantee profits or buyers for any token</li>
            <li>✓ All blockchain transactions are REAL and require explicit wallet confirmation</li>
            <li>✓ We NEVER store private keys or seed phrases</li>
            <li>✓ Token success depends on community interest and legitimate trading</li>
            <li>✓ Use responsibly and follow all local regulations</li>
          </ul>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-darker border-t border-secondary/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-3">LaunchRush</h4>
              <p className="text-gray-400 text-sm">Honest meme token launches on real blockchains.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/discover" className="hover:text-primary">Discover Tokens</Link></li>
                <li><Link href="#launch" className="hover:text-primary">Launch Token</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Docs (Coming soon)</li>
                <li>GitHub</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary/20 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 LaunchRush. Built for transparent, honest meme token launches.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
