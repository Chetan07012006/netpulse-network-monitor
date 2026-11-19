import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Shield, 
  Server, 
  Router, 
  Activity, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  ExternalLink
} from 'lucide-react';
import { topologyNodes, topologyLinks } from '../data/mockData';

export default function TopologyMap({ onSelectDevice, highlightedDeviceId, searchQuery }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setZoomLevel(1);

  // Center node and spoke nodes positions (designed within 700 x 420 viewBox)
  const nodePositions = {
    "core-rtr": { cx: 350, cy: 210 },
    "hq-fw-01": { cx: 210, cy: 90 },
    "dc-fw-02": { cx: 490, cy: 90 },
    "db-server-01": { cx: 210, cy: 330 },
    "edge-router": { cx: 350, cy: 365 },
    "app-server-02": { cx: 490, cy: 330 }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'up':
        return {
          stroke: '#2ECC71',
          fill: '#2ECC71',
          bg: 'rgba(46, 204, 113, 0.15)',
          glow: 'rgba(46, 204, 113, 0.4)',
          text: 'text-emerald-400'
        };
      case 'degraded':
        return {
          stroke: '#F39C12',
          fill: '#F39C12',
          bg: 'rgba(243, 156, 18, 0.15)',
          glow: 'rgba(243, 156, 18, 0.5)',
          text: 'text-amber-400'
        };
      case 'down':
        return {
          stroke: '#EF4444',
          fill: '#EF4444',
          bg: 'rgba(239, 68, 68, 0.15)',
          glow: 'rgba(239, 68, 68, 0.5)',
          text: 'text-rose-400'
        };
      default:
        return {
          stroke: '#64748B',
          fill: '#64748B',
          bg: 'rgba(100, 116, 139, 0.15)',
          glow: 'rgba(100, 116, 139, 0.3)',
          text: 'text-slate-400'
        };
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (onSelectDevice) onSelectDevice(node.id);
  };

  return (
    <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 relative flex flex-col justify-between overflow-hidden">
      {/* Header and Zoom Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Network Topology Map
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Zabbix Core L2/L3 Fabric • Real-time Link Telemetry
          </p>
        </div>

        {/* Zoom Controls matching screenshot (+ / - buttons) */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Topology Canvas */}
      <div className="relative w-full h-[360px] sm:h-[400px] flex items-center justify-center overflow-hidden my-2 select-none bg-[#111A2E]/50 rounded-lg border border-slate-800/60">
        <svg
          className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300"
          viewBox="0 0 700 440"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Filter for glowing nodes */}
            <filter id="glow-green" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-orange" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Flow gradients */}
            <linearGradient id="linkGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="linkGradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F39C12" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Background subtle grid pattern */}
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(51, 65, 85, 0.2)" strokeWidth="0.8" />
          </pattern>
          <rect width="700" height="440" fill="url(#grid)" />

          {/* Links between Center Node and Spokes */}
          {topologyLinks.map((link, idx) => {
            const start = nodePositions[link.source];
            const end = nodePositions[link.target];
            if (!start || !end) return null;

            const isDegraded = link.status === 'degraded';
            const lineColor = isDegraded ? '#F39C12' : '#2ECC71';
            const strokeWidth = isDegraded ? 2 : 1.8;

            return (
              <g key={`link-${idx}`}>
                {/* Background base link line */}
                <line
                  x1={start.cx}
                  y1={start.cy}
                  x2={end.cx}
                  y2={end.cy}
                  stroke={lineColor}
                  strokeOpacity="0.4"
                  strokeWidth={strokeWidth}
                />

                {/* Animated traffic flow pulses */}
                <line
                  x1={start.cx}
                  y1={start.cy}
                  x2={end.cx}
                  y2={end.cy}
                  stroke={lineColor}
                  strokeWidth={strokeWidth + 0.6}
                  strokeDasharray="4 12"
                  className={isDegraded ? "link-flow-orange" : "link-flow-green"}
                  strokeOpacity="0.95"
                />

                {/* Traveling packet dot */}
                <circle r={isDegraded ? 3 : 2.5} fill={lineColor}>
                  <animateMotion
                    path={`M ${start.cx} ${start.cy} L ${end.cx} ${end.cy}`}
                    dur={isDegraded ? "3.2s" : "2s"}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Render Nodes */}
          {topologyNodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const colors = getStatusColor(node.status);
            const isSelected = selectedNode?.id === node.id;
            const isHighlighted = highlightedDeviceId === node.id || 
              (searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase()));

            return (
              <g
                key={node.id}
                transform={`translate(${pos.cx}, ${pos.cy})`}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
              >
                {/* Search highlight ring */}
                {isHighlighted && (
                  <circle
                    r="34"
                    fill="none"
                    stroke="#00BFFF"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    className="animate-spin"
                    opacity="0.85"
                  />
                )}

                {/* Outer Glow / Halo */}
                <circle
                  r="26"
                  fill={colors.bg}
                  stroke={colors.stroke}
                  strokeWidth="2.2"
                  filter={node.status === 'degraded' ? "url(#glow-orange)" : "url(#glow-green)"}
                  className="transition-all duration-200 group-hover:scale-110"
                />

                {/* Inner background circle */}
                <circle
                  r="20"
                  fill="#0F172A"
                  stroke={colors.stroke}
                  strokeWidth="1.2"
                />

                {/* Node Center Icon / Glyphs matching screenshot */}
                {node.id === 'core-rtr' ? (
                  // Core switch icon with small circle & spokes
                  <g fill="none" stroke="#2ECC71" strokeWidth="1.8" transform="scale(0.8) translate(-12, -12)">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  </g>
                ) : node.type === 'firewall' ? (
                  // Firewall / Shield glyph
                  <g fill="none" stroke={colors.stroke} strokeWidth="1.8" transform="scale(0.8) translate(-12, -12)">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </g>
                ) : (
                  // Server glyph
                  <g fill="none" stroke={colors.stroke} strokeWidth="1.8" transform="scale(0.8) translate(-12, -12)">
                    <rect x="3" y="4" width="18" height="6" rx="2" />
                    <rect x="3" y="14" width="18" height="6" rx="2" />
                    <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2.5" />
                    <line x1="7" y1="17" x2="7.01" y2="17" strokeWidth="2.5" />
                  </g>
                )}

                {/* Node Label underneath */}
                <text
                  y="38"
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                  className="tracking-tight drop-shadow"
                >
                  {node.name}
                </text>

                {/* Subtle role or status small text */}
                <text
                  y="50"
                  textAnchor="middle"
                  fill={node.status === 'degraded' ? '#F39C12' : '#64748B'}
                  fontSize="8.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.status === 'degraded' ? 'Degraded (High Lat)' : node.ip}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Legend matching screenshot */}
      <div className="flex items-center gap-6 pt-3 border-t border-slate-700/40 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50"></span>
          <span>Up</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-500/50"></span>
          <span>Degraded</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
          <span>Down</span>
        </div>
        <div className="ml-auto text-[11px] text-slate-400 hidden sm:block">
          Click any node for real-time telemetry
        </div>
      </div>

      {/* Selected Node Quick Inspector Modal / Popup */}
      {selectedNode && (
        <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md rounded-xl p-5 z-20 flex flex-col justify-between border border-cyan-500/30 animate-in fade-in duration-150">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedNode.status === 'degraded' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {selectedNode.type === 'firewall' ? <Shield className="w-5 h-5" /> : selectedNode.type === 'router' ? <Router className="w-5 h-5" /> : <Server className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">{selectedNode.name}</h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-semibold ${
                    selectedNode.status === 'degraded' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">{selectedNode.ip} • {selectedNode.model}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-mono block">CPU UTILIZATION</span>
              <span className={`text-base font-bold font-mono ${selectedNode.cpu > 80 ? 'text-amber-400' : 'text-slate-100'}`}>
                {selectedNode.cpu}%
              </span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-mono block">MEMORY</span>
              <span className="text-base font-bold text-slate-100 font-mono">{selectedNode.memory}%</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-mono block">RTT LATENCY</span>
              <span className="text-base font-bold text-cyan-400 font-mono">{selectedNode.latency}</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-mono block">TEMPERATURE</span>
              <span className="text-base font-bold text-slate-100 font-mono">{selectedNode.temp}</span>
            </div>
          </div>

          {selectedNode.alertMessage && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{selectedNode.alertMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60">
            <span>Location: <strong className="text-slate-200">{selectedNode.location}</strong></span>
            <button
              onClick={() => setSelectedNode(null)}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 text-xs transition-colors"
            >
              Close Telemetry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
