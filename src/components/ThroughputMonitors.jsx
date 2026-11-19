import React, { useState } from 'react';
import { throughputInboundData, throughputOutboundData } from '../data/mockData';

export default function ThroughputMonitors() {
  const [activeTab, setActiveTab] = useState('inbound'); // 'inbound' | 'outbound'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const data = activeTab === 'inbound' ? throughputInboundData : throughputOutboundData;

  const width = 540;
  const height = 250;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxY = 12;
  const minY = 0;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.throughput - minY) / (maxY - minY)) * chartHeight;
    return { ...d, x, y };
  });

  // Smooth spline path
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);

  const yTicks = [12, 10, 8, 6, 4, 2, 0];

  return (
    <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 flex flex-col justify-between">
      {/* Header and Toggle Tabs matching screenshot */}
      <div className="pb-3 border-b border-slate-700/40">
        <h3 className="text-base font-semibold text-white tracking-tight mb-3">
          Throughput Monitors
        </h3>

        {/* Tab Buttons matching screenshot */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inbound')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
              activeTab === 'inbound'
                ? 'bg-[#00BFFF] text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            Total Throughput (Inbound)
          </button>
          <button
            onClick={() => setActiveTab('outbound')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
              activeTab === 'outbound'
                ? 'bg-[#00BFFF] text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            Total Throughput (Outbound)
          </button>
        </div>
      </div>

      {/* SVG Line Graph */}
      <div className="relative w-full h-[250px] flex items-center justify-center my-1 select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <filter id="throughputGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Vertical axis unit label 'Gbps' matching screenshot */}
          <text
            x="12"
            y={height / 2}
            transform={`rotate(-90 12,${height / 2})`}
            textAnchor="middle"
            fill="#64748B"
            fontSize="10"
            fontFamily="Inter, sans-serif"
          >
            Gbps
          </text>

          {/* Horizontal Grid lines & Y labels */}
          {yTicks.map((val) => {
            const yPos = paddingTop + chartHeight - (val / maxY) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={width - paddingRight}
                  y2={yPos}
                  stroke="#334155"
                  strokeOpacity="0.3"
                  strokeDasharray="2 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={yPos + 3.5}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Connected Green Line Curve */}
          <path
            d={linePath}
            fill="none"
            stroke="#2ECC71"
            strokeWidth="2.2"
            filter="url(#throughputGlow)"
          />

          {/* Data Points (Dots) along the line matching screenshot */}
          {points.map((pt) => (
            <circle
              key={pt.time}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#2ECC71"
              stroke="#0F172A"
              strokeWidth="2"
              className="transition-transform duration-150 hover:scale-150 cursor-pointer"
            />
          ))}

          {/* X Axis labels (00:00, 03:00, 06:00, ... 24:00) */}
          {points.map((pt) => (
            <text
              key={`x-${pt.time}`}
              x={pt.x}
              y={height - 8}
              textAnchor="middle"
              fill="#64748B"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
            >
              {pt.time}
            </text>
          ))}

          {/* Interactive Hover Vertical Line and Points */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={paddingTop + chartHeight}
                stroke="#2ECC71"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="6"
                fill="#2ECC71"
                stroke="#0F172A"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Hover Columns */}
          {points.map((pt) => (
            <rect
              key={`col-${pt.time}`}
              x={pt.x - chartWidth / (points.length * 2)}
              y={paddingTop}
              width={chartWidth / points.length}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-slate-900/95 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 shadow-xl text-xs z-30 transition-all font-mono"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 70}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="text-slate-400 text-[10px]">{hoveredPoint.time} EST</div>
            <div className="text-emerald-400 font-bold text-sm">
              {hoveredPoint.throughput} Gbps
            </div>
          </div>
        )}
      </div>

      {/* Footer Summary */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/40 text-xs text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          <span>Current: <strong className="text-emerald-400 font-mono">7.4 Gbps</strong></span>
          <span>Peak: <strong className="text-slate-200 font-mono">8.2 Gbps</strong></span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          Interface: eth0/WAN-Trunk-1
        </div>
      </div>
    </div>
  );
}
