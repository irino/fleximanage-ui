
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, AlertTriangle, CheckCircle, Mail, Webhook,
    Info, Plus, Edit, Server, Globe, Shield, Settings2, Activity
} from 'lucide-react';
import { getNotificationConfDefault, updateNotificationConfDefault, type NotificationConf, type NotificationRule } from '../api/notifications';
import { getAccounts, type Account } from '../api/accounts';
import './Members.css';
import './Form.css';

// Exact default rules as requested
const DEFAULT_NOTIFICATION_RULES: Record<string, NotificationRule> = {
    "Device connection": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "device"
    },
    "Running router": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "device"
    },
    "Link/Tunnel round trip time": {
        "warningThreshold": 300,
        "criticalThreshold": 600,
        "thresholdUnit": "ms",
        "severity": null,
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "tunnel"
    },
    "Link/Tunnel default drop rate": {
        "warningThreshold": 5,
        "criticalThreshold": 20,
        "thresholdUnit": "%",
        "severity": null,
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "tunnel"
    },
    "Device memory usage": {
        "warningThreshold": 85,
        "criticalThreshold": 95,
        "thresholdUnit": "%",
        "severity": null,
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "device"
    },
    "Hard drive usage": {
        "warningThreshold": 85,
        "criticalThreshold": 95,
        "thresholdUnit": "%",
        "severity": null,
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "device"
    },
    "Temperature": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": "C°",
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "device"
    },
    "Software update": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "warning",
        "immediateEmail": false,
        "resolvedAlert": null,
        "sendWebHook": false,
        "type": "device"
    },
    "Internet connection": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "interface"
    },
    "Link status": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "interface"
    },
    "Missing interface ip": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "interface"
    },
    "Pending tunnel": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "tunnel"
    },
    "Tunnel connection": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "tunnel"
    },
    "Failed self-healing": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": null,
        "sendWebHook": false,
        "type": "device"
    },
    "Static route state": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": null,
        "sendWebHook": false,
        "type": "device"
    }
};

