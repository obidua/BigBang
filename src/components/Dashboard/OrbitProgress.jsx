import React from 'react';
import { Circle, CheckCircle } from 'lucide-react';
import { useStore } from '../../../store/useStore';



export const OrbitProgress = ({ maxX = 10 }) => {


  const data = useStore((s)=>s.data)
  const progress = (data?.currentOrbitX / maxX) * 100;

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
      <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4">Current Orbit Progress</h3>
      
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-400">X-Slot Progress</span>
          <span className="text-xs sm:text-sm font-bold text-gray-100">{data?.currentOrbitX}/{maxX}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3 border border-gray-700">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-blue-600 h-2 sm:h-3 rounded-full transition-all duration-500 glow-blue"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2">
        {Array.from({ length: maxX }, (_, i) => {
          const isCompleted = i < data?.currentOrbitX;
          return (
            <div
              key={i}
              className={`aspect-square rounded-md sm:rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-950/50 border-emerald-400 text-emerald-400 glow-green'
                  : 'bg-gray-800/50 border-gray-600 text-gray-500'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              ) : (
                <Circle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              )}
            </div>
          );
        })}
      </div>

      {data?.currentOrbitX === maxX && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-950/30 border border-emerald-500/50 rounded-lg glow-green">
          <p className="text-xs sm:text-sm text-emerald-300 font-medium">
            🎉 Orbit complete! Repurchase triggered automatically.
          </p>
        </div>
      )}
    </div>
  );
};