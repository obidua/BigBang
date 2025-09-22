import React, { useState } from 'react';
import { Circle, Search, Rocket, Users, TrendingUp, Shield, Zap, Globe, ChevronRight, Star, CheckCircle, Clock, History, Coins, Network, Lock, ArrowRight, DollarSign, Banknote, CreditCard, Bitcoin, Smartphone, Target, Award, Infinity, CloudLightning as Lightning, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Swal from 'sweetalert2';
import { WalletButton } from '../components/WalletConnection/WalletButton';
import { ViewedUserProfile } from '../components/ViewedUserProfile';
import { useStore } from '../../store/useStore';
import LandingNavbar from '../components/Landing/LandingNavbar';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const LandingPage = () => {
  const checkUserById = useStore((s) => s.checkUserById);
  const [userIdInput, setUserIdInput] = useState('');
  const [viewUserExist, setViewUserExist] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
      <LandingNavbar />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%23ffffff&#39; fill-opacity=&#39;0.02&#39;%3E%3Ccircle cx=&#39;30&#39; cy=&#39;30&#39; r=&#39;1&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20 pt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 glow-blue animate-pulse shadow-2xl">
            <Circle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 neon-text leading-tight">
            BigBang
          </h1>
          
          <p className="text-2xl sm:text-3xl lg:text-4xl text-gray-200 mb-6 font-light leading-relaxed">
            Where Financial Evolution Meets <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-semibold">Infinite Possibilities</span>
          </p>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Step into the future of decentralized finance. BigBang isn't just a platform—it's your gateway to financial freedom, 
            built on the revolutionary Ramestta blockchain where every transaction creates ripples of prosperity across the universe.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <div className="glass-card rounded-2xl p-8 max-w-md w-full glow-blue hover:glow-purple transition-all duration-500 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-blue">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-4">Launch Your Journey</h3>
              <p className="text-sm text-gray-300 mb-6">
                Connect your wallet and join thousands of pioneers already earning in the BigBang ecosystem
              </p>
              <WalletButton />
            </div>

            <div className="glass-card rounded-2xl p-8 max-w-md w-full glow-purple hover:glow-green transition-all duration-500 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-purple">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-4">Explore Success Stories</h3>
              <p className="text-sm text-gray-300 mb-6">
                Enter any user ID to witness real earnings and orbit completions in our transparent ecosystem
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  placeholder="Enter User ID"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm text-gray-100 placeholder-gray-400"
                  min="1"
                />
                <button
                  onClick={handleViewUserById}
                  disabled={
                    !String(userIdInput || '').trim() ||
                    !Number.isFinite(Number(userIdInput)) ||
                    Number(userIdInput) <= 0
                  }
                  className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 glow-purple"
                >
                  <Search className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Key Promises */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="glass-card rounded-xl p-6 text-center hover:glow-green transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Infinity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Infinite Earning Cycles</h3>
              <p className="text-sm text-gray-400">Automatic orbit repurchases create endless earning opportunities</p>
            </div>

            <div className="glass-card rounded-xl p-6 text-center hover:glow-blue transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightning className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Instant Rewards</h3>
              <p className="text-sm text-gray-400">Smart contract automation ensures immediate payment distribution</p>
            </div>

            <div className="glass-card rounded-xl p-6 text-center hover:glow-purple transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-violet-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Bulletproof Security</h3>
              <p className="text-sm text-gray-400">Immutable smart contracts on Ramestta blockchain guarantee safety</p>
            </div>

            <div className="glass-card rounded-xl p-6 text-center hover:glow-green transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Global Community</h3>
              <p className="text-sm text-gray-400">Join a worldwide network of financial pioneers and innovators</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Evolution of Value Section */}
      <section id="evolution" className="relative z-10 py-20 px-4 bg-gradient-to-r from-gray-900/50 to-blue-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-green">
              <History className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-6">
              The Evolution of Value
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              From ancient barter systems to the digital revolution, humanity has always sought better ways to exchange value. 
              Today, we stand at the threshold of the greatest financial transformation in history.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              <div className="glass-card rounded-xl p-6 glow-blue transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-3">The Barter Era (10,000 BCE)</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Humans traded goods directly—wheat for tools, livestock for shelter. But this system had limits: 
                      finding someone who wanted what you had and had what you wanted was nearly impossible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 glow-green transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-3">The Gold Standard (700 BCE)</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Precious metals became the universal store of value. Gold and silver coins enabled global trade, 
                      but they were heavy, difficult to transport, and vulnerable to theft.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 glow-purple transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-3">The Banking Revolution (1600s)</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Paper money and banks promised convenience, but introduced new problems: inflation, centralized control, 
                      and the risk of institutional failure. Your wealth was no longer truly yours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 glow-blue transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-3">The Digital Age (1990s)</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Credit cards and digital payments made transactions faster, but increased surveillance, fees, 
                      and dependence on financial intermediaries who could freeze your assets at will.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-8 glow-green">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-bitcoin-orange to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 glow-green animate-pulse">
                  <Bitcoin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-100 mb-4">The Cryptocurrency Revolution (2009)</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Bitcoin introduced the world to decentralized money—no banks, no governments, no intermediaries. 
                  For the first time in history, individuals could truly own and control their wealth.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-950/30 border border-emerald-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-300 text-sm">True ownership of your assets</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-950/30 border border-emerald-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-300 text-sm">Borderless, instant transactions</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-950/30 border border-emerald-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-300 text-sm">Transparent, immutable records</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-950/30 border border-emerald-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-300 text-sm">No central authority control</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto glow-purple">
              <h3 className="text-2xl font-bold text-gray-100 mb-4">The Next Evolution is Here</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                BigBang represents the next leap forward—combining the security of blockchain with innovative earning mechanisms 
                that create value for everyone in the network. We're not just using cryptocurrency; we're evolving it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Ramestta Blockchain Section */}
      <section id="ramestta" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-purple">
              <Network className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Why Ramestta Blockchain?
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Not all blockchains are created equal. Ramestta isn't just another network—it's a purpose-built ecosystem 
              designed for the future of decentralized applications and community-driven finance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="glass-card rounded-xl p-8 text-center hover:glow-blue transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-blue">
                <Lightning className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-4">Lightning-Fast Transactions</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Experience near-instant transaction confirmations with Ramestta's optimized consensus mechanism. 
                No more waiting minutes or hours for your earnings to arrive.
              </p>
              <div className="text-cyan-400 font-semibold">~2 second finality</div>
            </div>

            <div className="glass-card rounded-xl p-8 text-center hover:glow-green transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-green">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-4">Ultra-Low Fees</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Keep more of what you earn with transaction fees that are a fraction of traditional networks. 
                Ramestta's efficiency means your profits stay in your pocket.
              </p>
              <div className="text-emerald-400 font-semibold">$0.001 average fee</div>
            </div>

            <div className="glass-card rounded-xl p-8 text-center hover:glow-purple transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-purple">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-4">Enterprise Security</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Built with institutional-grade security protocols and battle-tested cryptography. 
                Your assets are protected by the same technology trusted by major financial institutions.
              </p>
              <div className="text-purple-400 font-semibold">99.99% uptime</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-100 mb-6">Built for the Community</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100 mb-2">Eco-Friendly Consensus</h4>
                    <p className="text-gray-300">
                      Ramestta uses an energy-efficient Proof-of-Stake mechanism, consuming 99.9% less energy than Bitcoin 
                      while maintaining superior security and decentralization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100 mb-2">Developer-Friendly</h4>
                    <p className="text-gray-300">
                      Full Ethereum Virtual Machine (EVM) compatibility means proven smart contract security 
                      with the innovation and efficiency of next-generation blockchain technology.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100 mb-2">Scalable Infrastructure</h4>
                    <p className="text-gray-300">
                      Designed to handle millions of transactions per day without congestion, 
                      ensuring BigBang can grow to serve a global community without performance degradation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-8 glow-blue">
              <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">RAMA Token Advantages</h3>
              
              <div className="space-y-4">
                <div className="bg-blue-950/30 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold text-cyan-300">Stable Value Mechanism</span>
                  </div>
                  <p className="text-sm text-blue-200">
                    Built-in price feeds ensure consistent USD-equivalent values for all BigBang transactions, 
                    protecting you from extreme volatility.
                  </p>
                </div>

                <div className="bg-green-950/30 border border-emerald-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-300">Instant Liquidity</span>
                  </div>
                  <p className="text-sm text-green-200">
                    RAMA tokens can be easily exchanged on multiple decentralized exchanges, 
                    giving you immediate access to your earnings whenever you need them.
                  </p>
                </div>

                <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-purple-300">Utility Beyond BigBang</span>
                  </div>
                  <p className="text-sm text-purple-200">
                    RAMA is the native currency of the entire Ramestta ecosystem, 
                    with growing utility across DeFi protocols, NFT marketplaces, and gaming platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How BigBang Works Section - Enhanced */}
      <section id="how-it-works" className="relative z-10 py-20 px-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-blue">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Your Journey to Financial Freedom
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              BigBang transforms the traditional concept of earning into an automated, fair, and infinitely scalable system. 
              Here's how you can start building generational wealth with just $5.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              <div className="glass-card rounded-xl p-8 glow-blue transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 glow-blue">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-100 mb-4">Enter the BigBang Universe</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Join with just $5 USD equivalent in RAMA tokens—less than the cost of a coffee. 
                      You'll need a sponsor (any existing BigBang member) to welcome you into our community.
                    </p>
                    <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-lg p-4">
                      <p className="text-cyan-300 text-sm font-semibold">💡 Pro Tip: Your sponsor becomes your mentor and benefits from your success!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-8 glow-green transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 glow-green">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-100 mb-4">Watch Your Orbit Fill</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Your orbit contains 10 X-slots that fill automatically as your network grows. 
                      Each new member joining through your lineage contributes to filling these positions.
                    </p>
                    <div className="bg-green-950/30 border border-emerald-500/30 rounded-lg p-4">
                      <p className="text-emerald-300 text-sm font-semibold">🚀 The Magic: You earn from 9 levels deep in your network!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-8 glow-purple transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0 glow-purple">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-100 mb-4">Automatic Wealth Multiplication</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      When your orbit completes (all 10 X-slots filled), the smart contract automatically 
                      repurchases a new position for you, creating an endless cycle of earning opportunities.
                    </p>
                    <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-purple-300 text-sm font-semibold">♾️ Infinite Potential: Each completion triggers your upline to earn again!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-8 glow-blue">
              <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">Live Orbit Demonstration</h3>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      i < 8
                        ? 'bg-green-950/50 border-emerald-400 text-emerald-400 glow-green'
                        : i === 8
                        ? 'bg-blue-950/50 border-cyan-400 text-cyan-400 animate-pulse glow-blue'
                        : 'bg-gray-800/50 border-gray-600 text-gray-500'
                    }`}
                  >
                    {i < 8 ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : i === 8 ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400 mb-2">Current Progress: 8/10 X-Slots Filled</p>
                <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700">
                  <div className="bg-gradient-to-r from-emerald-400 to-green-600 h-3 rounded-full transition-all duration-500 glow-green" style={{ width: '80%' }} />
                </div>
              </div>
              <div className="bg-blue-950/30 border border-cyan-500/30 rounded-lg p-4">
                <p className="text-cyan-300 text-sm text-center">
                  <strong>Next Action:</strong> When slots 9 & 10 fill, this orbit completes and automatically 
                  repurchases a new position, starting the cycle again!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Earning Potential Section */}
      <section id="earning" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-green">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">
              Your Earning Potential is Unlimited
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              BigBang's revolutionary compensation plan ensures that every participant benefits from network growth. 
              The more your community thrives, the more everyone earns—creating a true win-win ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="glass-card rounded-xl p-8 glow-green">
              <h3 className="text-2xl font-bold text-gray-100 mb-6">Smart Income Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-950/30 border border-emerald-500/30 rounded-lg glow-green">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <span className="text-emerald-300 font-medium">Direct Sponsor</span>
                      <p className="text-emerald-200 text-xs">Your mentor who welcomed you</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold text-xl">50%</span>
                </div>
                
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-blue-950/30 border border-cyan-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {i + 2}
                      </div>
                      <div>
                        <span className="text-cyan-300 font-medium">Level {i + 2}</span>
                        <p className="text-cyan-200 text-xs">Extended network member</p>
                      </div>
                    </div>
                    <span className="text-cyan-400 font-bold">5%</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-purple-950/30 border border-purple-500/30 rounded-lg">
                <p className="text-purple-300 text-sm text-center">
                  <strong>Total Distribution:</strong> 90% goes to the community, 10% supports platform development
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6 glow-blue transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Infinity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100">Passive Income Streams</h4>
                    <p className="text-sm text-gray-400">Build once, earn continuously</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Every time someone in your 9-level network joins or completes an orbit, you earn. 
                  Your income grows exponentially as your community expands, creating true passive wealth.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 glow-purple transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <Lightning className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100">Instant Smart Contract Payments</h4>
                    <p className="text-sm text-gray-400">No delays, no intermediaries</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Earnings are distributed instantly through immutable smart contracts. 
                  No waiting for payment processing, no risk of payment delays—your money arrives in seconds.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 glow-green transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100">Global Network Effect</h4>
                    <p className="text-sm text-gray-400">Worldwide accessibility</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Connect with entrepreneurs and visionaries worldwide. Geographic boundaries don't exist in BigBang—
                  your network can span continents, multiplying your earning potential.
                </p>
              </div>
            </div>
          </div>

          {/* Success Scenarios */}
          <div className="glass-card rounded-xl p-8 glow-blue mb-16">
            <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">Real Success Scenarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-950/30 border border-cyan-500/30 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">$50</div>
                <div className="text-sm text-cyan-300 mb-3">Conservative Growth</div>
                <p className="text-xs text-blue-200">
                  With just 2 direct referrals who each bring 2 more, you could earn $50+ 
                  from your first orbit completions.
                </p>
              </div>
              <div className="bg-green-950/30 border border-emerald-500/30 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">$500</div>
                <div className="text-sm text-emerald-300 mb-3">Active Builder</div>
                <p className="text-xs text-green-200">
                  Active community builders with 5-10 direct referrals often see 
                  $500+ monthly as their networks mature.
                </p>
              </div>
              <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">$5,000+</div>
                <div className="text-sm text-purple-300 mb-3">Network Leader</div>
                <p className="text-xs text-purple-200">
                  Top performers with large, active networks earn $5,000+ monthly 
                  from continuous orbit completions across all levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section id="faq" className="relative z-10 py-20 px-4 bg-gradient-to-r from-gray-900/50 to-blue-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Everything You Need to Know
            </h2>
            <p className="text-xl text-gray-300">
              Clear answers to help you make an informed decision about joining the BigBang revolution.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What is RAMA and why is it used in BigBang?",
                answer: "RAMA is the native cryptocurrency of the Ramestta blockchain, designed for ultra-fast transactions and minimal fees. BigBang uses RAMA because it offers instant payments (2-second confirmations), extremely low transaction costs ($0.001), and enterprise-grade security. Unlike volatile cryptocurrencies, RAMA maintains stability through advanced tokenomics, making it perfect for consistent earnings and reliable value storage."
              },
              {
                question: "How do I join BigBang and what do I need?",
                answer: "Joining BigBang is simple! You need: (1) A Web3 wallet like MetaMask, (2) Some RAMA tokens for the joining fee, and (3) A sponsor's address or ID. The current joining fee is dynamically calculated but typically around $25 worth of RAMA. Once you connect your wallet and complete registration, you'll immediately start your first orbit and begin earning from your network's activity."
              },
              {
                question: "How much can I realistically earn with BigBang?",
                answer: "Your earnings depend on your network activity and growth. Conservative participants often earn $50-200 monthly through passive income. Active builders who share BigBang and help others join typically earn $500-2000 monthly. Network leaders with large, active teams can earn $5000+ monthly. Remember, BigBang offers infinite earning cycles - every time you complete 10 X-slots, you automatically repurchase and start earning again."
              },
              {
                question: "What are X-slots and how do they work?",
                answer: "X-slots represent positions in your earning orbit. Each orbit has 10 X-slots that fill as people join your network or their networks grow. When someone in your 9-level network joins or repurchases, you receive income and fill an X-slot. Once all 10 X-slots are filled, you automatically repurchase (start a new orbit) and continue earning. This creates infinite earning cycles with no manual intervention required."
              },
              {
                question: "Is BigBang safe and legitimate?",
                answer: "Absolutely! BigBang operates on audited smart contracts on the Ramestta blockchain, ensuring complete transparency and security. All transactions are publicly verifiable, funds are handled automatically by code (not humans), and the system has built-in safeguards. The Ramestta blockchain offers enterprise-grade security with 99.99% uptime. Your earnings are processed instantly and automatically - no waiting for manual payments."
              },
              {
                question: "Can I withdraw my earnings anytime?",
                answer: "Yes! All earnings in BigBang are paid instantly and automatically to your wallet as they occur. There are no withdrawal limits, waiting periods, or manual approval processes. When you earn from your network's activity, the RAMA tokens are immediately transferred to your wallet. You have complete control over your funds at all times."
              },
              {
                question: "What makes BigBang different from other opportunities?",
                answer: "BigBang combines the best of DeFi innovation with proven network marketing principles: (1) Fully decentralized - no company can shut it down, (2) Transparent smart contracts - every transaction is verifiable, (3) Instant payments - no waiting for commissions, (4) Infinite earning cycles - automatic repurchasing creates unlimited potential, (5) Built on Ramestta - superior blockchain technology, and (6) Global accessibility - anyone with internet can participate."
              },
              {
                question: "Do I need technical knowledge to participate?",
                answer: "Not at all! BigBang is designed for everyone, regardless of technical background. Our user-friendly interface guides you through every step. You just need to: connect your wallet (we'll help you set one up), get some RAMA tokens (available on major exchanges), and find a sponsor (or use our community groups). The smart contracts handle everything else automatically - earning, payments, and repurchasing all happen without any action from you."
              }
            ].map((faq, index) => {
              const isActive = activeFAQ === index;
              return (
                <div key={index} className="glass-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-blue overflow-hidden">
                  <button
                    onClick={() => setActiveFAQ(isActive ? null : index)}
                    className="w-full p-6 text-left hover:bg-gray-800/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-inset"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {isActive ? (
                          <ChevronUp className="w-5 h-5 text-cyan-400 transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-300 ease-in-out ${
                    isActive 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  } overflow-hidden`}>
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-700/50 pt-4">
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="glass-card rounded-xl p-6 bg-gradient-to-r from-blue-950/30 to-purple-950/30 border border-blue-500/30 glow-blue">
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">Still Have Questions?</h3>
              <p className="text-gray-300 mb-4">
                Join our community and get answers from experienced BigBang members
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-medium glow-blue">
                  Join Telegram Community
                </button>
                <button className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-300 font-medium">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 glow-blue animate-pulse shadow-2xl">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Your Financial Revolution Starts Now
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of visionaries who've already discovered the power of decentralized earning. 
            With just $5, you can start building a legacy that generates income for years to come.
          </p>

          <div className="glass-card rounded-2xl p-8 max-w-md mx-auto glow-blue mb-8">
            <h3 className="text-2xl font-bold text-gray-100 mb-6">Launch Your BigBang Journey</h3>
            <WalletButton />
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Transparent</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-purple-400" />
                <span>Decentralized</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass-card rounded-xl p-6 text-center hover:glow-green transition-all duration-300">
              <div className="text-2xl font-bold text-emerald-400 mb-2">24/7</div>
              <div className="text-sm text-emerald-300">Automated Earnings</div>
            </div>
            <div className="glass-card rounded-xl p-6 text-center hover:glow-blue transition-all duration-300">
              <div className="text-2xl font-bold text-cyan-400 mb-2">∞</div>
              <div className="text-sm text-cyan-300">Unlimited Potential</div>
            </div>
            <div className="glass-card rounded-xl p-6 text-center hover:glow-purple transition-all duration-300">
              <div className="text-2xl font-bold text-purple-400 mb-2">$5</div>
              <div className="text-sm text-purple-300">Minimum Investment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center glow-blue">
                <Circle className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">BigBang</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm mb-1">
                © 2025 BigBang. Powered by Ramestta Blockchain.
              </p>
              <p className="text-gray-500 text-xs">
                Decentralized • Transparent • Community-Driven • Infinite Potential
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;