const NotificationSettings: React.FC = () => {
    const navigate = useNavigate();
    const [rules, setRules] = useState<Record<string, NotificationRule>>(DEFAULT_NOTIFICATION_RULES);
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isModify, setIsModify] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [accountsData, configData] = await Promise.allSettled([
                getAccounts(),
                getNotificationConfDefault()
            ]);

            const filtered = accountsData.status === 'fulfilled' ? accountsData.value.filter(a => a._id && a._id !== 'default') : [];
            setAccounts(filtered);

            if (configData.status === 'fulfilled' && configData.value) {
                setRules(configData.value.rules || DEFAULT_NOTIFICATION_RULES);
                setSelectedAccountId(configData.value.account || '');
                setIsModify(true);
            } else {
                setRules(DEFAULT_NOTIFICATION_RULES);
                setIsModify(false);
            }

            if (filtered.length > 0) {
                setSelectedAccountId(prev => {
                    if (prev && filtered.find(a => a._id === prev)) return prev;
                    return filtered[0]._id || '';
                });
            }
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to fetch settings data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            // Structure the payload exactly as expected by the backend schema (account + rules)
            const payload: NotificationConf = {
                account: selectedAccountId,
                rules: rules
            };

            await updateNotificationConfDefault(payload);
            setSuccess(`Notification settings successfully ${isModify ? 'updated' : 'created'}.`);
            setIsModify(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error performing operation');
        } finally {
            setSaving(false);
        }
    };

    const handleRuleChange = (name: string, field: keyof NotificationRule, value: any) => {
        setRules(prev => ({
            ...prev,
            [name]: {
                ...prev[name],
                [field]: value
            }
        }));
    };

    // Grouping rules for a better UI experience
    const groupedRules = useMemo(() => {
        const groups: Record<string, [string, NotificationRule][]> = {
            device: [],
            interface: [],
            tunnel: []
        };
        Object.entries(rules).forEach(([name, rule]) => {
            if (groups[rule.type]) {
                groups[rule.type].push([name, rule]);
            } else {
                groups.device.push([name, rule]); // fall back
            }
        });
        return groups;
    }, [rules]);

    if (loading) return (
        <div className="members-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginLeft: '1rem', color: '#64748b' }}>Initializing secure configuration...</p>
        </div>
    );

    return (
        <div className="members-container" style={{ maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header Section */}
            <div className="members-header" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button onClick={() => navigate(-1)} className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.6rem' }}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 style={{ margin: 0, color: 'white', fontSize: '1.75rem', fontWeight: 700 }}>Notification Center</h1>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>Define how the system alerts you across your infrastructure.</p>
                        </div>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                        style={{ background: isModify ? '#6366f1' : '#10b981', padding: '0.75rem 1.5rem', fontWeight: 600, boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}
                    >
                        {saving ? <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : (isModify ? <Edit size={18} /> : <Plus size={18} />)}
                        <span style={{ marginLeft: '0.5rem' }}>{saving ? 'Processing...' : (isModify ? 'Modify Settings' : 'Create Configuration')}</span>
                    </button>
                </div>
            </div>

            {/* Account Selector Section - Clean and integrated */}
            <div className="form-card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ background: '#f0f9ff', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    <Settings2 size={24} style={{ color: '#0ea5e9' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>TARGET ACCOUNT</label>
                    <select
                        className="form-input"
                        style={{ margin: 0, padding: '0.6rem 1rem', fontSize: '1rem' }}
                        value={selectedAccountId}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                    >
                        {accounts.map(acc => (
                            <option key={acc._id} value={acc._id}>{acc.name} ({acc._id})</option>
                        ))}
                    </select>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', width: '250px' }}>
                    Policies will be applied specifically to this account's resources.
                </div>
            </div>

            {/* Notifications and Alerts Section */}
            {error && (
                <div className="alert alert-error" style={{ marginBottom: '2rem', borderRadius: '0.75rem' }}>
                    <AlertTriangle size={20} />
                    <div style={{ marginLeft: '1rem' }}>
                        <strong>Validation Error:</strong> {error}
                    </div>
                </div>
            )}
            {success && (
                <div className="alert alert-success" style={{ marginBottom: '2rem', borderRadius: '0.75rem' }}>
                    <CheckCircle size={20} />
                    <div style={{ marginLeft: '1rem' }}>{success}</div>
                </div>
            )}

            {/* Grouped Rules Layout */}
            {Object.entries(groupedRules).map(([type, items]) => (
                <div key={type} style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {type === 'device' ? <Server size={22} color="#6366f1" /> : type === 'interface' ? <Globe size={22} color="#0ea5e9" /> : <Activity size={22} color="#f43f5e" />}
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, textTransform: 'capitalize', color: '#1e293b' }}>{type} Monitors</h2>
                        <div style={{ height: '1px', flex: 1, background: '#e2e8f0', marginLeft: '1rem' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                        {items.map(([name, rule]) => (
                            <div key={name} className="rule-card" style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.05rem' }}>{name}</div>
                                    <Shield size={18} style={{ color: rule.severity === 'critical' ? '#ef4444' : rule.severity === 'warning' ? '#f59e0b' : '#94a3b8' }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Criticality Row */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Global Severity</span>
                                        <select
                                            className="search-input"
                                            style={{ width: '120px', padding: '0.3rem', fontSize: '0.85rem', height: '32px' }}
                                            value={rule.severity || ''}
                                            onChange={(e) => handleRuleChange(name, 'severity', e.target.value || null)}
                                        >
                                            <option value="">None</option>
                                            <option value="warning">Warning</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>

                                    {/* Thresholds Section */}
                                    {(rule.warningThreshold !== undefined || rule.criticalThreshold !== undefined) && (
                                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>THRESHOLDS {rule.thresholdUnit && `(${rule.thresholdUnit})`}</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>Warning</label>
                                                    <input
                                                        type="number"
                                                        className="form-input"
                                                        style={{ height: '34px', margin: 0, fontSize: '0.9rem' }}
                                                        value={rule.warningThreshold ?? ''}
                                                        onChange={(e) => handleRuleChange(name, 'warningThreshold', e.target.value === '' ? null : Number(e.target.value))}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>Critical</label>
                                                    <input
                                                        type="number"
                                                        className="form-input"
                                                        style={{ height: '34px', margin: 0, fontSize: '0.9rem' }}
                                                        value={rule.criticalThreshold ?? ''}
                                                        onChange={(e) => handleRuleChange(name, 'criticalThreshold', e.target.value === '' ? null : Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Channels Section */}
                                    <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                            <button
                                                onClick={() => handleRuleChange(name, 'immediateEmail', !rule.immediateEmail)}
                                                style={{ background: rule.immediateEmail ? '#eef2ff' : '#f8fafc', border: `1px solid ${rule.immediateEmail ? '#818cf8' : '#e2e8f0'}`, padding: '0.5rem', borderRadius: '0.5rem', color: rule.immediateEmail ? '#4f46e5' : '#94a3b8', transition: 'all 0.2s' }}
                                                title="Email Alert"
                                            >
                                                <Mail size={18} />
                                            </button>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: rule.immediateEmail ? '#4f46e5' : '#94a3b8' }}>Email</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                            <button
                                                onClick={() => handleRuleChange(name, 'sendWebHook', !rule.sendWebHook)}
                                                style={{ background: rule.sendWebHook ? '#f0fdf4' : '#f8fafc', border: `1px solid ${rule.sendWebHook ? '#4ade80' : '#e2e8f0'}`, padding: '0.5rem', borderRadius: '0.5rem', color: rule.sendWebHook ? '#166534' : '#94a3b8', transition: 'all 0.2s' }}
                                                title="Webhook"
                                            >
                                                <Webhook size={18} />
                                            </button>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: rule.sendWebHook ? '#166534' : '#94a3b8' }}>Hook</span>
                                        </div>
                                        {rule.resolvedAlert !== null && (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                                <button
                                                    onClick={() => handleRuleChange(name, 'resolvedAlert', !rule.resolvedAlert)}
                                                    style={{ background: rule.resolvedAlert ? '#fdf2f8' : '#f8fafc', border: `1px solid ${rule.resolvedAlert ? '#f472b6' : '#e2e8f0'}`, padding: '0.5rem', borderRadius: '0.5rem', color: rule.resolvedAlert ? '#be185d' : '#94a3b8', transition: 'all 0.2s' }}
                                                    title="Recovery notification"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: rule.resolvedAlert ? '#be185d' : '#94a3b8' }}>Resolve</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Global Info Footer */}
            <div style={{ marginTop: '4rem', padding: '2rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <Info size={24} style={{ color: '#64748b' }} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>About Global Rules</h3>
                    <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>
                        These notification policies act as the default baseline for all devices and interfaces assigned to the selected account.
                        Modifications here will take immediate effect upon saving. Ensure your Webhook URLs and Email lists are properly configured in the master settings to receive these alerts.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .rule-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 20px -10px rgba(0,0,0,0.1);
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #6366f1;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default NotificationSettings;
