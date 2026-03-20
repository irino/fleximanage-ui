
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDevices, type Device } from '../api/devices';
import { getTunnels, type Tunnel } from '../api/tunnels';
import StatCard from '../components/dashboard/StatCard';
import { Server, Wifi, AlertTriangle, Activity, Link2 } from 'lucide-react';
import './Dashboard.css';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const [devices, setDevices] = useState<Device[]>([]);
    const [tunnels, setTunnels] = useState<Tunnel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [devicesData, tunnelsData] = await Promise.all([
                    getDevices(),
                    getTunnels()
                ]);
                setDevices(devicesData);
                setTunnels(tunnelsData);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError(t('Fetch Failed'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [t]);

    if (loading) return <div className="page-loading">{t('Loading...')}</div>;
    if (error) return <div className="page-error">{error}</div>;

    // Device Status Counts
    const connectedCount = devices.filter(d => d.isConnected).length;
    const notConnectedCount = devices.length - connectedCount;
    const approvedCount = devices.filter(d => d.isApproved).length;
    const notApprovedCount = devices.length - approvedCount;

    // Tunnel Status Counts
    const tunnelConnected = tunnels.filter(t => t.tunnelStatus === 'Connected').length;
    const tunnelNotConnected = tunnels.filter(t => t.tunnelStatus === 'Not Connected').length;
    const tunnelPending = tunnels.filter(t => t.tunnelStatus === 'Pending').length;
    const tunnelUnknown = tunnels.filter(t => t.tunnelStatus === 'Unknown').length;

    return (
        <div className="home-dashboard">
            <div className="dashboard-section">
                <h2 className="section-title">{t('Devices')}</h2>
                <div className="stats-grid">
                    <StatCard
                        title={t('Connected')}
                        value={connectedCount.toString()}
                        icon={<Wifi size={24} className="text-success" />}
                        trend={{ value: notConnectedCount, label: t('Not Connected'), direction: 'neutral' }}
                    />
                    <StatCard
                        title={t('Approved')}
                        value={approvedCount.toString()}
                        icon={<Server size={24} className="text-primary" />}
                        trend={{ value: notApprovedCount, label: t('Not Approved'), direction: 'neutral' }}
                    />
                </div>
            </div>

            <div className="dashboard-section" style={{ marginTop: '2.5rem' }}>
                <h2 className="section-title">Tunnels</h2>
                <div className="stats-grid">
                    <StatCard
                        title={t('Connected')}
                        value={tunnelConnected.toString()}
                        icon={<Link2 size={24} className="text-success" />}
                    />
                    <StatCard
                        title={t('Not Connected')}
                        value={tunnelNotConnected.toString()}
                        icon={<Link2 size={24} className="text-danger" />}
                    />
                    <StatCard
                        title={t('Pending')}
                        value={tunnelPending.toString()}
                        icon={<Activity size={24} className="text-warning" />}
                    />
                    <StatCard
                        title={t('Unknown')}
                        value={tunnelUnknown.toString()}
                        icon={<AlertTriangle size={24} className="text-muted" />}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;

