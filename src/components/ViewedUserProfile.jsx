import React, { useEffect, useState } from 'react';
import { Menu, Circle, TrendingUp, Users, Home, LogOut, User as UserIcon, MapPin, Link, Code, Copy, ExternalLink } from 'lucide-react';
import { StatsCards } from './Dashboard/StatsCards';
import { OrbitProgress } from './Dashboard/OrbitProgress';
import { RecentActivity } from './Dashboard/RecentActivity';
import { OrbitsList } from './Orbits/OrbitsList';
import { TeamTree } from './Team/TeamTree';
import { IncomeChart } from './Income/IncomeChart';
import { Sidebar } from './Layout/Sidebar';
import { useStore } from '../../store/useStore';
import { copyToClipboard, formatAddress } from '../../utils/helper';
import SmarContract from './SmarContract';



export const ViewedUserProfile = ({ userId, onBack }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);






  // Mock functions for the viewed user
  const mockGetOrbits = async () => {
    const orbits = [];

    for (let i = 0; i < mockUser.orbitCount; i++) {
      const completedX = i < mockUser.orbitCount - 1 ? 10 : mockUser.currentOrbitX;

      orbits.push({
        orbitId: i,
        completedX,
        xSlots: Array(completedX).fill(null).map((_, j) => ({
          totalUSD: '5000000',
          parts: [{
            usdValue: '5000000',
            ramaAmount: '2450000000000000000',
            from: `0x${(userId + j).toString(16).padStart(40, '0')}`,
            donorId: `user${userId + j}`,
            level: Math.floor(Math.random() * 9) + 1
          }]
        }))
      });
    }

    return orbits;
  };

  const mockGetTeamAtLevel = async (level) => {
    return Array(Math.floor(Math.random() * 15) + 3).fill(null).map((_, i) => ({
      wallet: `0x${Math.random().toString(16).substr(2, 40)}`,
      incomeEarned: (Math.random() * 30).toFixed(2),
      incomeEarnedRAMA: (Math.random() * 15).toFixed(2),
      registrationTime: Date.now() - Math.random() * 86400000 * 20,
      sponsor: mockUser.address
    }));
  };

  const mockGetIncomeHistory = async (orbitId) => {
    return Array(Math.floor(Math.random() * 15) + 8).fill(null).map((_, i) => ({
      coin: 'RAMA',
      amount: (Math.random() * 4).toString(),
      usd: (Math.random() * 8).toString(),
      timestamp: Date.now() - Math.random() * 86400000 * 5,
      donorId: `user${Math.floor(Math.random() * 500)}`,
      level: Math.floor(Math.random() * 9) + 1
    }));
  };

  const mockGetLevelIncomes = async () => {
    return Array(9).fill(null).map((_, i) => ({
      level: i + 1,
      amount: (Math.random() * 20).toFixed(2),
      ramaAmount: (Math.random() * 10).toFixed(2)
    }));
  };

 



  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orbits', label: 'Orbits', icon: Circle },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <StatsCards  />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <OrbitProgress />
              <RecentActivity getIncomeHistory={mockGetIncomeHistory} />
            </div>
          </div>
        );

      case 'orbits':
        return <OrbitsList getOrbits={mockGetOrbits} />;

      case 'team':
        return <TeamTree getTeamAtLevel={mockGetTeamAtLevel} />;

      case 'income':
        return <IncomeChart getLevelIncomes={mockGetLevelIncomes} getIncomeHistory={mockGetIncomeHistory} />;

      case 'profile':
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* User Information Card */}
            <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow glow-blue">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center glow-blue">
                  <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-100">User Profile</h2>
                  <p className="text-sm sm:text-base text-gray-400">ID: #{data?.userId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Wallet Address
                    </label>
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">{data?.address}</code>
                      <button
                        onClick={() => copyToClipboard(data?.address)}
                        className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <UserIcon className="w-4 h-4 inline mr-2" />
                      Sponsor Address
                    </label>
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">{data?.sponsor}</code>
                      <button
                        onClick={() => copyToClipboard(data?.sponsor)}
                        className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Link className="w-4 h-4 inline mr-2" />
                      Referral Link
                    </label>
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">
                        https://bigbang.app/ref={data?.userId}
                      </code>
                      <button
                        onClick={() => copyToClipboard(`https://bigbang.app/ref=${data?.userId}`)}
                        className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3 sm:p-4 hover:bg-blue-950/40 transition-colors glow-blue">
                    <h3 className="font-medium text-cyan-300 mb-3">Account Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-300">Registration Date:</span>
                        <span className="font-medium text-blue-200">
                          {data?.registrationTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Total Earnings:</span>
                        <span className="font-medium text-blue-200">${data?.totalEarningsUSD} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Total Earnings (RAMA):</span>
                        <span className="font-medium text-blue-200">{data?.totalEarningsUSD} RAMA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Repurchases:</span>
                        <span className="font-medium text-blue-200">{data.repurchaseCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Current Orbit:</span>
                        <span className="font-medium text-blue-200">{data.currentOrbitX}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Contract Addresses */}
            <SmarContract/>
          </div>
        );

      default:
        return null;
    }
  };








  const data = useStore((s) => s.data);
  const getUserDetails = useStore((s) => s.getUserDetails);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedAddress = localStorage.getItem("userAddress");
    if (storedAddress) {
      setLoading(true);
      getUserDetails(storedAddress)
        .catch((err) => {
          console.error("Failed to fetch details:", err);
          setError("Failed to fetch user details");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [getUserDetails]);






  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDisconnect={onBack}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userId={userId}
        isViewMode={true}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 glow-blue">
                <span className="text-xs sm:text-sm font-medium text-gray-100">{data?.balance} RAMA</span>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-950/50 to-purple-950/50 border border-blue-500/30 rounded-lg px-2 sm:px-4 py-2 glow-blue">
                <span className="text-xs sm:text-sm font-medium text-gray-100">{formatAddress(data?.address)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-transparent to-slate-950/20">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};