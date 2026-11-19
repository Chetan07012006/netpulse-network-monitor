export const kpiMetrics = {
  totalDevices: {
    total: 1250,
    active: 1245,
    down: 5,
    label: "Total Devices (Up/Down)"
  },
  avgLatency: {
    value: 45,
    unit: "ms",
    label: "Avg. Network Latency",
    sparkline: [42, 44, 45, 43, 46, 45, 44, 45, 47, 45, 44, 45]
  },
  peakThroughput: {
    value: "8.2 Gbps",
    timestamp: "14:30 EST",
    label: "Peak Today's Throughput",
    utilizationSegments: 14, // 14 segments
    activeSegments: 11
  },
  alertCount: {
    total: 15,
    critical: 3,
    warning: 12,
    label: "Alert Count (Critical/Warning)"
  }
};

export const topologyNodes = [
  {
    id: "core-rtr",
    name: "CORE-RTR",
    type: "router",
    status: "up", // up, degraded, down
    ip: "10.0.0.1",
    model: "Cisco ASR 1001",
    role: "Core Backbone Router",
    location: "Data Center 1 - Rack A4",
    uptime: "99.98%",
    cpu: 38,
    memory: 54,
    temp: "36°C",
    latency: "1.2ms",
    inbound: "4.8 Gbps",
    outbound: "4.5 Gbps",
    x: 350,
    y: 220
  },
  {
    id: "hq-fw-01",
    name: "HQ-FW-01",
    type: "firewall",
    status: "up",
    ip: "10.10.1.1",
    model: "FortiGate 600E",
    role: "Perimeter Security Gateway",
    location: "HQ Building - Server Rm 2",
    uptime: "99.99%",
    cpu: 45,
    memory: 62,
    temp: "41°C",
    latency: "8.4ms",
    inbound: "1.8 Gbps",
    outbound: "1.2 Gbps",
    x: 210,
    y: 100
  },
  {
    id: "dc-fw-02",
    name: "DC-FW-02",
    type: "firewall",
    status: "up",
    ip: "10.20.1.1",
    model: "FortiGate 600E",
    role: "DC Ingress Firewall",
    location: "Data Center 2 - Rack B1",
    uptime: "99.95%",
    cpu: 52,
    memory: 68,
    temp: "43°C",
    latency: "12.1ms",
    inbound: "2.4 Gbps",
    outbound: "2.1 Gbps",
    x: 490,
    y: 100
  },
  {
    id: "db-server-01",
    name: "DB-Server-01",
    type: "server",
    status: "up",
    ip: "10.30.2.14",
    model: "HPE ProLiant DL380 Gen10",
    role: "Primary Cluster Database",
    location: "Data Center 1 - Rack C2",
    uptime: "99.99%",
    cpu: 64,
    memory: 82,
    temp: "39°C",
    latency: "2.3ms",
    inbound: "1.1 Gbps",
    outbound: "1.9 Gbps",
    x: 210,
    y: 330
  },
  {
    id: "edge-router",
    name: "Edge-Router",
    type: "router",
    status: "up",
    ip: "10.0.1.254",
    model: "Cisco ASR 1001",
    role: "WAN Edge Gateway",
    location: "Colo Facility - Cage 7",
    uptime: "99.91%",
    cpu: 41,
    memory: 49,
    temp: "37°C",
    latency: "15.6ms",
    inbound: "3.2 Gbps",
    outbound: "3.0 Gbps",
    x: 350,
    y: 370
  },
  {
    id: "app-server-02",
    name: "App-Server-02",
    type: "server",
    status: "degraded",
    ip: "10.30.3.50",
    model: "Dell PowerEdge R750",
    role: "Production App Node 02",
    location: "Data Center 2 - Rack D4",
    uptime: "98.42%",
    cpu: 91,
    memory: 89,
    temp: "58°C (High)",
    latency: "84.2ms",
    inbound: "0.6 Gbps",
    outbound: "0.4 Gbps",
    alertMessage: "High CPU threshold (>90%) & Interface packet drop rate elevated (2.4%)",
    x: 490,
    y: 330
  }
];

export const topologyLinks = [
  { source: "core-rtr", target: "hq-fw-01", status: "up", bandwidth: "10 Gbps", load: "34%" },
  { source: "core-rtr", target: "dc-fw-02", status: "up", bandwidth: "10 Gbps", load: "52%" },
  { source: "core-rtr", target: "db-server-01", status: "up", bandwidth: "40 Gbps", load: "42%" },
  { source: "core-rtr", target: "edge-router", status: "up", bandwidth: "20 Gbps", load: "61%" },
  { source: "core-rtr", target: "app-server-02", status: "degraded", bandwidth: "10 Gbps", load: "89%" }
];

export const activeSessionsData = [
  { time: "00:00", sessions: 48500 },
  { time: "02:00", sessions: 41200 },
  { time: "04:00", sessions: 33400 },
  { time: "06:00", sessions: 40100 },
  { time: "08:00", sessions: 54600 },
  { time: "10:00", sessions: 67200 },
  { time: "12:00", sessions: 71800 },
  { time: "14:00", sessions: 68450 },
  { time: "16:00", sessions: 63100 },
  { time: "18:00", sessions: 57900 },
  { time: "20:00", sessions: 62400 },
  { time: "22:00", sessions: 59300 }
];

