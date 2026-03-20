
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDevices, type Device } from '../../api/devices';
import { HardDrive, Search, Plus, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../Members.css';

const Devices: React.FC = () => {
    const { t } = useTranslation();
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadDevices();
    }, []);


    const loadDevices = async () => {
        try {
            setLoading(true);
            const data = await getDevices();
            setDevices(data);
        } catch (err) {
            console.error('Failed to fetch devices:', err);
            setError(err instanceof Error ? err.message : 'Failed to load devices');
        } finally {
            setLoading(false);
        }
    };

    const filteredDevices = devices.filter(device =>
        device.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.hostname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.machineId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="members-container" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading devices...</div>;
    if (error) return <div className="members-container" style={{ padding: '2rem' }}><div style={{ padding: '1.5rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>Error: {error}</div></div>;

    return (
        <div className="members-container">
            <div className="members-header">
                <div className="members-title">
                    <h1>
                        <HardDrive className="text-primary" size={28} />
                        {t('Devices')}
                    </h1>
                    <p className="subtitle">{t('Device Description')}</p>
                </div>
                <div className="members-actions">
                    <button className="btn-primary" onClick={() => navigate('/inventory/register')}>
                        <Plus size={18} />
                        <span>{t('Create Dummy Device')}</span>
                    </button>
                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder={t('Search devices...')}
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card members-table-container">
                <div className="overflow-x-auto">
                    <table className="members-table">
                        <thead>
                            <tr>
                                <th>{t('Hostname')}</th>
                                <th>{t('Connection Status')}</th>
                                <th>{t('IP Address')}</th>
                                <th>Site / Org</th>
                                <th>{t('Version')}</th>
                                <th style={{ width: '80px' }}>{t('Details')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDevices.map((device) => {
                                const publicIP = device.interfaces?.find(i => i.PublicIP)?.PublicIP || '-';

                                return (
                                    <tr key={device._id}>
                                        <td>
                                            <div className="device-info-cell">
                                                <div className={`status-dot ${device.isConnected ? 'online' : 'offline'}`} />
                                                <div className="name-box">
                                                    <Link to={`/inventory/devices/${device._id}`} className="entity-link">
                                                        {device.name}
                                                    </Link>
                                                    <span className="sub-text">{device.hostname}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${device.isConnected ? 'status-online' : 'status-offline'}`}>
                                                {device.isConnected ? t('Online') : t('Offline')}
                                            </span>
                                        </td>
                                        <td>
                                            <code className="ip-code">{publicIP}</code>
                                        </td>
                                        <td>
                                            <div className="org-cell">
                                                <span className="site-name">{device.site || 'Default Site'}</span>
                                                <span className="org-id">{device.org?.substring(0, 8)}...</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="version-cell">
                                                <span className="version-tag">A: {device.versions?.agent || '-'}</span>
                                                <span className="version-tag secondary">R: {device.versions?.router || '-'}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Link to={`/inventory/devices/${device._id}`} className="action-icon-btn">
                                                <List size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Devices;

