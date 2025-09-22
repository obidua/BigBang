import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Users, Repeat } from 'lucide-react';


export const RecentActivity = ({ getIncomeHistory }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const history = await getIncomeHistory(0);
        setActivities(history);
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [getIncomeHistory]);

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityIcon = (level) => {
    if (level === 1) return TrendingUp;
    if (level <= 3) return Users;
    return Repeat;
  };

  const getActivityColor = (level) => {
    if (level === 1) return 'text-green-600 bg-green-50';
    if (level <= 3) return 'text-blue-600 bg-blue-50';
    return 'text-purple-600 bg-purple-50';
    if (level === 1) return 'text-emerald-400 bg-emerald-950/50 border border-emerald-500/30';
    if (level <= 3) return 'text-cyan-400 bg-cyan-950/50 border border-cyan-500/30';
    return 'text-purple-400 bg-purple-950/50 border border-purple-500/30';
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
        <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4">Recent Activity</h3>
        <div className="space-y-3 sm:space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 sm:h-4 bg-gray-700 rounded w-3/4 mb-1.5 sm:mb-2" />
                <div className="h-2.5 sm:h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
      <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4">Recent Activity</h3>
      
      <div className="max-h-96 overflow-y-auto space-y-3 sm:space-y-4 pr-2">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.level);
          const colorClass = getActivityColor(activity.level);
          
          return (
            <div key={index} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-gray-800/30 rounded-lg transition-colors border border-transparent hover:border-gray-600/50">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-100">
                  Income from Level {activity.level}
                </p>
                <p className="text-xs sm:text-xs text-gray-400">
                  +${parseFloat(activity.usd).toFixed(2)} USD • +{parseFloat(activity.amount).toFixed(2)} RAMA
                </p>
                <p className="text-xs text-gray-500">
                  From: {activity.donorId}
                </p>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                <Clock className="w-3 h-3 hidden sm:block" />
                {formatTime(activity.timestamp)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};