export const throughputInboundData = [
  { time: "00:00", throughput: 2.8 },
  { time: "03:00", throughput: 2.3 },
  { time: "06:00", throughput: 3.5 },
  { time: "09:00", throughput: 5.1 },
  { time: "12:00", throughput: 6.9 },
  { time: "15:00", throughput: 7.9 },
  { time: "18:00", throughput: 7.2 },
  { time: "21:00", throughput: 5.2 },
  { time: "24:00", throughput: 4.4 }
];

export const throughputOutboundData = [
  { time: "00:00", throughput: 2.1 },
  { time: "03:00", throughput: 1.8 },
  { time: "06:00", throughput: 2.9 },
  { time: "09:00", throughput: 4.6 },
  { time: "12:00", throughput: 6.2 },
  { time: "15:00", throughput: 8.2 },
  { time: "18:00", throughput: 6.8 },
  { time: "21:00", throughput: 4.8 },
  { time: "24:00", throughput: 3.9 }
];

export const firewallDevices = [
  {
    id: "hq-fw-01",
    name: "HQ-FW-01",
    model: "FortiGate 600E",
    link1: "UP",
    link2: "UP",
    vpn: "UP",
    ip: "10.10.1.1",
    location: "Headquarters",
    latency: "9ms",
    packetLoss: "0.00%",
    traffic: "1.8 Gbps"
  },
  {
    id: "dc-fw-02",
    name: "DC-FW-02",
    model: "FortiGate 600E",
    link1: "UP",
    link2: "UP",
    vpn: "UP",
    ip: "10.20.1.1",
    location: "Data Center East",
    latency: "12ms",
    packetLoss: "0.01%",
    traffic: "2.4 Gbps"
  },
  {
    id: "branch-fw-03",
    name: "BRANCH-FW-03",
    model: "FortiGate 200F",
    link1: "UP",
    link2: "DEGRADED",
    vpn: "UP",
    ip: "10.40.1.1",
    location: "London Branch Office",
    latency: "46ms",
    packetLoss: "1.40%",
    traffic: "450 Mbps"
  },
  {
    id: "core-rtr-01",
    name: "CORE-RTR-01",
    model: "Cisco ASR 1001",
    link1: "UP",
    link2: "UP",
    vpn: "UP",
    ip: "10.0.0.1",
    location: "Core Distribution",
    latency: "1.2ms",
    packetLoss: "0.00%",
    traffic: "4.8 Gbps"
  },
  {
    id: "edge-rtr-02",
    name: "EDGE-RTR-02",
    model: "Cisco ASR 1001",
    link1: "UP",
    link2: "UP",
    vpn: "UP",
    ip: "10.0.1.254",
    location: "Edge Transit POP",
    latency: "15ms",
    packetLoss: "0.00%",
    traffic: "3.2 Gbps"
  },
  {
    id: "backup-fw-04",
    name: "BACKUP-FW-04",
    model: "Palo Alto PA-3220",
    link1: "UP",
    link2: "UP",
    vpn: "UP",
    ip: "10.50.1.1",
    location: "Disaster Recovery Site",
    latency: "18ms",
    packetLoss: "0.00%",
    traffic: "380 Mbps"
  },
  {
    id: "cloud-gw-01",
    name: "CLOUD-GW-01",
    model: "Cisco Catalyst 8300",
    link1: "UP",
    link2: "UP",
    vpn: "UP",
    ip: "172.16.0.1",
    location: "AWS Direct Connect",
    latency: "6ms",
    packetLoss: "0.00%",
    traffic: "2.8 Gbps"
  },
  {
    id: "branch-fw-04",
    name: "BRANCH-FW-04",
    model: "FortiGate 80F",
    link1: "UP",
    link2: "DOWN",
    vpn: "UP",
    ip: "10.45.1.1",
    location: "Singapore Regional Office",
    latency: "142ms",
    packetLoss: "3.10%",
    traffic: "180 Mbps"
  }
];

export const liveAlerts = [
  {
    id: "alt-001",
    severity: "critical",
    title: "Interface Flapping & Packet Loss",
    device: "BRANCH-FW-04",
    message: "Secondary WAN link (Link 2) down; failover active",
    timestamp: "14:28:12 EST",
    acknowledged: false
  },
  {
    id: "alt-002",
    severity: "critical",
    title: "High CPU Spike (>90%)",
    device: "App-Server-02",
    message: "CPU utilization sustained at 91% for 12 minutes",
    timestamp: "14:15:00 EST",
    acknowledged: false
  },
  {
    id: "alt-003",
    severity: "critical",
    title: "BGP Peer Flap Detected",
    device: "EDGE-RTR-02",
    message: "AS64512 neighbor 198.51.100.1 reset connection",
    timestamp: "13:58:44 EST",
    acknowledged: true
  },
  {
    id: "alt-004",
    severity: "warning",
    title: "Link 2 High Jitter",
    device: "BRANCH-FW-03",
    message: "Latency jitter increased to 46ms with 1.4% drops",
    timestamp: "14:22:19 EST",
    acknowledged: false
  },
  {
    id: "alt-005",
    severity: "warning",
    title: "Memory Allocation Threshold",
    device: "DC-FW-02",
    message: "Session state table utilization exceeds 68%",
    timestamp: "14:05:30 EST",
    acknowledged: false
  },
  {
    id: "alt-006",
    severity: "warning",
    title: "SSL-VPN Concurrent Users Peak",
    device: "HQ-FW-01",
    message: "Active SSL-VPN tunnels reached 820 of 1,000 licensed",
    timestamp: "13:45:10 EST",
    acknowledged: true
  }
];
