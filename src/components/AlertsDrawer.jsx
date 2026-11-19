import React, { useState } from 'react';
import { X, AlertTriangle, AlertOctagon, CheckCircle2, Shield, Bell, Check } from 'lucide-react';
import { liveAlerts as initialAlerts } from '../data/mockData';

export default function AlertsDrawer({ isOpen, onClose, onSelectDevice }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING'

  if (!isOpen) return null;

  const handleAcknowledge = (id, e) => {
    e.stopPropagation();
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: !a.acknowledged } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'CRITICAL') return a.severity === 'critical';
    if (filter === 'WARNING') return a.severity === 'warning';
    return true;
  });

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F172A] border-l border-slate-800 text-slate-100 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Active Security Alerts
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    {unacknowledgedCount} Active
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Zabbix Trigger Engine • Priority Queue</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-2">
            {['ALL', 'CRITICAL', 'WARNING'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                  filter === f
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  if (onSelectDevice) onSelectDevice(alert.device.toLowerCase());
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  alert.severity === 'critical'
                    ? 'bg-rose-950/20 border-rose-800/50 hover:border-rose-500/70'
                    : 'bg-amber-950/20 border-amber-800/50 hover:border-amber-500/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {alert.severity === 'critical' ? (
                      <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                    <span className="text-xs font-bold text-slate-200">
                      {alert.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {alert.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {alert.message}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 text-[11px] font-medium">
                    Target: {alert.device}
                  </span>

                  <button
                    onClick={(e) => handleAcknowledge(alert.id, e)}
                    className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                      alert.acknowledged
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {alert.acknowledged ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        Acked
                      </>
                    ) : (
                      'Acknowledge'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
            <span>Escalation Rule: Tier 3 Network NOC</span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
