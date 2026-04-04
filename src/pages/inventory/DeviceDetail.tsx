import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDevice, updateDevice, deleteDevice, type Device } from '../../api/devices';
import { getOrganizations, type Organization } from '../../api/organizations';
import { getAccounts, type Account } from '../../api/accounts';
import { ArrowLeft, Cpu, Globe, HardDrive, Info, Trash2, CheckCircle2, XCircle, Save, Edit2, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../Members.css';

const DeviceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [device, setDevice] = useState<Device | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // For editing
    const [editedFields, setEditedFields] = useState<Partial<Device>>({});

    useEffect(() => {
        if (id) {
            fetchInitialData(id);
        }
    }, [id]);

    const fetchInitialData = async (deviceId: string) => {
        try {
            setLoading(true);
            const [deviceData, orgsData, accsData] = await Promise.all([
                getDevice(deviceId),
                getOrganizations().catch(() => []),
                getAccounts().catch(() => [])
            ]);
            setDevice(deviceData);
            setOrganizations(orgsData);
            setAccounts(accsData);
            setEditedFields(deviceData);
        } catch (err) {
            console.error('Failed to fetch initial data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (field: keyof Device, value: any) => {
        setEditedFields(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        if (!id || !device) return;
        try {
            setLoading(true);
            const updated = await updateDevice(id, editedFields);
            setDevice(updated);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update device:', err);
            alert('Failed to update device');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!id || !device) return;
        try {
            setLoading(true);
            const updated = await updateDevice(id, { isApproved: true });
            setDevice(updated);
            setEditedFields(updated);
        } catch (err) {
            console.error('Failed to approve device:', err);
            alert('Failed to approve device');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (!window.confirm(t('Are you sure you want to delete this device?'))) return;

        try {
            setLoading(true);
            await deleteDevice(id);
            navigate('/inventory/devices');
        } catch (err) {
            console.error('Failed to delete device:', err);
            alert('Failed to delete device');
            setLoading(false);
        }
    };

    if (loading && !device) return <div className="page-loading">{t('Loading...')}</div>;
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
                                {isEditing ? (
                                    <input
                                        className="search-input"
                                        value={editedFields.name || ''}
                                        onChange={(e) => handleFieldChange('name', e.target.value)}
                                        style={{ fontSize: '1.5rem', fontWeight: 'bold', border: '1px solid #ddd' }}
                                    />
                                ) : (
                                    <h1>{device.name || device.hostname || 'Unnamed Device'} {device.serial && <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>({device.serial})</span>}</h1>
                                )}
                                <span className={`status-badge ${device.isConnected ? 'status-online' : 'status-offline'}`}>
                                    {device.isConnected ? t('Online') : t('Offline')}
                                </span>
                                <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                                    {device.state?.toUpperCase()}
                                </span>
                            </div>
                            <p className="subtitle">{t('Machine ID')}: {device.machineId}</p>
                        </div>
                    </div>
                </div>
                <div className="members-actions">
                    {!device.isApproved && (
                        <button className="btn-primary" onClick={handleApprove} style={{ backgroundColor: '#10b981', borderColor: '#059669' }}>
                            <ShieldCheck size={18} />
                            <span>{t('Approve')}</span>
                        </button>
                    )}
                    {isEditing ? (
                        <>
                            <button className="btn-primary" onClick={handleUpdate} disabled={loading}>
                                <Save size={18} />
                                <span>{t('Save')}</span>
                            </button>
                            <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                                {t('Cancel')}
                            </button>
                        </>
                    ) : (
                        <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                            <Edit2 size={18} />
                            <span>{t('Edit')}</span>
                        </button>
                    )}
                    <button className="btn-secondary text-danger border-danger" onClick={handleDelete} disabled={loading}>
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
                            <label className="info-label">{t('Description')}</label>
                            {isEditing ? (
                                <textarea
                                    className="search-input"
                                    value={editedFields.description || ''}
                                    onChange={(e) => handleFieldChange('description', e.target.value)}
                                    style={{ width: '100%', minHeight: '60px' }}
                                />
                            ) : (
                                <div className="info-value">{device.description || '-'}</div>
                            )}
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Site')}</label>
                            {isEditing ? (
                                <input
                                    className="search-input"
                                    value={editedFields.site || ''}
                                    onChange={(e) => handleFieldChange('site', e.target.value)}
                                />
                            ) : (
                                <div className="info-value">{device.site || 'Unassigned'}</div>
                            )}
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Organization')}</label>
                            <div className="info-value">
                                <span className="font-bold">{organizations.find(o => o._id === device.org)?.name || t('Unknown Organization')}</span>
                                <div className="text-xs text-muted mono">{device.org} (VXLAN Port: {device.orgInfo?.vxlanPort})</div>
                            </div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Account')}</label>
                            <div className="info-value">
                                <span className="font-bold">{accounts.find(a => a._id === device.account)?.name || t('Unknown Account')}</span>
                                <div className="text-xs text-muted mono">{device.account}</div>
                            </div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('IP List')}</label>
                            <div className="info-value mono">{device.ipList || '-'}</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Approval Status')}</label>
                            <div className={`info-value flex-center gap-2 ${device.isApproved ? 'text-success' : 'text-warning'}`}>
                                {device.isApproved ? <CheckCircle2 size={16} /> : <Info size={16} />}
                                <span>{device.isApproved ? t('Approved') : t('Pending Approval')}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Labels')}</label>
                            <div className="info-value">
                                {isEditing ? (
                                    <input
                                        className="search-input"
                                        placeholder="Label1, Label2"
                                        value={Array.isArray(editedFields.labels) ? editedFields.labels.join(', ') : ''}
                                        onChange={(e) => handleFieldChange('labels', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                    />
                                ) : (
                                    <>
                                        {device.labels?.length > 0 ? (
                                            <div className="flex gap-1 flex-wrap">
                                                {device.labels.map((l, i) => <span key={i} className="version-tag secondary">{l}</span>)}
                                            </div>
                                        ) : '-'}
                                    </>
                                )}
                            </div>
                        </div>
                        {device.coords && (
                            <div className="info-item">
                                <label className="info-label">{t('Coordinates')}</label>
                                <div className="info-value">{device.coords[0]}, {device.coords[1]}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Software & System */}
                <div className="card detail-card">
                    <h3 className="detail-section-title">
                        <Cpu size={18} className="text-success" />
                        {t('Software & System')}
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
                            <label className="info-label">{t('OS Distro')}</label>
                            <div className="info-value">{device.distro?.version} ({device.distro?.codename})</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('CPU Cores (HW/vPP)')}</label>
                            <div className="info-value">{device.cpuInfo?.hwCores} / {device.cpuInfo?.vppCores}</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Power Saving')}</label>
                            <div className="info-value">{device.cpuInfo?.powerSaving ? t('Enabled') : t('Disabled')}</div>
                        </div>
                    </div>
                </div>

                {/* Synchronization & Schedule */}
                <div className="card detail-card">
                    <h3 className="detail-section-title">
                        <Info size={18} className="text-info" />
                        {t('Synchronization & Schedule')}
                    </h3>
                    <div className="detail-info-grid">
                        <div className="info-item">
                            <label className="info-label">{t('Sync State')}</label>
                            <div className="info-value flex-center gap-2">
                                <span className={`status-dot ${device.sync?.state === 'synchronized' ? 'online' : 'away'}`} />
                                {device.sync?.state}
                            </div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Sync Hash')}</label>
                            <div className="info-value text-xs mono truncated" title={device.sync?.hash}>{device.sync?.hash?.substring(0, 12)}...</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Auto Sync')}</label>
                            <div className="info-value">{device.sync?.autoSync}</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Upgrade Job Queued')}</label>
                            <div className="info-value">{device.upgradeSchedule?.jobQueued ? t('Yes') : t('No')}</div>
                        </div>
                    </div>
                </div>

                {/* Policies & Status */}
                <div className="card detail-card">
                    <h3 className="detail-section-title">
                        <CheckCircle2 size={18} className="text-warning" />
                        {t('Policies & Security')}
                    </h3>
                    <div className="detail-info-grid">
                        <div className="info-item">
                            <label className="info-label">{t('Multilink Policy')}</label>
                            <div className="info-value">{device.policies?.multilink?.status || 'N/A'}</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Firewall Policy')}</label>
                            <div className="info-value">{device.policies?.firewall?.status || 'N/A'}</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('QoS Policy')}</label>
                            <div className="info-value">{device.policies?.qos?.status || 'N/A'}</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Device Specific Rules')}</label>
                            <div className="info-value">{device.deviceSpecificRulesEnabled ? t('Enabled') : t('Disabled')}</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Firewall Rules Count')}</label>
                            <div className="info-value">{device.firewall?.rules?.length || 0}</div>
                        </div>
                        <div className="info-item">
                            <label className="info-label">{t('Applications')}</label>
                            <div className="info-value">
                                {device.applications?.length > 0 ? (
                                    <div className="flex gap-1 flex-wrap">
                                        {device.applications.map((a, i) => <span key={i} className="version-tag secondary">{a}</span>)}
                                    </div>
                                ) : '-'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Routing Details */}
                <div className="card detail-card full-width">
                    <h3 className="detail-section-title">
                        <Globe size={18} className="text-primary" />
                        {t('Routing (OSPF/BGP)')}
                    </h3>
                    <div className="detail-info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="info-item">
                            <h4 className="text-xs font-bold uppercase mb-2">{t('OSPF Configuration')}</h4>
                            <div className="detail-info-grid" style={{ gap: '0.5rem' }}>
                                <div className="info-item">
                                    <label className="info-label">{t('Hello Interval')}</label>
                                    <div className="info-value">{device.ospf?.helloInterval}s</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">{t('Dead Interval')}</label>
                                    <div className="info-value">{device.ospf?.deadInterval}s</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">{t('Redistribute BGP')}</label>
                                    <div className="info-value">{device.ospf?.redistributeBgp ? t('Yes') : t('No')}</div>
                                </div>
                                {device.ospf?.custom && (
                                    <div className="info-item">
                                        <label className="info-label">{t('Custom Config')}</label>
                                        <div className="info-value text-xs mono truncated">{device.ospf.custom}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="info-item">
                            <h4 className="text-xs font-bold uppercase mb-2">{t('BGP Configuration')}</h4>
                            <div className="detail-info-grid" style={{ gap: '0.5rem' }}>
                                <div className="info-item">
                                    <label className="info-label">{t('Enabled')}</label>
                                    <div className="info-value">{device.bgp?.enable ? t('Yes') : t('No')}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">{t('Local ASN')}</label>
                                    <div className="info-value">{device.bgp?.localASN || '-'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">{t('Hold Interval')}</label>
                                    <div className="info-value">{device.bgp?.holdInterval}s</div>
                                </div>
                                {device.bgp?.custom && (
                                    <div className="info-item">
                                        <label className="info-label">{t('Custom Config')}</label>
                                        <div className="info-value text-xs mono truncated">{device.bgp.custom}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="info-item">
                            <h4 className="text-xs font-bold uppercase mb-2">{t('Other Routing')}</h4>
                            <div className="detail-info-grid" style={{ gap: '0.5rem' }}>
                                <div className="info-item">
                                    <label className="info-label">{t('Static Routes')}</label>
                                    <div className="info-value">{device.staticroutes?.length || 0}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">{t('DHCP Servers')}</label>
                                    <div className="info-value">{device.dhcp?.length || 0}</div>
                                </div>
                            </div>
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
                                    <th>{t('IPv4 / Mask')}</th>
                                    <th>{t('Public IP')}</th>
                                    <th>{t('Gateway / MTU')}</th>
                                    <th>{t('NAT / STUN')}</th>
                                    <th>{t('Routing')}</th>
                                    <th>{t('MAC Address')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {device.interfaces?.map((iface) => (
                                    <tr key={iface._id}>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{iface.name}</span>
                                                <span className="text-xs text-muted mono" style={{ whiteSpace: 'pre-wrap' }}>{iface.devId}</span>
                                            </div>
                                        </td>
                                        <td><span className={`status-badge ${iface.type === 'WAN' ? 'status-online' : 'status-offline'}`}>{iface.type}</span></td>
                                        <td>
                                            <div className="flex flex-col">
                                                <code className="ip-code">{iface.IPv4 || '-'}</code>
                                                {iface.IPv4Mask && <span className="text-xs text-muted">/ {iface.IPv4Mask}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <code className="ip-code">{iface.PublicIP || '-'}</code>
                                                {iface.PublicPort && <span className="text-xs text-muted">:{iface.PublicPort}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="info-value text-xs mono">
                                                {iface.gateway || '-'} / {iface.mtu || '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="info-value text-xs">
                                                {iface.NatType || '-'} / {iface.useStun ? 'STUN' : 'No STUN'}
                                            </span>
                                        </td>
                                        <td><span className="text-xs font-bold">{iface.routing}</span></td>
                                        <td><code className="mac-code">{iface.MAC || '-'}</code></td>
                                    </tr>
                                ))}
                                {(!device.interfaces || device.interfaces.length === 0) && (
                                    <tr>
                                        <td colSpan={8} className="empty-text">No interfaces reported.</td>
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
