import React, { useState } from 'react';
import { Circle, Search } from 'lucide-react';
import Swal from 'sweetalert2';                     // ✅ import it
import { WalletButton } from '../../components/WalletConnection/WalletButton';
import { ViewedUserProfile } from '../ViewedUserProfile';
import { useStore } from '../../../store/useStore';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const StartSceen = () => {
  // store action
  const checkUserById = useStore((s) => s.checkUserById);

  // input & view mode state
  const [userIdInput, setUserIdInput] = useState('');
  const [viewUserExist, setViewUserExist] = useState(
    typeof window !== 'undefined' ? !!localStorage.getItem('userAddress') : false
  );

  const handleViewUserById = async () => {
    try {
      const trimmed = String(userIdInput || '').trim();
      const numericId = Number(trimmed);

      if (!trimmed || !Number.isFinite(numericId) || numericId <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Please enter a valid ID',
          text: 'The user ID must be a positive number.',
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      const res = await checkUserById(numericId);   // 👈 if your fn expects number
      const addr = String(res || '').toLowerCase();

      if (!addr || addr === ZERO_ADDRESS.toLowerCase()) {
        Swal.fire({
          icon: 'error',
          title: 'ID not found',
          text: 'No user associated with that ID.',
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      // Save and switch to view mode
      localStorage.setItem('userAddress', addr);
      localStorage.setItem('viewUserId', String(numericId));
      setViewUserExist(true);
    } catch (error) {
      console.error('checkUserById failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lookup failed',
        text: error?.message || 'Something went wrong while checking the user.',
      });
    }
  };

  if (viewUserExist) {
    return (
      <ViewedUserProfile
        userId={Number(localStorage.getItem('viewUserId') || userIdInput || '0')}
        onBack={() => {
          localStorage.removeItem('userAddress');
          localStorage.removeItem('viewUserId');
          setViewUserExist(false);
          setUserIdInput('');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%23ffffff&#39; fill-opacity=&#39;0.02&#39;%3E%3Ccircle cx=&#39;30&#39; cy=&#39;30&#39; r=&#39;1&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full glow-blue relative z-10">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 glow-blue animate-pulse">
            <Circle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 neon-text">BigBang</h1>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
            Connect your wallet to access the decentralized orbit ecosystem
          </p>

          <WalletButton />

          <div className="mt-6 pt-6 border-t border-gray-700">
            <button className="w-full mb-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base glow-green">
              View Registration Page
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4">View User Profile</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
              Enter a user ID to view their public profile and orbit progress
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="Enter User ID"
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base text-gray-100 placeholder-gray-400"
                min="1"
              />
              <button
                onClick={handleViewUserById}
                disabled={
                  !String(userIdInput || '').trim() ||
                  !Number.isFinite(Number(userIdInput)) ||
                  Number(userIdInput) <= 0
                }
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base glow-blue"
              >
                <Search className="w-4 h-4" />
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartSceen;
