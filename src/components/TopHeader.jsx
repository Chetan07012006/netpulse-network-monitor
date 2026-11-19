import React, { useState } from 'react';
import { Search, Bell, MapPin, RefreshCw, Radio, Shield, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function TopHeader({ 
  searchQuery, 
  setSearchQuery, 
  alertsCount = 15, 
  onToggleAlerts, 
  lastRefreshed = "Just now", 
  onRefresh 
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: KOI Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {/* Cyan Map Pin/Locator Logo matching image */}
            <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/15">
              <MapPin className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0F172A]"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                KOI
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 rounded">
                PROD-US-EAST
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Enterprise Network & Systems Monitoring
            </p>
          </div>
        </div>

        {/* Right: Actions, Search, Alerts, User Avatar */}
        <div className="flex items-center gap-3">
          {/* Live indicator badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium text-[11px] font-mono">LIVE SYNC</span>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={onRefresh}
            title={`Last updated: ${lastRefreshed}. Click to refresh metrics.`}
            className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/60 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Search bar matching screenshot */}
          <div className={`relative transition-all duration-200 ${isSearchFocused ? 'w-64 md:w-80' : 'w-48 sm:w-60 md:w-72'}`}>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search devices, alerts..."
              className="w-full bg-[#1E293B]/90 border border-slate-700/70 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Notification Alert Bell */}
          <button
            onClick={onToggleAlerts}
            className="relative p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/60 transition-colors"
            title="Active Alerts"
          >
            <Bell className="w-4 h-4" />
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full border-2 border-[#0F172A] shadow-md shadow-rose-500/40">
                {alertsCount}
              </span>
            )}
          </button>

          {/* User Avatar AD matching screenshot */}
          <div className="relative group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-cyan-600/30 border-2 border-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/20 text-cyan-300 font-bold text-xs font-mono tracking-wider">
              AD
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0F172A]"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
