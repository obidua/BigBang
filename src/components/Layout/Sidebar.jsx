import React from 'react';
import {
  Home,
  Users,
  TrendingUp,
  Circle,
  Settings,
  LogOut,
  Wallet,
  User
} from 'lucide-react';



const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orbits', label: 'Orbits', icon: Circle },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'income', label: 'Income', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: User },
];

export const Sidebar = ({ activeTab, setActiveTab, onDisconnect, isSidebarOpen, setIsSidebarOpen, userId, isViewMode }) => {
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };


   const handleDisconnect = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userAddress');
        localStorage.removeItem('isRegistered');
      }
      await Promise.resolve(onDisconnect?.()); // in case it's sync or async
    } catch (e) {
      console.error('Disconnect error:', e);
    } finally {
      setIsSidebarOpen(false);
    }
  };



  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-950 via-blue-950 to-purple-950 text-white transform transition-transform duration-300 ease-in-out border-r border-gray-700/50
      lg:relative lg:translate-x-0 lg:z-auto
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        <div className="p-4 sm:p-6 border-b border-gray-700/50 bg-gradient-to-r from-transparent to-blue-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center glow-blue animate-pulse">
                <Circle className="w-3 h-3 sm:w-5 sm:h-5" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent neon-text">BigBang</h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <ul className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${activeTab === item.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg glow-blue'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:glow-blue'
                      }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 sm:p-4 border-t border-gray-700/50">
          {isViewMode && userId != null && (
            <div className="mb-3 px-2.5 py-1 bg-blue-950/50 text-cyan-300 border border-cyan-500/50 rounded-full text-xs font-medium glow-blue text-center">
              View Mode • User #{userId}
            </div>
          )}
          <button
            onClick={handleDisconnect}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white transition-all duration-200 text-sm sm:text-base hover:glow-red"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium">Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  );
};