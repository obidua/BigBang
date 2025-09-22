import React from 'react';
import { TrendingUp, Users, Repeat, DollarSign } from 'lucide-react';
import { useStore } from '../../../store/useStore';


export const StatsCards = () => {

  const data = useStore((s) => s.data);
  const stats = [
    {
      title: 'Total Earnings',
      value: `$${data?.totalEarningsUSD.toFixed(2)}`,
      subValue: `${data?.totalEarningsRAMA.toFixed(2)} RAMA`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Current Orbit X',
      value: `${data?.currentOrbitX}/10`,
      subValue: '70% Complete',
      change: '70%',
      icon: Repeat,
      color: 'blue'
    },
    {
      title: 'Repurchases',
      value: data?.repurchaseCount.toString(),
      subValue: `${Math.round((data?.repurchaseCount / 10) * 100)}% Progress`,
      change: `${Math.round((data?.repurchaseCount / 10) * 100)}%`,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Network Users',
      value: data.totalUsers.toLocaleString(),
      subValue: 'Active Members',
      change: '+8.2%',
      icon: Users,
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          green: 'from-emerald-400 to-green-600',
          blue: 'from-cyan-400 to-blue-600',
          purple: 'from-purple-400 to-violet-600',
          orange: 'from-orange-400 to-amber-600'
        };

        return (
          <div
            key={index}
            className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue hover:glow-purple"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${colorClasses[stat.color]} rounded-lg flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xs sm:text-sm text-emerald-400 font-medium">
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-400 text-xs sm:text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-100">{stat.value}</p>
            {stat.subValue && (
              <p className="text-xs sm:text-sm text-gray-400 mt-1">{stat.subValue}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};