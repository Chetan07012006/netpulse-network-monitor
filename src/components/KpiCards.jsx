import React from 'react';
import { Server, Activity, Zap, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function KpiCards({ metrics, onCardClick }) {
  // Sparkline points for Avg Latency
  const sparklineData = [40, 42, 45, 43, 44, 46, 45, 43, 47, 45, 44, 45];
  const maxSpark = Math.max(...sparklineData);
  const minSpark = Math.min(...sparklineData);
  const sparkPoints = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 140;
      const y = 32 - ((val - minSpark) / (maxSpark - minSpark || 1)) * 22;
      return `${x},${y}`;
    })
    .join(' ');

  // Throughput segments (14 horizontal bars matching screenshot)
  const totalSegments = 14;
  const activeSegments = 12; // High utilization at peak

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Devices */}
      <div 
        onClick={() => onCardClick?.('devices')}
        className="bg-[#1E293B] hover:bg-[#223046] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 transition-all duration-200 cursor-pointer group hover:border-cyan-500/40 relative overflow-hidden flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 font-sans tracking-wide">
              Total Devices (Up/Down)
            </p>
            <h2 className="text-2xl font-bold text-white mt-1.5 font-sans tracking-tight">
              1,250
            </h2>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            {/* Dual stacked server icon */}
            <div className="flex flex-col gap-1 items-center">
              <div className="w-5 h-2 rounded-[2px] border border-cyan-400/80 bg-cyan-400/20"></div>
              <div className="w-5 h-2 rounded-[2px] border border-cyan-400/80 bg-cyan-400/20"></div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center text-xs text-slate-400 font-sans">
          <span>Active: <strong className="text-emerald-400 font-medium">1,245</strong></span>
          <span className="mx-2 text-slate-600">|</span>
          <span>Down: <strong className="text-rose-400 font-medium">5</strong></span>
        </div>
      </div>

      {/* 2. Avg. Network Latency */}
      <div 
        onClick={() => onCardClick?.('latency')}
        className="bg-[#1E293B] hover:bg-[#223046] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 transition-all duration-200 cursor-pointer group hover:border-cyan-500/40 relative overflow-hidden flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 font-sans tracking-wide">
              Avg. Network Latency
            </p>
            <h2 className="text-2xl font-bold text-white mt-1.5 font-sans tracking-tight flex items-baseline gap-1">
              45<span className="text-base font-normal text-slate-300">ms</span>
            </h2>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        {/* Live Sparkline wave in cyan */}
        <div className="mt-3 w-full">
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 140 36">
            <polyline
              fill="none"
              stroke="#00BFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparkPoints}
            />
            {/* Pulsing endpoint */}
            <circle cx="140" cy="18" r="3" fill="#00BFFF" className="animate-ping" opacity="0.7" />
            <circle cx="140" cy="18" r="2.5" fill="#38BDF8" />
          </svg>
        </div>
      </div>

      {/* 3. Peak Today's Throughput */}
      <div 
        onClick={() => onCardClick?.('throughput')}
        className="bg-[#1E293B] hover:bg-[#223046] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 transition-all duration-200 cursor-pointer group hover:border-cyan-500/40 relative overflow-hidden flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 font-sans tracking-wide">
              Peak Today's Throughput
            </p>
            <h2 className="text-2xl font-bold text-white mt-1.5 font-sans tracking-tight">
              8.2 <span className="text-base font-normal text-slate-300">Gbps</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Time: <span className="font-mono text-slate-300">14:30 EST</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        {/* Segmented green blocks meter matching screenshot */}
        <div className="mt-3 flex items-center gap-1 w-full">
          {Array.from({ length: totalSegments }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-[2px] transition-all duration-300 ${
                i < activeSegments
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50'
                  : 'bg-slate-700/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 4. Alert Count */}
      <div 
        onClick={() => onCardClick?.('alerts')}
        className="bg-[#1E293B] hover:bg-[#223046] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 transition-all duration-200 cursor-pointer group hover:border-cyan-500/40 relative overflow-hidden flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 font-sans tracking-wide">
              Alert Count (Critical/Warning)
            </p>
            <h2 className="text-2xl font-bold text-white mt-1.5 font-sans tracking-tight">
              15
            </h2>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        <div className="mt-4 flex items-center text-xs text-slate-400 font-sans">
          <span>Crit: <strong className="text-rose-400 font-semibold">3</strong></span>
          <span className="mx-2 text-slate-600">|</span>
          <span>Warn: <strong className="text-amber-400 font-semibold">12</strong></span>
        </div>
      </div>
    </div>
  );
}
