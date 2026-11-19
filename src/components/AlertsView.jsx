import React, { useState } from 'react';
import { 
  Bell, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Check, 
  ArrowUpRight, 
  RotateCcw, 
  ShieldAlert, 
  SlidersHorizontal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { liveAlerts as initialAlerts } from '../data/mockData';

export default function AlertsView({ onSelectDevice, onOpenDrawer }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [severityFilter, setSeverityFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING'
  const [ackFilter, setAckFilter] = useState('ALL'); // 'ALL' | 'UNACKNOWLEDGED' | 'ACKNOWLEDGED'
  const [search, setSearch] = useState('');

  const toggleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: !a.acknowledged } : a));
  };

  const handleAcknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
  };

  const filteredAlerts = alerts.filter(a => {
    // Severity
    if (severityFilter === 'CRITICAL' && a.severity !== 'critical') return false;
    if (severityFilter === 'WARNING' && a.severity !== 'warning') return false;

    // Acknowledged
    if (ackFilter === 'UNACKNOWLEDGED' && a.acknowledged) return false;
    if (ackFilter === 'ACKNOWLEDGED' && !a.acknowledged) return false;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = a.title.toLowerCase().includes(q) ||
                    a.device.toLowerCase().includes(q) ||
                    a.message.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const unackCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <span>Active Security Alerts &amp; Trigger Events</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Zabbix Trigger Engine • Real-time priority queue, threshold breaches &amp; mitigation tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenDrawer && (
            <button
              onClick={onOpenDrawer}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Side Drawer</span>
            </button>
          )}
          <button
            onClick={handleAcknowledgeAll}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Acknowledge All</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-4 shadow-lg shadow-slate-950/20">
          <p className="text-xs text-slate-400 font-medium">Total Live Triggers</p>
          <div className="text-2xl font-bold text-white mt-1">{alerts.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Monitored interfaces</p>
        </div>

        <div className="bg-[#1E293B] border border-rose-500/30 rounded-xl p-4 shadow-lg shadow-rose-950/20 bg-gradient-to-br from-[#1E293B] to-rose-950/10">
          <p className="text-xs text-rose-300 font-medium flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            Critical Severity
          </p>
          <div className="text-2xl font-bold text-rose-400 mt-1">{criticalCount}</div>
          <p className="text-[11px] text-rose-400/80 mt-1">Requires immediate action</p>
        </div>

        <div className="bg-[#1E293B] border border-amber-500/30 rounded-xl p-4 shadow-lg shadow-amber-950/20 bg-gradient-to-br from-[#1E293B] to-amber-950/10">
          <p className="text-xs text-amber-300 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Warning State
          </p>
          <div className="text-2xl font-bold text-amber-400 mt-1">{warningCount}</div>
          <p className="text-[11px] text-amber-400/80 mt-1">Approaching thresholds</p>
        </div>

        <div className="bg-[#1E293B] border border-cyan-500/30 rounded-xl p-4 shadow-lg shadow-cyan-950/20 bg-gradient-to-br from-[#1E293B] to-cyan-950/10">
          <p className="text-xs text-cyan-300 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            Unacknowledged
          </p>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{unackCount}</div>
          <p className="text-[11px] text-cyan-400/80 mt-1">Pending triage</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by trigger title, device name, or keyword..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Severity */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            {['ALL', 'CRITICAL', 'WARNING'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  severityFilter === sev
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Ack Status */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            {['ALL', 'UNACKNOWLEDGED', 'ACKNOWLEDGED'].map((ack) => (
              <button
                key={ack}
                onClick={() => setAckFilter(ack)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  ackFilter === ack
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ack === 'UNACKNOWLEDGED' ? 'UNACK' : ack === 'ACKNOWLEDGED' ? 'ACK' : 'ALL'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h4 className="text-base font-semibold text-white">No Matching Alerts</h4>
            <p className="text-xs mt-1">All clear or filters match 0 active triggers.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCritical 
                    ? 'bg-rose-950/20 border-rose-800/50 hover:border-rose-500/70' 
                    : 'bg-amber-950/20 border-amber-800/50 hover:border-amber-500/70'
                }`}
              >
                {/* Left info */}
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {isCritical ? <AlertOctagon className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white tracking-tight">
                        {alert.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                        isCritical 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-400 border border-slate-700">
                        {alert.device}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {alert.message}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
                      <span>Trigger ID: {alert.id}</span>
                      <span>•</span>
                      <span>Timestamp: {alert.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  {onSelectDevice && (
                    <button
                      onClick={() => onSelectDevice(alert.device.toLowerCase())}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      title="Navigate to Topology Map and highlight device"
                    >
                      <span>Locate Device</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => toggleAcknowledge(alert.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                      alert.acknowledged
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${alert.acknowledged ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
