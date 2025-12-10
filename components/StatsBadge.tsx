import React from 'react';
import { PerformanceMetrics } from '../types';
import { Clock, Zap, DollarSign, Database } from 'lucide-react';

interface StatsBadgeProps {
  metrics: PerformanceMetrics;
}

export const StatsBadge: React.FC<StatsBadgeProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-100 p-3 rounded-lg text-xs md:text-sm text-slate-600 border border-slate-200">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-500" />
        <span>{(metrics.durationMs / 1000).toFixed(2)}s</span>
      </div>
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-purple-500" />
        <span>{metrics.totalTokens.toLocaleString()} tokens</span>
      </div>
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-500" />
        <span>{Math.round(metrics.outputTokens / (metrics.durationMs / 1000))} t/s</span>
      </div>
       <div className="flex items-center gap-2" title="Estimated API Cost">
        <DollarSign className="w-4 h-4 text-green-600" />
        <span>${metrics.estimatedCost.toFixed(6)}</span>
      </div>
    </div>
  );
};