import React, { useEffect, useState } from 'react';
import { Wallet, Loader } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { formatAddress } from '../../../utils/helper';

export const WalletButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  // UI states
  const [connecting, setConnecting] = useState(false); // only for wallet modal
  const [fetching, setFetching]   = useState(false);   // fetching user details after connect

  const getUserDetails = useStore((s) => s.getUserDetails);

  const handleConnect = async () => {
    if (!isConnected) {
      try {
        setConnecting(true);
        await open();
      } finally {
        setConnecting(false);
      }
    }
  };

  // Fetch full user data once wallet is connected
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isConnected || !address) return;
      try {
        setFetching(true);
        const res = await getUserDetails(address);
        if (cancelled) return;

        // Save only after a successful fetch
        if (res?.isRegistered) {
          localStorage.setItem('userAddress', address);
          localStorage.setItem('isRegistered', 'true');
        } else {
          localStorage.setItem('userAddress', address);
          localStorage.removeItem('isRegistered');
        }
      } catch (err) {
        if (!cancelled) console.error('getUserDetails failed:', err);
      } finally {
        if (!cancelled) setFetching(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [address, isConnected, getUserDetails]);

  // --- Renders ---

  // While we’re fetching user data after connecting, show a loader
  if (isConnected && address && (connecting || fetching)) {
    return (
      <div className="flex items-center gap-2 bg-gray-800/60 border border-gray-600 rounded-lg px-3 sm:px-4 py-2">
        <Loader className="w-4 h-4 animate-spin" />
        <span className="text-xs sm:text-sm text-gray-200">Loading account…</span>
      </div>
    );
  }

  // Fully connected and user data fetched
  if (isConnected && address && !fetching) {
    return (
      <div className="flex items-center gap-2 bg-green-950/50 border border-emerald-500/50 rounded-lg px-3 sm:px-4 py-2">
        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-xs sm:text-sm font-medium text-emerald-300">
          {formatAddress(address)}
        </span>
      </div>
    );
  }

  // Not connected yet
  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="w-full  flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base"
    >
      {connecting ? (
        <>
          <Loader className="w-5 h-5 animate-spin" />
          Connecting…
        </>
      ) : (
        <>
          <Wallet className="w-5 h-5" />
          Connect Wallet
        </>
      )}
    </button>
  );
};
