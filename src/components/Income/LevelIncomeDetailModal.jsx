import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Clock, User, DollarSign } from 'lucide-react';
import { useStore } from '../../../store/useStore';

export const LevelIncomeDetailModal = ({ level, isOpen, onClose }) => {
  const [levelIncomes, setLevelIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalRAMA, setTotalRAMA] = useState(0);

  const getTeamAtLevel = useStore((s) => s.getTeamAtLevel);
  const data = useStore((s) => s.data);
  const userAddress = data?.address;

  useEffect(() => {
    if (isOpen && level && userAddress) {
      loadLevelIncomes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, level, userAddress]);

  const loadLevelIncomes = async () => {
    setLoading(true);
    try {
      const allIncomes = [];

      // Fetch from multiple orbits (0,1,2) for given user
      for (let orbitId = 0; orbitId < 3; orbitId++) {
        const orbitIncomes = await getTeamAtLevel(userAddress, level, orbitId);
        if (Array.isArray(orbitIncomes)) {
          allIncomes.push(...orbitIncomes);
        }
      }

      // Filter and sort
      const filteredIncomes = allIncomes
        .filter((income) => Number(income.level) === Number(level))
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

      setLevelIncomes(filteredIncomes);

      // Totals
      const usdTotal = filteredIncomes.reduce(
        (sum, income) => sum + (parseFloat(income.usd) || 0),
        0
      );
      const ramaTotal = filteredIncomes.reduce(
        (sum, income) => sum + (parseFloat(income.amount) || 0),
        0
      );

      setTotalUSD(usdTotal);
      setTotalRAMA(ramaTotal);
    } catch (error) {
      console.error('Failed to load level incomes:', error);
      setLevelIncomes([]);
      setTotalUSD(0);
      setTotalRAMA(0);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - Number(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(Number(timestamp)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden glow-blue">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center glow-blue">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">Level {level} Income Details</h2>
                <p className="text-sm text-gray-400">{levelIncomes.length} transactions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Totals */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-950/50 border border-emerald-500/50 rounded-lg glow-green">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-300">
                ${totalUSD.toFixed(2)} USD
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-950/50 border border-cyan-500/50 rounded-lg glow-blue">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-cyan-300">
                {totalRAMA.toFixed(2)} RAMA
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center gap-4 p-4 border border-gray-700 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : levelIncomes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No income records found for Level {level}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {levelIncomes.map((income, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg hover:bg-gray-800/30 transition-colors hover:border-gray-600"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 glow-green">
                    L{income.level}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-100">
                        Income from Level {income.level}
                      </p>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-100">
                          ${parseFloat(income.incomeEarned || 0).toFixed(2)/1e6} USD
                        </div>
                        <div className="text-xs text-gray-400">
                          {parseFloat(income.incomeEarned || 0).toFixed(2)/1e6} RAMA
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          From: {income.donorId || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(income.timestamp)}
                        </div>
                      </div>
                      <span className="text-gray-500">{formatTime(income.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-700/50 bg-gray-900/50">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>
              Level {level} pays {level === 1 ? '50%' : '5%'} commission
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors glow-blue"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
