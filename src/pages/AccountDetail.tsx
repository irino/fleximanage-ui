
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccount, updateAccount, deleteAccount, type Account } from '../api/accounts';
import { ArrowLeft, Building2, Globe, Shield, CreditCard, Edit2, Save, X, Info, Trash2 } from 'lucide-react';
import { useTranslation } from "react-i18next";
import './Members.css';

const AccountDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState<Partial<Account>>({});

    useEffect(() => {
        if (id) {
            loadAccount(id);
        }
    }, [id]);

    const loadAccount = async (accountId: string) => {
        try {
            setLoading(true);
            const data = await getAccount(accountId);
            setAccount(data);
            setFormData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load account details');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!id || !account) return;
        try {
            setSaving(true);
            const updated = await updateAccount(id, formData);
            setAccount(updated);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update account');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleDelete = async () => {
        if (!id || !account) return;
        if (!window.confirm(`${t("Delete Confirmation Title")}\n\n${t("Delete Account Confirmation")}`)) {
            return;
        }

        try {
            setDeleting(true);
            await deleteAccount(id);
            navigate('/account');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete account');
            setDeleting(false);
        }
    };

    if (loading) return <div className="members-container" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading account profile...</div>;
    if (error && !isEditing) return <div className="members-container" style={{ padding: '2rem' }}><div style={{ padding: '1.5rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>Error: {error}</div></div>;
    if (!account) return <div className="members-container" style={{ textAlign: 'center', padding: '3rem' }}>Account not found.</div>;

    return (
        <div className="members-container">
            <div className="members-header">
                <div className="members-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => navigate('/account')} className="btn-secondary" style={{ padding: '0.5rem' }}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1>{isEditing ? 'Edit Account' : account.name}</h1>
                            <p className="subtitle">Account ID: {account._id}</p>
                        </div>
                    </div>
                </div>
                <div className="members-actions">
                    {!isEditing ? (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn-secondary" onClick={handleDelete} disabled={deleting} style={{ color: '#dc2626', borderColor: '#fee2e2' }}>
                                <Trash2 size={18} />
                                <span>{deleting ? t("Deleting...") : t("Delete Account")}</span>
                            </button>
                            <button className="btn-primary" onClick={() => setIsEditing(true)} disabled={deleting}>
                                <Edit2 size={18} />
                                <span>Edit Account</span>
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn-secondary" onClick={() => setIsEditing(false)} disabled={saving}>
                                <X size={18} />
                                <span>Cancel</span>
                            </button>
                            <button className="btn-primary" onClick={handleSave} disabled={saving}>
                                <Save size={18} />
                                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {error && isEditing && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>
                    {error}
                </div>
            )}

            <div className="members-table-container" style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* General Information */}
                    <div className="org-info">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                            <Building2 size={18} style={{ color: '#6366f1' }} />
                            General Information
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="subtitle" style={{ display: 'block', marginBottom: '0.4rem' }}>Account Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        className="search-input"
                                        style={{ width: '100%' }}
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="user-name">{account.name}</div>
                                )}
                            </div>
                            <div>
                                <label className="subtitle" style={{ display: 'block', marginBottom: '0.4rem' }}>Company Type</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="companyType"
                                        className="search-input"
                                        style={{ width: '100%' }}
                                        value={formData.companyType || ''}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="user-name">{account.companyType || 'N/A'}</div>
                                )}
                            </div>
                            <div>
                                <label className="subtitle" style={{ display: 'block', marginBottom: '0.4rem' }}>Country</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="country"
                                        className="search-input"
                                        style={{ width: '100%' }}
                                        value={formData.country || ''}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="org-name"><Globe size={14} /> {account.country || 'N/A'}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Security & Access */}
                    <div className="org-info">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                            <Shield size={18} style={{ color: '#10b981' }} />
                            Security & Access
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                <div>
                                    <label className="user-name" style={{ display: 'block', fontSize: '0.9rem' }}>Force MFA</label>
                                    <p className="subtitle" style={{ fontSize: '0.75rem', margin: 0 }}>Require MFA for all users</p>
                                </div>
                                {isEditing ? (
                                    <input
                                        type="checkbox"
                                        name="forceMfa"
                                        checked={formData.forceMfa || false}
                                        onChange={handleChange}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                ) : (
                                    <span className={`role-badge ${account.forceMfa ? 'role-manager' : 'role-default'}`}>
                                        {account.forceMfa ? 'ENABLED' : 'DISABLED'}
                                    </span>
                                )}
                            </div>

                            <div style={{ padding: '1rem', border: '1px dashed #e2e8f0', borderRadius: '0.5rem' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b' }}>
                                    <CreditCard size={16} />
                                    Billing Status
                                </h4>
                                <p className="subtitle" style={{ fontStyle: 'italic' }}>Subscription management is currently unavailable in the UI.</p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="org-info" style={{ gridColumn: '1 / -1' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                            <Info size={18} style={{ color: '#94a3b8' }} />
                            System Metadata
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <label className="subtitle">Database ID (_id)</label>
                                <div className="id-monospaced">{account._id}</div>
                            </div>
                            <div>
                                <label className="subtitle">Internal Name</label>
                                <div className="user-name">{account.name}</div>
                            </div>
                            <div>
                                <label className="subtitle">Type</label>
                                <div className="account-name">{account.companyType || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AccountDetail;
