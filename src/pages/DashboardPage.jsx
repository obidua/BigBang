import React, { useEffect, useState } from 'react';
import { Circle, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { StatsCards } from './components/Dashboard/StatsCards';
import { OrbitProgress } from './components/Dashboard/OrbitProgress';
import { RecentActivity } from './components/Dashboard/RecentActivity';
import { OrbitsList } from './components/Orbits/OrbitsList';
import { TeamTree } from './components/Team/TeamTree';
import { IncomeChart } from './components/Income/IncomeChart';
import { WalletButton } from './components/WalletConnection/WalletButton';
import { ViewedUserProfile } from './components/ViewedUserProfile';
import Register from './components/Registration/Register';
import SmarContract from './components/SmarContract';
import { Copy, ExternalLink, User, MapPin, Link, Code } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { copyToClipboard } from '../utils/helper';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // View user functionality (moved from StartScreen)
    const [userIdInput, setUserIdInput] = useState('');
    const [viewUserExist, setViewUserExist] = useState(
        typeof window !== 'undefined' ? !!localStorage.getItem('userAddress') : false
    );

    const { address, isConnected } = useAppKitAccount();
    const { disconnect } = useDisconnect();

    const getUserDetails = useStore((s) => s.getUserDetails);
    const checkUserById = useStore((s) => s.checkUserById);
    const data = useStore((s) => s.data);

    const [loading, setLoading] = useState(false);

    const [isRegistered, setIsRegistered] = useState(data?.isRegistered|| false);
    
    // Handle viewing user by ID
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

            const res = await checkUserById(numericId);
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
    
    // Fetch user details once we have a connected address
    useEffect(() => {
        
        let cancelled = false;

        (async () => {
            if (!isConnected || !address) return;

            try {
                setLoading(true);
                const res = await getUserDetails(address);
                setIsRegistered(res?.isRegistered)
                if (!cancelled && res?.isRegistered) {
                    localStorage.setItem('userAddress', address);
                    localStorage.setItem('isRegistered', 'true');
                } else if (!cancelled) {
                    localStorage.setItem('userAddress', address);
                    localStorage.removeItem('isRegistered');
                }
            } catch (e) {
                if (!cancelled) console.error('getUserDetails failed:', e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [address, isConnected, getUserDetails]);

    // ----- Content factory (use store `data`)
    const renderContent = () => {
        if (!data) return null;

        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-8">
                        <StatsCards user={data} contractState={undefined /* inject if you have */} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            <OrbitProgress currentX={data?.currentOrbitX ?? 0} />
                            <RecentActivity getIncomeHistory={async () => []} />
                        </div>
                    </div>
                );

            case 'orbits':
                return <OrbitsList getOrbits={async () => []} />;

            case 'team':
                return <TeamTree getTeamAtLevel={async () => []} />;

            case 'income':
                return (
                    <IncomeChart
                        getLevelIncomes={async () => []}
                        getIncomeHistory={async () => []}
                    />
                );

            case 'profile':
                return (
                    <div className="space-y-4 sm:space-y-6">
                        {/* User Information Card */}
                        <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow glow-blue">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center glow-blue">
                                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
                                                onClick={() => copyToClipboard(data?.address || '')}
                                                className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Sponsor Address
                                        </label>
                                        <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                                            <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">{data?.sponsor}</code>
                                            <button
                                                onClick={() => copyToClipboard(data?.sponsor || '')}
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
                                                <span className="font-medium text-blue-200">{data?.registrationTime}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-300">Total Earnings:</span>
                                                <span className="font-medium text-blue-200">${(data?.totalEarningsUSD ?? 0).toFixed?.(2) ?? data?.totalEarningsUSD}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-300">Repurchases:</span>
                                                <span className="font-medium text-blue-200">{data?.repurchaseCount ?? 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-300">Current Orbit:</span>
                                                <span className="font-medium text-blue-200">{data?.currentOrbitX ?? 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-300">Orbits:</span>
                                                <span className="font-medium text-blue-200">{data?.orbitCount ?? 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Smart Contract Addresses (placeholder) */}
                        <SmarContract/>
                    </div>
                );

            default:
                return null;
        }
    };

    // ----- Full-screen loader
    const FullscreenLoader = () => (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
            <div className="animate-pulse text-gray-200">Loading…</div>
        </div>
    );

    // Handle viewing user profile (from StartScreen functionality)
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

    // ====== Routing Logic ======
    // 1) Not connected → Start screen
    if (!isConnected || !address) {
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
    }

    // 2) Connected but still fetching → Loader
    if (loading || !data) {
        return <FullscreenLoader />;
    }

    // 3) Connected & fetched, but not registered → Register
    if (!isRegistered && address) {
        return (
            <main className="flex-1 bg-gradient-to-b from-transparent to-slate-950/20">
                <Register />
            </main>
        );
    }

    // 4) Connected, fetched, registered → App
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
                onDisconnect={() => {
                    localStorage.removeItem('userAddress');
                    localStorage.removeItem('isRegistered');
                    disconnect();
                }}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Header
                    activeTab={activeTab}
                    address={data?.address}
                    balance={data?.balance}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-transparent to-slate-950/20">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
