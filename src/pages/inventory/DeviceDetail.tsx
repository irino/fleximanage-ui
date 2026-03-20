
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDevice, type Device } from '../../api/devices';
import { ArrowLeft, Cpu, Globe, HardDrive, Info, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../Members.css';

const DeviceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [device, setDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchDeviceDetail(id);
        }
    }, [id]);

    const fetchDeviceDetail = async (deviceId: string) => {
        try {
            setLoading(true);
            const data = await getDevice(deviceId);
            setDevice(data);
        } catch (err) {
            console.error('Failed to fetch device detail:', err);
            setError(err instanceof Error ? err.message : 'Failed to load device details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-loading">{t('Loading...')}</div>;
    if (error) return <div className="page-error">{error}</div>;
    if (!device) return <div className="page-error">Device not found.</div>;

    return (
        <div className="members-container">
            <div className="members-header">
                <div className="members-title">
                    <div className="flex-center gap-4">
                        <button onClick={() => navigate('/inventory/devices')} className="action-icon-btn">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex-center gap-3">
                                <h1>{device.name}</h1>
                                <span className={`status-badge ${device.isConnected ? 'status-online' : 'status-offline'}`}>
                                    {device.isConnected ? t('Online') : t('Offline')}
                                </span>
                            </div>
                            <p className="subtitle">{t('Hostname')}: {device.hostname || 'N/A'} • {device.machineId}</p>
                        </div>
                    </div>
                </div>
                <div className="members-actions">
                    <button className="btn-secondary text-danger border-danger">
                        <Trash2 size={18} />
                        <span>{t('Delete Device')}</span>
                    </button>
                </div>
            </div>

            <div className="detail-grid">
                {/* Device Overview */}
                <div className="card detail-card">
                    <h3 className="detail-section-title">
                        <HardDrive size={18} className="text-primary" />
                        {t('Device Overview')}
                    </h3>
                    <div className="detail-info-grid">
                        <div className="info-item">
                            <label className="info-label">{t('Model/Type')}</label>
                            <div className="info-value">{device.description || 'FlexiEdge Device'}</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Site')}</label>
                            <div className="info-value">{device.site || 'Unassigned'}</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Approval Status')}</label>
                            <div className={`info-value flex-center gap-2 ${device.isApproved ? 'text-success' : 'text-warning'}`}>
                                {device.isApproved ? <CheckCircle2 size={16} /> : <Info size={16} />}
                                <span>{device.isApproved ? t('Approved') : t('Pending Approval')}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Sync Status')}</label>
                            <div className="info-value">{device.sync || 'Synced'}</div>
                        </div>
                    </div>
                </div>

                {/* Software Versions */}
                <div className="card detail-card">
                    <h3 className="detail-section-title">
                        <Cpu size={18} className="text-success" />
                        {t('Software Versions')}
                    </h3>
                    <div className="detail-info-grid">
                        <div className="info-item">
                            <label className="info-label">{t('Agent Version')}</label>
                            <code className="version-code">{device.versions?.agent || 'N/A'}</code>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Router Version')}</label>
                            <code className="version-code">{device.versions?.router || 'N/A'}</code>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Device Version')}</label>
                            <code className="version-code">{device.versions?.device || 'N/A'}</code>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('VPP Version')}</label>
                            <code className="version-code">{device.versions?.vpp || 'N/A'}</code>
                        </div>
                    </div>
                </div>

                {/* Network Interfaces */}
                <div className="card detail-card full-width">
                    <h3 className="detail-section-title">
                        <Globe size={18} className="text-info" />
                        {t('Network Interfaces')}
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="members-table plain-table">
                            <thead>
                                <tr>
                                    <th>{t('Interface')}</th>
                                    <th>{t('Type')}</th>
                                    <th>{t('IPv4 Address')}</th>
                                    <th>{t('Public IP')}</th>
                                    <th>{t('Status')}</th>
                                    <th>{t('MAC Address')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {device.interfaces?.map((iface, idx) => (
                                    <tr key={iface._id || idx}>
                                        <td className="font-bold">{iface.name}</td>
                                        <td><span className="status-badge">{iface.type || 'Ethernet'}</span></td>
                                        <td><code className="ip-code">{iface.IPv4 || '-'}</code></td>
                                        <td><code className="ip-code">{iface.PublicIP || '-'}</code></td>
                                        <td>
                                            <div className={`flex-center gap-2 ${iface.linkStatus === 'up' ? 'text-success' : 'text-danger'}`}>
                                                {iface.linkStatus === 'up' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                                <span className="font-bold text-xs uppercase">{iface.linkStatus}</span>
                                            </div>
                                        </td>
                                        <td><code className="mac-code">{iface.mac || '-'}</code></td>
                                    </tr>
                                ))}
                                {(!device.interfaces || device.interfaces.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="empty-text">No interfaces reported.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetail;
