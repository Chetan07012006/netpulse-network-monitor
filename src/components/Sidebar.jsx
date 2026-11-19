import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  ShieldCheck, 
  Activity, 
  Radio, 
  Bell, 
  Server, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Terminal,
  Cpu
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onNavigate, isCollapsed, setIsCollapsed }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'topology', label: 'Topology Map', icon: Network },
    { id: 'firewalls', label: 'Firewall Links', icon: ShieldCheck, badge: '8' },
    { id: 'throughput', label: 'Throughput', icon: Activity },
    { id: 'sessions', label: 'Active Sessions', icon: Radio },
    { id: 'alerts', label: 'Alerts', icon: Server, badge: '15', badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/40' },
    { id: 'terminal', label: 'CLI Console', icon: Terminal },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
    } else if (setActiveTab) {
      setActiveTab(id);
    }
  };

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-slate-800 bg-[#0B1120] flex flex-col justify-between ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Branding Section */}
      <div>
        <div className="h-16 flex items-center px-4 border-b border-slate-800/80 justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <ShieldCheck className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold tracking-wider text-base leading-none">KOI NET</span>
                <span className="text-[10px] text-cyan-400 font-mono tracking-tight">ZABBIX CORE</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-slate-950 font-bold" />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${isActive ? 'text-cyan-400 scale-105' : 'text-slate-400 group-hover:text-slate-300'}`} />
                {!isCollapsed && (
                  <span className="ml-3 truncate font-normal tracking-wide flex-1 text-left">
                    {item.label}
                  </span>
                )}
                {!isCollapsed && item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-slate-200 text-xs rounded shadow-lg border border-slate-700 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status / Toggle */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        {!isCollapsed && (
          <div className="mb-3 px-2 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-mono">NODE HEALTH</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                99.98%
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Zabbix Gateway</span>
              <span className="text-cyan-400 font-mono">v6.4.12</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <div className="flex items-center text-xs gap-2"><ChevronLeft className="w-4 h-4" /><span>Collapse Sidebar</span></div>}
        </button>
      </div>
    </aside>
  );
}
