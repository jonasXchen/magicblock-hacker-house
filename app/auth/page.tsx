'use client';

import { useState, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import Link from 'next/link';
import ParticleBackground from '../components/ParticleBackground';
import Spotlight from '../components/Spotlight';

import '@solana/wallet-adapter-react-ui/styles.css';

function AuthContent() {
  const { publicKey, signMessage } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    if (!publicKey || !signMessage) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign a message to verify wallet ownership
      const message = new TextEncoder().encode('Sign to join MagicBlock Hacker House');
      const signature = await signMessage(message);

      // Send public key and signature to backend to verify
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: publicKey.toString(),
          signature: Buffer.from(signature).toString('base64'),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.redirect === '/join') {
          // User doesn't exist, redirect to form (cookie set by server)
          window.location.href = `/join`;
        } else if (data.redirect === 'office') {
          // User exists and form is complete, redirect to office
          window.location.href = 'https://play.workadventu.re/@/magicblock/magicblock-office/startup';
        } else {
          throw new Error(data.error || 'Authentication failed');
        }
      } else {
        const result = await response.json();
        if (result.redirect === '/join') {
          // Cookie set by server in response
          window.location.href = `/join`;
        } else if (result.redirect === 'office') {
          window.location.href = 'https://play.workadventu.re/@/magicblock/magicblock-office/startup';
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <Spotlight />
      <ParticleBackground />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-12 pb-8">
        <div className="w-full max-w-sm backdrop-blur-md bg-white/5 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-white">Join the Hacker House</h1>
              <p className="text-gray-400 text-xs">Connect your Solana wallet to continue</p>
            </div>

            <div className="flex flex-col gap-4 items-center">
              <div className="w-full flex justify-center">
                <WalletMultiButton />
              </div>

              {publicKey && (
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Sign & Continue'}
                </button>
              )}

              {error && <div className="text-red-400 text-xs">{error}</div>}
            </div>

            <Link href="/" className="text-center text-xs text-gray-400 hover:text-gray-300">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AuthContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
