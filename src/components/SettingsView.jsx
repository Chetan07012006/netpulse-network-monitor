import React, { useState } from 'react';
import { 
  Settings, 
  Server, 
  Clock, 
  Bell, 
  ShieldCheck, 
  Sliders, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Wifi, 
  ExternalLink,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsView() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showToken, setShowToken] = useState(false);

  // Form states
  const [serverHost, setServerHost] = useState('zabbix.koi-net.internal');
  const [serverPort, setServerPort] = useState('10051');
  const [apiToken, setApiToken] = useState('zbk_live_89f029cba8374112e094');
  const [pollInterval, setPollInterval] = useState('15');
  const [pingInterval, setPingInterval] = useState('5');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [cpuThreshold, setCpuThreshold] = useState(85);
  const [memoryThreshold, setMemoryThreshold] = useState(80);
  const [latencyThreshold, setLatencyThreshold] = useState(50);
  const [packetDropThreshold, setPacketDropThreshold] = useState(1.5);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [pagerdutyKey, setPagerdutyKey] = useState('pd_live_svc_984a112');

  const handleSave = (e) => {
    e?.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTestResult(null);
    setTimeout(() => {
      setTestingConnection(false);
      setTestResult({
        success: true,
        message: 'Connected to Zabbix Server 6.4.12. Response time: 1.4ms (TLS 1.3 Valid).'
      });
    }, 900);
  };

  const handleReset = () => {
    setServerHost('zabbix.koi-net.internal');
    setServerPort('10051');
    setPollInterval('15');
    setPingInterval('5');
    setAnimationsEnabled(true);
    setCpuThreshold(85);
    setMemoryThreshold(80);
    setLatencyThreshold(50);
    setPacketDropThreshold(1.5);
    setSavedSuccess(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings className="w-4 h-4" />
            </div>
            <span>System &amp; Polling Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure Zabbix Core agent connections, telemetry sampling rates, and security trigger thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Settings saved successfully. Configuration reloaded on Zabbix Gateway daemon.</span>
        </div>
      )}

      {/* Grid of Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Zabbix Server Connection */}
        <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Zabbix Server Core Gateway</h3>
                <p className="text-[11px] text-slate-400">API endpoint &amp; Agent Daemon handshake</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              ACTIVE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Server Hostname or IP</label>
              <input
                type="text"
                value={serverHost}
                onChange={(e) => setServerHost(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Daemon Port</label>
                <input
                  type="text"
                  value={serverPort}
                  onChange={(e) => setServerPort(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Agent Protocol</label>
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 font-mono text-xs">
                  SNMPv3 / TLS 1.3
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">API Secret / Bearer Token</label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-3 pr-10 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Wifi className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
                <span>{testingConnection ? 'Testing Gateway Handshake...' : 'Test Connection'}</span>
              </button>

              {testResult && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                  {testResult.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Telemetry & Polling Rates */}
        <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Telemetry &amp; Sampling Rates</h3>
                <p className="text-[11px] text-slate-400">Control frequency of metric refresh &amp; probes</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Metrics Refresh Cadence</span>
                <span className="font-mono text-cyan-400">{pollInterval} seconds</span>
              </div>
              <select
                value={pollInterval}
                onChange={(e) => setPollInterval(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="5">Every 5 seconds (Realtime Intensive)</option>
                <option value="15">Every 15 seconds (Recommended Default)</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 60 seconds</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">ICMP Ping Frequency</span>
                <span className="font-mono text-cyan-400">{pingInterval} seconds</span>
              </div>
              <select
                value={pingInterval}
                onChange={(e) => setPingInterval(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="2">2 seconds (High Sensitivity)</option>
                <option value="5">5 seconds (Standard)</option>
                <option value="10">10 seconds (Bandwidth Saver)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-slate-200 font-medium block">Topology Map Link Flow Animations</span>
                  <span className="text-slate-400 text-[11px]">Render animated packet pulses along active links</span>
                </div>
                <input
                  type="checkbox"
                  checked={animationsEnabled}
                  onChange={(e) => setAnimationsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 3. Security Trigger Thresholds */}
        <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Trigger &amp; Alert Thresholds</h3>
                <p className="text-[11px] text-slate-400">Configure trigger conditions for warning &amp; critical states</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-300 font-medium">CPU Utilization Warning Threshold</span>
                <span className="font-mono text-amber-400 font-bold">{cpuThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="98"
                value={cpuThreshold}
                onChange={(e) => setCpuThreshold(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-300 font-medium">Memory Allocation Warning Threshold</span>
                <span className="font-mono text-amber-400 font-bold">{memoryThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="98"
                value={memoryThreshold}
                onChange={(e) => setMemoryThreshold(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Latency Ceiling (ms)</label>
                <input
                  type="number"
                  value={latencyThreshold}
                  onChange={(e) => setLatencyThreshold(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Packet Drop Limit (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={packetDropThreshold}
                  onChange={(e) => setPacketDropThreshold(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Incident Integrations */}
        <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-5 shadow-lg shadow-slate-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Incident Channels &amp; Webhooks</h3>
                <p className="text-[11px] text-slate-400">Forward critical alerts to external channels</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Slack Incident Channel Webhook</label>
              <input
                type="text"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">PagerDuty Service Routing Key</label>
              <input
                type="password"
                value={pagerdutyKey}
                onChange={(e) => setPagerdutyKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Escalation Rule #1</span>
                  <span className="text-emerald-400">ENABLED</span>
                </div>
                <p>Alert triggers marked CRITICAL trigger immediate PagerDuty call after 180 seconds unacknowledged.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
