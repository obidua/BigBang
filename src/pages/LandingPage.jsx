import React, { useState } from 'react';
import { Circle, Search, Rocket, Users, TrendingUp, Shield, Zap, Globe, ChevronRight, Star, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { WalletButton } from '../components/WalletConnection/WalletButton';
import { ViewedUserProfile } from '../components/ViewedUserProfile';
import { useStore } from '../../store/useStore';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const LandingPage = () => {
  const checkUserById = useStore((s) => s.checkUserById);
  const [userIdInput, setUserIdInput] = useState('');
  const [viewUserExist, setViewUserExist] = useState(false);

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
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%23ffffff&#39; fill-opacity=&#39;0.02&#39;%3E%3Ccircle cx=&#39;30&#39; cy=&#39;30&#39; r=&#39;1&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 glow-blue animate-pulse">
            <Circle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 neon-text">
            BigBang
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-4 font-light">
            Launch Your Earnings in the Decentralized Orbit Ecosystem
          </p>
          
          <p className="text-base sm:text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join a revolutionary community-driven platform where users earn through a unique multi-level orbit system. 
            Built on transparent smart contracts with automatic repurchasing cycles.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <div className="glass-card rounded-xl p-6 max-w-md w-full glow-blue">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Connect Your Wallet</h3>
              <p className="text-sm text-gray-400 mb-4">
                Join the BigBang ecosystem and start your orbit journey
              </p>
              <WalletButton />
            </div>

            <div className="glass-card rounded-xl p-6 max-w-md w-full glow-purple">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">View User Profile</h3>
              <p className="text-sm text-gray-400 mb-4">
                Enter a user ID to view their public profile and orbit progress
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  placeholder="Enter User ID"
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm text-gray-100 placeholder-gray-400"
                  min="1"
                />
                <button
                  onClick={handleViewUserById}
                  disabled={
                    !String(userIdInput || '').trim() ||
                    !Number.isFinite(Number(userIdInput)) ||
                    Number(userIdInput) <= 0
                  }
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 glow-purple"
                >
                  <Search className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card rounded-xl p-6 text-center hover:glow-green transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Decentralized Earnings</h3>
              <p className="text-sm text-gray-400">Earn through a transparent multi-level system with automatic distributions</p>
            </div>

            <div className="glass-card rounded-xl p-6 text-center hover:glow-blue transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Smart Contract Security</h3>
              <p className="text-sm text-gray-400">Built on immutable smart contracts ensuring fairness and transparency</p>
            </div>

            <div className="glass-card rounded-xl p-6 text-center hover:glow-purple transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-violet-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Community Growth</h3>
              <p className="text-sm text-gray-400">Build your network and benefit from continuous orbit cycles</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
              How BigBang Works
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Understanding the orbit ecosystem and how you can benefit from this revolutionary earning system
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              <div className="glass-card rounded-xl p-6 glow-blue">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">Join the Orbit</h3>
                    <p className="text-gray-400">
                      Register with just $5 USD equivalent in RAMA tokens. You'll need a sponsor (existing user) to join the ecosystem.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 glow-green">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">Fill Your X-Slots</h3>
                    <p className="text-gray-400">
                      Each orbit has 10 X-slots that get filled as your downline grows. Income from new registrations fills these slots progressively.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 glow-purple">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">Automatic Repurchase</h3>
                    <p className="text-gray-400">
                      When all 10 X-slots are filled, the system automatically repurchases a new orbit for you, creating continuous earning cycles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-8 glow-blue">
              <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center">Orbit Visualization</h3>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      i < 7
                        ? 'bg-green-950/50 border-emerald-400 text-emerald-400 glow-green'
                        : 'bg-gray-800/50 border-gray-600 text-gray-500'
                    }`}
                  >
                    {i < 7 ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Current Progress: 7/10 X-Slots Filled</p>
                <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700">
                  <div className="bg-gradient-to-r from-emerald-400 to-green-600 h-3 rounded-full transition-all duration-500 glow-green" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compensation Plan Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-r from-gray-900/50 to-blue-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">
              Earning Potential
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Transparent multi-level compensation with automatic distribution
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="glass-card rounded-xl p-8 glow-green">
              <h3 className="text-2xl font-bold text-gray-100 mb-6">Income Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-950/30 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <span className="text-emerald-300 font-medium">Direct Sponsor</span>
                  </div>
                  <span className="text-emerald-400 font-bold text-lg">50%</span>
                </div>
                
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-blue-950/30 border border-cyan-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {i + 2}
                      </div>
                      <span className="text-cyan-300 font-medium">Level {i + 2}</span>
                    </div>
                    <span className="text-cyan-400 font-bold">5%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6 glow-blue">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100">Passive Income</h4>
                    <p className="text-sm text-gray-400">Earn from your network's growth</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  Build once, earn continuously as your team expands and orbits complete automatically.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 glow-purple">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100">Instant Payments</h4>
                    <p className="text-sm text-gray-400">Smart contract automation</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  All payments are processed instantly through smart contracts with no delays or manual intervention.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 glow-green">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100">Global Network</h4>
                    <p className="text-sm text-gray-400">Worldwide accessibility</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  Connect with users globally and build an international network with no geographical restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6 glow-blue">
              <h3 className="text-xl font-semibold text-gray-100 mb-3">What is RAMA?</h3>
              <p className="text-gray-400">
                RAMA is the native cryptocurrency used within the BigBang ecosystem. All transactions, registrations, and earnings are processed in RAMA tokens, with values automatically converted from USD using real-time price feeds.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 glow-green">
              <h3 className="text-xl font-semibold text-gray-100 mb-3">How do I join BigBang?</h3>
              <p className="text-gray-400">
                To join, you need: 1) A compatible wallet with RAMA tokens, 2) A sponsor (existing user's address or ID), and 3) $5 USD equivalent in RAMA for registration. Connect your wallet above and follow the registration process.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 glow-purple">
              <h3 className="text-xl font-semibold text-gray-100 mb-3">What happens when my orbit is complete?</h3>
              <p className="text-gray-400">
                When all 10 X-slots in your orbit are filled, the smart contract automatically uses the collected funds to repurchase a new orbit position for you, starting a fresh earning cycle. This process is completely automated.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 glow-blue">
              <h3 className="text-xl font-semibold text-gray-100 mb-3">How do I withdraw my earnings?</h3>
              <p className="text-gray-400">
                Earnings are automatically distributed to your wallet address in real-time as your network grows. There's no manual withdrawal process - payments are instant and processed by the smart contract.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 glow-green">
              <h3 className="text-xl font-semibold text-gray-100 mb-3">Is BigBang safe and transparent?</h3>
              <p className="text-gray-400">
                Yes! BigBang operates on a fully transparent, immutable smart contract. All transactions, earnings, and operations are recorded on the blockchain and can be verified by anyone. No central authority controls your funds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 glow-blue animate-pulse">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Ready to Launch Your Orbit?
          </h2>
          
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users already earning in the BigBang ecosystem. Start your journey with just $5 and watch your network grow.
          </p>

          <div className="glass-card rounded-xl p-8 max-w-md mx-auto glow-blue">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Connect & Start Earning</h3>
            <WalletButton />
            <p className="text-sm text-gray-400 mt-4">
              Secure • Transparent • Decentralized
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Circle className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">BigBang</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2025 BigBang. Built on transparent smart contracts.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Decentralized • Secure • Community-Driven
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;