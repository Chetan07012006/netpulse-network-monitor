import React, { useState } from 'react';
import { Shield, Router, Server, Search, Filter, ChevronRight, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { firewallDevices } from '../data/mockData';

export default function DeviceTable({ 
  searchQuery, 
  setSearchQuery, 
  onSelectDevice, 
  highlightedDeviceId 
}) {
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'UP' | 'DEGRADED' | 'DOWN'
  const [localSearch, setLocalSearch] = useState('');

  // Combined search term (from TopHeader or local input)
  const activeSearch = (searchQuery || localSearch).trim().toLowerCase();

  const filteredDevices = firewallDevices.filter((dev) => {
    // Search match
    const matchesSearch = 
      dev.name.toLowerCase().includes(activeSearch) ||
      dev.model.toLowerCase().includes(activeSearch) ||
      dev.ip.toLowerCase().includes(activeSearch) ||
      dev.location.toLowerCase().includes(activeSearch);

    if (!matchesSearch) return false;

    // Status filter match
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'UP') {
      return dev.link1 === 'UP' && dev.link2 === 'UP' && dev.vpn === 'UP';
    }
    if (statusFilter === 'DEGRADED') {
      return dev.link1 === 'DEGRADED' || dev.link2 === 'DEGRADED' || dev.vpn === 'DEGRADED';
    }
    if (statusFilter === 'DOWN') {
      return dev.link1 === 'DOWN' || dev.link2 === 'DOWN' || dev.vpn === 'DOWN';
    }
    return true;
  });

  const renderStatusPill = (status) => {
    switch (status) {
      case 'UP':
        return (
          <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-emerald-500/10 border border-emerald-500/50 text-emerald-400">
            UP
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-amber-500/15 border border-amber-500/60 text-amber-400 animate-pulse">
            DEGRADED
          </span>
        );
      case 'DOWN':
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-rose-500/15 border border-rose-500/60 text-rose-400">
            DOWN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 flex flex-col justify-between">
      {/* Header & Controls matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Firewall Link Status
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            HA Clustering, Dual Uplinks & IPsec Tunnel State
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {['ALL', 'UP', 'DEGRADED', 'DOWN'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                statusFilter === filter
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container with scrollbar */}
      <div className="overflow-x-auto overflow-y-auto max-h-[290px] my-2 pr-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700/60 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Device</th>
              <th className="py-2.5 px-3">Model</th>
              <th className="py-2.5 px-3 text-center">Link 1</th>
              <th className="py-2.5 px-3 text-center">Link 2</th>
              <th className="py-2.5 px-3 text-center">VPN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device) => {
                const isHighlighted = highlightedDeviceId === device.id;
                return (
                  <tr
                    key={device.id}
                    onClick={() => onSelectDevice?.(device.id)}
                    className={`hover:bg-slate-800/60 cursor-pointer transition-colors group ${
                      isHighlighted ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                    }`}
                  >
                    {/* Device Column with cyan circular device icon */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full border border-cyan-400/80 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                          <div className="w-2 h-2 rounded-full bg-cyan-400/80"></div>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-100 font-mono tracking-tight group-hover:text-cyan-400 transition-colors">
                            {device.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-sans">
                            {device.ip}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Model Column */}
                    <td className="py-3 px-3 text-slate-300 font-sans">
                      {device.model}
                    </td>

                    {/* Link 1 */}
                    <td className="py-3 px-3 text-center">
                      {renderStatusPill(device.link1)}
                    </td>

                    {/* Link 2 */}
                    <td className="py-3 px-3 text-center">
                      {renderStatusPill(device.link2)}
                    </td>

                    {/* VPN */}
                    <td className="py-3 px-3 text-center">
                      {renderStatusPill(device.vpn)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500 text-xs font-mono">
                  No devices match filter "{activeSearch || statusFilter}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/40 text-xs text-slate-400 font-sans">
        <span>
          Showing <strong className="text-slate-200">{filteredDevices.length}</strong> of {firewallDevices.length} gateways
        </span>
        <span className="text-[11px] font-mono text-cyan-400">
          Auto-polling: 10s • SNMPv3
        </span>
      </div>
    </div>
  );
}
