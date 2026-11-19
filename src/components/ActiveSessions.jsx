import React, { useState } from 'react';
import { activeSessionsData } from '../data/mockData';

export default function ActiveSessions() {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // SVG chart dimensions
  const width = 520;
  const height = 280;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxY = 80000;
  const minY = 0;

  // Calculate coordinates for data points
  const points = activeSessionsData.map((d, i) => {
    const x = paddingLeft + (i / (activeSessionsData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.sessions - minY) / (maxY - minY)) * chartHeight;
    return { ...d, x, y };
  });

  // Generate smooth cubic bezier SVG path
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
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  // Y-axis grid ticks (80k, 60k, 40k, 20k, 0k) matching screenshot
  const yTicks = [
    { label: '80k', val: 80000 },
    { label: '60k', val: 60000 },
    { label: '40k', val: 40000 },
    { label: '20k', val: 20000 },
    { label: '0k', val: 0 }
  ];

  return (
    <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 flex flex-col justify-between">
      {/* Top Header matching screenshot */}
      <div className="flex items-start justify-between pb-2 border-b border-slate-700/40">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Active Sessions
          </h3>
          <p className="text-xs text-cyan-400 font-mono mt-0.5 font-medium">
            Current: 68,450
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">24H</span>
          <span className="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 cursor-pointer">7D</span>
          <span className="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 cursor-pointer">30D</span>
        </div>
      </div>

      {/* SVG Area Chart */}
      <div className="relative w-full h-[360px] sm:h-[400px] flex items-center justify-center my-1 select-none">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Gradient for area fill */}
            <linearGradient id="sessionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00BFFF" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#00BFFF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#00BFFF" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing filter for line */}
            <filter id="sessionGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal grid lines & Y labels matching screenshot */}
          {yTicks.map((tick) => {
            const yPos = paddingTop + chartHeight - (tick.val / maxY) * chartHeight;
            return (
              <g key={tick.label}>
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={width - paddingRight}
                  y2={yPos}
                  stroke="#334155"
                  strokeOpacity="0.35"
                  strokeDasharray="2 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={yPos + 3.5}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <path
            d={areaPath}
            fill="url(#sessionGradient)"
          />

          {/* Glowing Stroke line */}
          <path
            d={linePath}
            fill="none"
            stroke="#00BFFF"
            strokeWidth="2.4"
            filter="url(#sessionGlow)"
          />

          {/* X Axis timestamps labels matching screenshot */}
          {points.map((pt, i) => (
            <text
              key={pt.time}
              x={pt.x}
              y={height - 12}
              textAnchor="middle"
              fill="#64748B"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
            >
              {pt.time}
            </text>
          ))}

          {/* Hover interactive vertical rule and tooltip */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={paddingTop + chartHeight}
                stroke="#38BDF8"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="5"
                fill="#0F172A"
                stroke="#00BFFF"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Invisible interactive overlay pillars for hover */}
          {points.map((pt) => (
            <rect
              key={`hover-${pt.time}`}
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

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-slate-900/95 border border-cyan-500/40 rounded-lg px-2.5 py-1.5 shadow-xl text-xs z-30 transition-all font-mono"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 75}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="text-slate-400 text-[10px]">{hoveredPoint.time} EST</div>
            <div className="text-cyan-400 font-bold text-sm">
              {hoveredPoint.sessions.toLocaleString()} sessions
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics info */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/40 text-xs text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          <span>Peak: <strong className="text-slate-200 font-mono">71,800</strong></span>
          <span>Trough: <strong className="text-slate-200 font-mono">33,400</strong></span>
        </div>
        <div className="text-emerald-400 font-medium font-mono text-[11px] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Normal Operating Bounds
        </div>
      </div>
    </div>
  );
}
