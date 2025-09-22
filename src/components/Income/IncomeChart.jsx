import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { LevelIncomeDetailModal } from './LevelIncomeDetailModal';
import { useStore } from '../../../store/useStore';

export const IncomeChart = () => {
  const [levelIncomes, setLevelIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // store hooks
  const data = useStore((s) => s.data);
  const getAllLevelIncome = useStore((s) => s.getAllLevelIncome);
  const address = data?.address;

  // Fetch level incomes on mount or address change
  useEffect(() => {
    let mounted = true;
    const loadIncomes = async () => {
      if (!getAllLevelIncome || !address) return;
      setLoading(true);
      try {
        const incomes = await getAllLevelIncome(address);

        // Ensure it’s an array of length 9 with fallback 0 for missing levels
        const rows = [];
        let stopFilling = false;

        for (let i = 1; i <= 9; i++) {
          const income = Array.isArray(incomes)
            ? incomes.find((x) => Number(x.Level) === i || Number(x.level) === i)
            : null;

          if (!income && !stopFilling) {
            // Encountered empty: fill remaining levels with 0
            stopFilling = true;
          }

          rows.push({
            level: i,
            amount: !stopFilling && income ? Number(income.TotalEarned || income.amount || 0) : 0,
            ramaAmount: income?.ramaAmount ? Number(income.ramaAmount) : 0,
          });
        }

        if (mounted) setLevelIncomes(rows);
      } catch (error) {
        console.error('Failed to load incomes:', error);
        if (mounted) setLevelIncomes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadIncomes();
    return () => {
      mounted = false;
    };
  }, [address, getAllLevelIncome]);

  // Compute totals and maximum bar value
  const { totalUSD, totalRAMA, maxAmount } = useMemo(() => {
    let usd = 0;
    let rama = 0;
    let max = 0;

    for (const row of levelIncomes) {
      const amt = Number(row.amount || 0);
      const ramaAmt = Number(row.ramaAmount || 0);
      if (Number.isFinite(amt)) usd += amt;
      if (Number.isFinite(ramaAmt)) rama += ramaAmt;
      max = Math.max(max, amt);
    }
    return { totalUSD: usd, totalRAMA: rama, maxAmount: max };
  }, [levelIncomes]);

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-700 rounded w-1/3 mb-3 sm:mb-4" />
          <div className="space-y-2 sm:space-y-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-4">
                <div className="w-16 sm:w-20 h-3 sm:h-4 bg-gray-700 rounded flex-shrink-0" />
                <div className="flex-1 h-4 sm:h-6 bg-gray-700 rounded" />
                <div className="w-12 sm:w-16 h-3 sm:h-4 bg-gray-700 rounded flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
      {/* Header with totals */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-100">Level Income Breakdown</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-950/50 border border-emerald-500/50 rounded-lg glow-green">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            <span className="text-sm sm:text-base font-bold text-emerald-300">
              ${Number(totalUSD).toFixed(2)} USD
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-950/50 border border-cyan-500/50 rounded-lg glow-blue">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="text-sm sm:text-base font-bold text-cyan-300">
              {Number(totalRAMA).toFixed(2)} RAMA
            </span>
          </div>
        </div>
      </div>

      {/* Levels list */}
      <div className="space-y-3 sm:space-y-4">
        {levelIncomes.map((income) => {
          const lvl = income.level;
          const amt = income.amount || 0;
          const ramaAmt = income.ramaAmount || 0;
          const percentage = maxAmount > 0 ? (amt / maxAmount) * 100 : 0;
          const levelPercentage = lvl === 1 ? 50 : 5;

          return (
            <div
              key={lvl}
              className="flex items-center gap-2 sm:gap-4 cursor-pointer hover:bg-gray-800/30 p-2 sm:p-3 rounded-lg transition-colors border border-transparent hover:border-gray-600/50"
              onClick={() => setSelectedLevel(lvl)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedLevel(lvl)}
            >
              <div className="w-16 sm:w-20 text-xs sm:text-sm font-medium text-gray-400 flex-shrink-0">
                Level {lvl}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">{percentage.toFixed(1)}%</span>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-medium text-gray-100">
                      ${amt.toFixed(2)} USD
                    </div>
                    {/* <div className="text-xs text-gray-400">{ramaAmt.toFixed(2)} RAMA</div> */}
                  </div>
                </div>

                <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3 border border-gray-700">
                  <div
                    className={
                      'h-2 sm:h-3 rounded-full transition-all duration-500 ' +
                      (lvl === 1
                        ? 'bg-gradient-to-r from-emerald-400 to-green-600 glow-green'
                        : 'bg-gradient-to-r from-cyan-400 to-blue-600 glow-blue')
                    }
                    style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>Level 1 pays 50%, Levels 2–9 pay 5% each • Click levels for details</span>
        </div>
      </div>

      <LevelIncomeDetailModal
        level={selectedLevel || 1}
        isOpen={selectedLevel !== null}
        onClose={() => setSelectedLevel(null)}
      />
    </div>
  );
};
