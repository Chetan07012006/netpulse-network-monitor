# NetPulse — Enterprise Network Status & Device Monitoring Dashboard

A Cisco/Zabbix-inspired network infrastructure and telemetry monitoring dashboard built with **React**, **Vite**, and **Tailwind CSS**.

## Key Features
- **Executive Overview:** Real-time KPI summary cards for total active devices, network latency, peak throughput, and critical/warning alert counts.
- **Network Topology Map:** Interactive L2/L3 fabric visualization showing core routers, firewalls, edge servers, and link health states.
- **Throughput & Active Sessions:** Inbound/outbound bandwidth monitors and session volume charts.
- **Security Alerts & Trigger Queue:** Filterable live alerts view with severity tags (`CRITICAL`, `WARNING`) and acknowledgement controls.
- **Zabbix CLI Diagnostics Console:** Interactive diagnostic shell supporting commands like `ping`, `show interfaces`, `show routes`, `status`, and `show alerts`.
- **System & Polling Configuration:** Settings panel for gateway endpoints, refresh intervals, alert thresholds, and webhook channels.

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- Lucide React Icons

## Run Locally
```bash
git clone [https://github.com/Chetan07012006/netpulse-network-monitor.git](https://github.com/Chetan07012006/netpulse-network-monitor.git)
cd netpulse-network-monitor
npm install
npm run dev
