import React from 'react';
import {
    Server,
    Activity,
    AlertTriangle,
    Wifi,
    Globe
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import TrafficChart from '../components/dashboard/TrafficChart';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="text-2xl font-bold text-slate-800">Network Overview</h1>
                <p className="text-slate-500">Real-time monitoring of your SD-WAN infrastructure</p>
            </div>

            {/* Key Metrics */}
            <div className="stats-grid">
                <StatCard
                    title="Total Devices"
                    value="124"
                    icon={<Server size={24} />}
                    trend={{ value: 12, label: 'since last month', direction: 'up' }}
                />
                <StatCard
                    title="Online Status"
                    value="118"
                    icon={<Wifi size={24} className="text-green-500" />}
                    trend={{ value: 95, label: 'uptime', direction: 'neutral' }}
                />
                <StatCard
                    title="Active Tunnels"
                    value="342"
                    icon={<Globe size={24} className="text-blue-500" />}
                    trend={{ value: 5, label: 'new connections', direction: 'up' }}
                />
                <StatCard
                    title="Critical Alerts"
                    value="3"
                    icon={<AlertTriangle size={24} className="text-red-500" />}
                    trend={{ value: 2, label: 'new today', direction: 'down' }}
                />
            </div>

            {/* Traffic & Analytics */}
            <div className="charts-section">
                <div className="chart-card">
                    <div className="chart-header">
                        <h2 className="chart-title">Network Traffic</h2>
                    </div>
                    <TrafficChart />
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <h2 className="chart-title">System Health</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Activity className="text-blue-500" size={20} />
                                <span className="font-medium text-slate-700">CPU Usage</span>
                            </div>
                            <span className="font-bold text-slate-900">42%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Server className="text-purple-500" size={20} />
                                <span className="font-medium text-slate-700">Memory</span>
                            </div>
                            <span className="font-bold text-slate-900">68%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Globe className="text-green-500" size={20} />
                                <span className="font-medium text-slate-700">Disk I/O</span>
                            </div>
                            <span className="font-bold text-slate-900">12%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
