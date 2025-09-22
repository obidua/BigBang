import React, { useEffect, useMemo, useState } from 'react';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import { useStore } from '../../../store/useStore';

export const TeamTree = () => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTeamAtLevel = useStore((s) => s.getTeamAtLevel);
  const data = useStore((s) => s.data);

  useEffect(() => {
    let alive = true;

    const loadTeam = async () => {
      if (!data?.address || !getTeamAtLevel) {
        setTeamMembers([]);
        return;
      }
      setLoading(true);
      try {
        const members = await getTeamAtLevel(data.address, selectedLevel);
        if (!alive) return;
        // Normalize array items to avoid undefined access
        const safe = Array.isArray(members) ? members : [];
        setTeamMembers(safe);
      } catch (err) {
        console.error('Failed to load team:', err);
        if (alive) setTeamMembers([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadTeam();
    return () => {
      alive = false;
    };
  }, [selectedLevel, data?.address, getTeamAtLevel]);

  const formatAddress = (addr = '') =>
    addr && addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr || '—';

  const formatDate = (ts) => {
    const n = Number(ts);
    if (!Number.isFinite(n) || n <= 0) return '—';
    // assuming seconds
    return new Date(n * 1000).toLocaleDateString();
  };

  // Assume incomeEarned is in micro USD (1e6). If it’s RAMA wei, adapt the divisor.
  const totals = useMemo(() => {
    const totalUSD = teamMembers.reduce((sum, m) => {
      const v = Number(m?.incomeEarned ?? 0);
      return sum + (Number.isFinite(v) ? v : 0);
    }, 0);
    // Display both in USD for now (your store only has one value). If you also have RAMA,
    // replace the divisor/field as needed.
    const usd = (totalUSD / 1e6).toFixed(2);
    const rama = (totalUSD / 1e6).toFixed(2);
    return { usd, rama };
  }, [teamMembers]);

  return (
    <div className="glass-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
      <div className="p-4 sm:p-6 border-b border-gray-700/50">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-3 sm:mb-4">
          Team Structure
        </h2>

        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedLevel === level
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white glow-blue'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
              }`}
            >
              Level {level}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">
              {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">
              ${totals.usd} USD • {totals.rama} RAMA
            </span>
          </div>
        </div>

        {/* Loading / Empty / List */}
        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-700 rounded-lg"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-3 sm:h-4 bg-gray-700 rounded w-1/3 mb-1.5 sm:mb-2" />
                  <div className="h-2.5 sm:h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-400">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p>No team members at this level yet</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {teamMembers.map((member, idx) => {
              const income = Number(member?.incomeEarned ?? 0);
              const incomeUSD = Number.isFinite(income) ? (income / 1e6).toFixed(2) : '0.00';
              const incomeRAMA = incomeUSD; // adjust if you have separate RAMA field

              return (
                <div
                  key={member?.wallet ?? idx}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-700 rounded-lg hover:bg-gray-800/30 transition-colors hover:border-gray-600"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium text-gray-100">
                      {formatAddress(member?.wallet)}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {formatDate(Number(member?.registrationTime))}
                      </div>

                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />${incomeUSD} USD
                      </div>

                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {incomeRAMA} RAMA
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
