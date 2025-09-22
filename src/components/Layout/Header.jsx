import React from 'react';
import { Wallet, Bell, User, Menu } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { formatAddress } from '../../../utils/helper';

export const Header = ({ activeTab, address, balance, setIsSidebarOpen }) => {

  const getPageTitle = (tab) => {
    const titleMap = {
      dashboard: 'Dashboard',
      orbits: 'Orbits',
      team: 'Team',
      income: 'Income',
      profile: 'Profile',
    };
    return titleMap[tab] || 'Dashboard';
  };


   const data = useStore((s) => s.data);

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{getPageTitle(activeTab)}</h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 glow-blue">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-100">{balance} RAMA</span>
          </div>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-950/50 to-purple-950/50 border border-blue-500/30 rounded-lg px-2 sm:px-4 py-2 glow-blue">
            <User className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-100">{formatAddress(data?.address)}</span>
          </div>

          <button className="hidden sm:block p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};