import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import KpiCards from './components/KpiCards';
import TopologyMap from './components/TopologyMap';
import ActiveSessions from './components/ActiveSessions';
import ThroughputMonitors from './components/ThroughputMonitors';
import DeviceTable from './components/DeviceTable';
import AlertsDrawer from './components/AlertsDrawer';
import CliConsole from './components/CliConsole';
import SettingsView from './components/SettingsView';
import AlertsView from './components/AlertsView';
import { kpiMetrics } from './data/mockData';
import { ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [targetHighlight, setTargetHighlight] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [highlightedDeviceId, setHighlightedDeviceId] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  const isProgrammaticScrollRef = useRef(false);

  const handleRefresh = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastRefreshed(timeStr);
  };

  // Central navigation handler for left sidebar items
  const handleNavigation = (tabId) => {
    setActiveTab(tabId);

    // Dedicated full views
    if (tabId === 'terminal' || tabId === 'settings' || tabId === 'alerts') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Dashboard sections
    const sectionMap = {
      dashboard: 'dashboard-section',
      topology: 'topology-section',
      firewalls: 'firewall-status-section',
      throughput: 'throughput-section',
      sessions: 'active-sessions-section',
    };

    const targetId = sectionMap[tabId];
    if (tabId !== 'dashboard') {
      setTargetHighlight(tabId);
      setTimeout(() => setTargetHighlight(null), 1800);
    }

    isProgrammaticScrollRef.current = true;

    const performScroll = () => {
      if (tabId === 'dashboard') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 900);
    };

    // If currently rendering another view, wait for dashboard elements to mount
    if (['terminal', 'settings', 'alerts'].includes(activeTab)) {
      setTimeout(performScroll, 60);
    } else {
      performScroll();
    }
  };

  // Device selection from alerts or maps
  const handleDeviceSelect = (id) => {
    setHighlightedDeviceId(id);
    handleNavigation('topology');
  };

  const handleKpiCardClick = (type) => {
    if (type === 'alerts') {
      setIsAlertsOpen(true);
    } else if (type === 'devices') {
      handleNavigation('firewalls');
    } else if (type === 'throughput') {
      handleNavigation('throughput');
    } else if (type === 'latency') {
      handleNavigation('topology');
    }
  };

  // Scroll spy to update active highlight state while scrolling on the dashboard
  useEffect(() => {
    const isDashboardSection = ['dashboard', 'topology', 'firewalls', 'throughput', 'sessions'].includes(activeTab);
    if (!isDashboardSection) return;

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      const scrollY = window.scrollY;
      if (scrollY < 120) {
        if (activeTab !== 'dashboard') {
          setActiveTab('dashboard');
        }
        return;
      }

      const row2El = document.getElementById('topology-section');
      const row3El = document.getElementById('throughput-section');

      if (!row2El || !row3El) return;

      const row2Rect = row2El.getBoundingClientRect();
      const row3Rect = row3El.getBoundingClientRect();

      // Row 3 is currently near top/visible
      if (row3Rect.top <= 260) {
        if (activeTab !== 'throughput' && activeTab !== 'firewalls') {
          setActiveTab('throughput');
        }
      } 
      // Row 2 is near top/visible
      else if (row2Rect.top <= 300) {
        if (activeTab !== 'topology' && activeTab !== 'sessions') {
          setActiveTab('topology');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const isDashboardView = ['dashboard', 'topology', 'firewalls', 'throughput', 'sessions'].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleNavigation}
        onNavigate={handleNavigation}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'pl-16' : 'pl-60'
        }`}
      >
        {/* Top Header */}
        <TopHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          alertsCount={15}
          onToggleAlerts={() => setIsAlertsOpen(!isAlertsOpen)}
          lastRefreshed={lastRefreshed}
          onRefresh={handleRefresh}
        />

        {/* Dashboard Body Container */}
        <main className="p-4 sm:p-6 lg:p-6 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Breadcrumb / Subtitle Header */}
          <div className="pt-1 pb-1 flex items-center justify-between">
            <h2 className="text-sm md:text-[15px] font-semibold text-slate-200 tracking-tight flex items-center gap-2 flex-wrap">
              <span>Enterprise Network &amp; Systems Monitoring (Zabbix Core)</span>
              <span className="text-slate-500 font-normal">|</span>
              {isDashboardView ? (
                <span className="text-cyan-400 font-normal">KOI - Firewall Monitoring Dashboard</span>
              ) : activeTab === 'alerts' ? (
                <span className="text-rose-400 font-normal">KOI - Security Alerts &amp; Triggers</span>
              ) : activeTab === 'terminal' ? (
                <span className="text-cyan-400 font-mono text-xs">KOI - CLI Diagnostic Shell [10.0.0.1]</span>
              ) : (
                <span className="text-slate-300 font-normal">KOI - System &amp; Polling Configuration</span>
              )}
            </h2>

            {!isDashboardView && (
              <button
                onClick={() => handleNavigation('dashboard')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Back to Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Conditional View Rendering */}
          {activeTab === 'terminal' ? (
            <CliConsole onNavigateDashboard={() => handleNavigation('dashboard')} />
          ) : activeTab === 'settings' ? (
            <SettingsView />
          ) : activeTab === 'alerts' ? (
            <AlertsView 
              onSelectDevice={handleDeviceSelect}
              onOpenDrawer={() => setIsAlertsOpen(true)}
            />
          ) : (
            <>
              {/* 4 KPI Cards in a row */}
              <section id="dashboard-section" aria-label="KPI Metrics" className="scroll-mt-24">
                <KpiCards 
                  metrics={kpiMetrics} 
                  onCardClick={handleKpiCardClick}
                />
              </section>

              {/* Row 2: Topology Map (Left) & Active Sessions (Right) */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Network Topology Map (approx 7 columns) */}
                <div 
                  id="topology-section" 
                  className={`lg:col-span-7 flex flex-col scroll-mt-24 transition-all duration-500 ${
                    targetHighlight === 'topology' ? 'ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/25 rounded-xl' : ''
                  }`}
                >
                  <TopologyMap 
                    onSelectDevice={handleDeviceSelect}
                    highlightedDeviceId={highlightedDeviceId}
                    searchQuery={searchQuery}
                  />
                </div>

                {/* Active Sessions Area Chart (approx 5 columns) */}
                <div 
                  id="active-sessions-section" 
                  className={`lg:col-span-5 flex flex-col scroll-mt-24 transition-all duration-500 ${
                    targetHighlight === 'sessions' ? 'ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/25 rounded-xl' : ''
                  }`}
                >
                  <ActiveSessions />
                </div>
              </section>

              {/* Row 3: Throughput Monitors (Left) & Firewall Link Status (Right) */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Throughput Monitors with Tabs (approx 6 columns) */}
                <div 
                  id="throughput-section" 
                  className={`lg:col-span-6 flex flex-col scroll-mt-24 transition-all duration-500 ${
                    targetHighlight === 'throughput' ? 'ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/25 rounded-xl' : ''
                  }`}
                >
                  <ThroughputMonitors />
                </div>

                {/* Firewall Link Status (approx 6 columns) */}
                <div 
                  id="firewall-status-section" 
                  className={`lg:col-span-6 flex flex-col scroll-mt-24 transition-all duration-500 ${
                    targetHighlight === 'firewalls' ? 'ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/25 rounded-xl' : ''
                  }`}
                >
                  <DeviceTable 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSelectDevice={handleDeviceSelect}
                    highlightedDeviceId={highlightedDeviceId}
                  />
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {/* Alerts Flyout Drawer */}
      <AlertsDrawer 
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onSelectDevice={handleDeviceSelect}
      />
    </div>
  );
}
