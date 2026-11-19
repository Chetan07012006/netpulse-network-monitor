import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  CornerDownLeft, 
  Trash2, 
  Play, 
  Shield, 
  CheckCircle2, 
  Server, 
  Wifi, 
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { liveAlerts, topologyNodes } from '../data/mockData';

const INITIAL_LOGS = [
  {
    type: 'banner',
    text: `╔══════════════════════════════════════════════════════════════════════╗
║        KOI NETWORK SYSTEMS - ZABBIX DIAGNOSTIC TERMINAL v6.4         ║
║        Gateway: zabbix-gw-01.koi.internal [10.0.0.1:10051]           ║
║        Active Session: koi-admin (Privileged Operator)               ║
║        Type 'help' to view available diagnostic commands             ║
╚══════════════════════════════════════════════════════════════════════╝`
  },
  {
    type: 'system',
    text: `[SYSTEM] Established TLSv1.3 connection with CORE-RTR (10.0.0.1). SNMPv3 polling active.`
  }
];

export default function CliConsole({ onNavigateDashboard }) {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const terminalBottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (rawCmd) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Add to history
    setHistory(prev => [...prev, cmd]);
    setHistoryIdx(-1);

    // Echo input
    const newLogs = [...logs, { type: 'input', text: `koi-admin@zabbix-gw-01:~$ ${cmd}` }];
    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg1 = parts[1] || '';

    switch (mainCmd) {
      case 'help':
        newLogs.push({
          type: 'output',
          text: `Available Diagnostic Commands:
  ping <ip/host>        - Send ICMP echo requests to target host
  traceroute <ip>       - Trace network path and round-trip hops
  show interfaces       - Display network interface statistics & link state
  show routes           - Display IP routing table & gateway hops
  show alerts           - List active security triggers & severity states
  show nodes            - Display all monitored topology nodes
  status                - Check Zabbix Gateway agent daemon health & uptime
  zabbix-get <key>      - Poll metric value from Zabbix Agent (e.g. net.if.in[eth0])
  clear                 - Clear terminal screen buffer
  help                  - Show this manual`
        });
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'ping': {
        const target = arg1 || '10.0.0.1';
        newLogs.push({
          type: 'output',
          text: `PING ${target} (${target}) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=64 time=1.24 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=1.18 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=1.35 ms
64 bytes from ${target}: icmp_seq=4 ttl=64 time=1.21 ms

--- ${target} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 1.180/1.245/1.350/0.063 ms`
        });
        break;
      }

      case 'traceroute': {
        const target = arg1 || '10.30.2.14';
        newLogs.push({
          type: 'output',
          text: `traceroute to ${target} (${target}), 30 hops max, 60 byte packets
 1  core-rtr.koi.internal (10.0.0.1)        0.824 ms  0.792 ms  0.751 ms
 2  hq-fw-01.koi.internal (10.10.1.1)       1.642 ms  1.589 ms  1.611 ms
 3  edge-switch-02.koi.internal (10.20.1.2) 2.114 ms  2.088 ms  2.052 ms
 4  db-server-01.koi.internal (${target})   2.341 ms  2.298 ms  2.315 ms
Trace complete. 0 dropped packets.`
        });
        break;
      }

      case 'show': {
        const subCmd = (arg1 || '').toLowerCase();
        if (subCmd === 'interfaces' || subCmd === 'interface' || subCmd === 'int') {
          newLogs.push({
            type: 'output',
            text: `Interface    Status    MTU     Speed      Inbound (RX)      Outbound (TX)     Errors
──────────────────────────────────────────────────────────────────────────────────
eth0 (WAN1)  UP        1500    10 Gbps    4,812.4 Mbps      4,510.8 Mbps      0
eth1 (WAN2)  UP        1500    10 Gbps    1,820.1 Mbps      1,215.3 Mbps      0
tun0 (VPN)   UP        1420     1 Gbps      184.2 Mbps        120.6 Mbps      0
sfp+1 (Core) UP        9000    40 Gbps    8,219.0 Mbps      7,940.2 Mbps      0
eth2 (Mgmt)  UP        1500     1 Gbps        4.1 Mbps          2.8 Mbps      0`
          });
        } else if (subCmd === 'routes' || subCmd === 'route') {
          newLogs.push({
            type: 'output',
            text: `Destination        Gateway         Genmask         Flags   Metric  Ref   Use Iface
0.0.0.0            198.51.100.1    0.0.0.0         UG      100     0       0   eth0
10.0.0.0           0.0.0.0         255.255.255.0   U       0       0       0   sfp+1
10.10.0.0          10.0.0.2        255.255.0.0     UG      10      0       0   eth1
10.20.0.0          10.0.0.3        255.255.0.0     UG      10      0       0   sfp+1
10.30.0.0          10.0.0.4        255.255.0.0     UG      20      0       0   sfp+1`
          });
        } else if (subCmd === 'alerts' || subCmd === 'alert') {
          const alertLines = liveAlerts.map(a => 
            `[${a.severity.toUpperCase().padEnd(8)}] ${a.device.padEnd(14)} : ${a.title} (${a.timestamp})`
          ).join('\n');
          newLogs.push({
            type: 'output',
            text: `Active Trigger Queue (${liveAlerts.length} entries):\n${alertLines}`
          });
        } else if (subCmd === 'nodes' || subCmd === 'node') {
          const nodeLines = topologyNodes.map(n => 
            `${n.name.padEnd(16)} | IP: ${n.ip.padEnd(14)} | Role: ${n.role.padEnd(26)} | Status: ${n.status.toUpperCase()}`
          ).join('\n');
          newLogs.push({
            type: 'output',
            text: `Monitored Topology Nodes:\n${nodeLines}`
          });
        } else {
          newLogs.push({
            type: 'error',
            text: `Unknown parameter '${subCmd}'. Try: show interfaces, show routes, show alerts, show nodes`
          });
        }
        break;
      }

      case 'status':
      case 'health':
        newLogs.push({
          type: 'output',
          text: `● zabbix-agent2.service - Zabbix Agent 2 Enterprise
     Loaded: loaded (/lib/systemd/system/zabbix-agent2.service; enabled)
     Active: active (running) since Thu 2026-11-19 04:00:12 EST; 13h ago
       Docs: man:zabbix_agent2(8)
   Main PID: 1248 (zabbix_agent2)
      Tasks: 14 (limit: 4915)
     Memory: 68.4M (limit: 512.0M)
        CPU: 1.42s
   Poller 1: ACTIVE (1,250 devices discovered, 0 unreachable)
   SNMP Traps: 4,819 received, 0 dropped`
        });
        break;

      case 'zabbix-get': {
        const key = arg1 || 'system.cpu.load[all,avg1]';
        newLogs.push({
          type: 'output',
          text: `[KEY: ${key}] => 0.45`
        });
        break;
      }

      default:
        newLogs.push({
          type: 'error',
          text: `zsh: command not found: ${cmd}. Type 'help' for available commands.`
        });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx >= history.length) {
          setHistoryIdx(-1);
          setInputVal('');
        } else {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx]);
        }
      }
    }
  };

  const quickCommands = [
    'ping 10.10.1.1',
    'show interfaces',
    'show routes',
    'show alerts',
    'status',
    'clear'
  ];

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <TerminalIcon className="w-4 h-4" />
            </div>
            <span>Zabbix CLI Diagnostics Console</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time interactive shell to query router interfaces, routing tables, and agent SNMP triggers.
          </p>
        </div>

        {/* Quick shortcut pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400 hidden md:inline">Quick Run:</span>
          {quickCommands.map((q) => (
            <button
              key={q}
              onClick={() => handleCommand(q)}
              className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 border border-slate-700/60 transition-colors"
            >
              {q}
            </button>
          ))}
          <button
            onClick={() => setLogs([])}
            title="Clear Console Output"
            className="p-1.5 rounded-md bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-colors ml-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Window Container */}
      <div className="bg-[#0B1120] border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[580px] max-h-[720px]">
        {/* Terminal Title Bar */}
        <div className="h-10 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between select-none">
          {/* Traffic light window controls */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600"></span>
            <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline">
              koi-admin@edge-core: ~ (bash / zabbix-diag)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              PORT 10051 CONNECTED
            </span>
            <span className="text-[11px] font-mono text-slate-500">v6.4.12</span>
          </div>
        </div>

        {/* Terminal Log Output Area */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-200 space-y-2 select-text cursor-text bg-gradient-to-b from-[#0B1120] to-[#0D1527]"
        >
          {logs.map((item, idx) => {
            if (item.type === 'banner') {
              return (
                <pre key={idx} className="text-cyan-400 font-mono text-[11px] leading-relaxed opacity-90 select-none">
                  {item.text}
                </pre>
              );
            }
            if (item.type === 'system') {
              return (
                <div key={idx} className="text-emerald-400/90 font-mono text-xs">
                  {item.text}
                </div>
              );
            }
            if (item.type === 'input') {
              return (
                <div key={idx} className="text-slate-100 font-mono font-medium pt-1 flex items-center gap-1">
                  <span className="text-cyan-400">❯</span>
                  <span>{item.text}</span>
                </div>
              );
            }
            if (item.type === 'error') {
              return (
                <div key={idx} className="text-rose-400 font-mono whitespace-pre-wrap pl-3 border-l-2 border-rose-500/40">
                  {item.text}
                </div>
              );
            }
            return (
              <pre key={idx} className="text-slate-300 font-mono whitespace-pre-wrap pl-3 border-l-2 border-slate-700/60 leading-relaxed">
                {item.text}
              </pre>
            );
          })}
          <div ref={terminalBottomRef} />
        </div>

        {/* Terminal Input Line */}
        <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-xs font-semibold pl-1 select-none flex items-center gap-1">
            <span>koi-admin@gateway:~$</span>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="Type 'help' or command..."
            className="flex-1 bg-transparent font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
          />
          <button
            onClick={() => handleCommand(inputVal)}
            className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded text-xs font-mono border border-cyan-500/40 flex items-center gap-1 transition-colors"
          >
            <span>Execute</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
