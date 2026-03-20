
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganization, updateOrganization, deleteOrganization, type Organization, type OrganizationRequest } from '../api/organization';
import { Building2, ArrowLeft, Save, Trash2, Shield, Activity, Globe, Info } from 'lucide-react';
import './Members.css';

const OrganizationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<OrganizationRequest>({
        name: '',
        description: '',
        group: '',
        encryptionMethod: 'ikev2',
        vxlanPort: '',
        tunnelRange: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrganization(id);
        }
    }, [id]);

    const fetchOrganization = async (orgId: string) => {
        try {
            setLoading(true);
            const data = await getOrganization(orgId);
            setOrganization(data);
            setForm({
                name: data.name || '',
                description: data.description || '',
                group: data.group || '',
                encryptionMethod: data.encryptionMethod || 'ikev2',
                vxlanPort: data.vxlanPort || '4789',
                tunnelRange: data.tunnelRange || '10.100.0.0'
            });
        } catch (err) {
            console.error('Failed to fetch organization:', err);
            setError(err instanceof Error ? err.message : 'Failed to load organization');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        try {
            setSaving(true);
            await updateOrganization(id, form);
            setEditMode(false);
            fetchOrganization(id);
        } catch (err) {
            console.error('Update Organization Error:', err);
            alert('Failed to update organization');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !window.confirm('Are you sure you want to delete this organization?')) return;
        try {
            await deleteOrganization(id);
            navigate('/organizations');
        } catch (err) {
            console.error('Delete Organization Error:', err);
            alert('Failed to delete organization');
        }
    };

    if (loading) return <div className="members-container" style={{ textAlign: 'center', padding: '3rem' }}>Loading organization...</div>;
    if (error || !organization) return <div className="members-container" style={{ padding: '2rem' }}><div className="alert alert-error">Error: {error || 'Organization not found'}</div></div>;

    return (
        <div className="members-container">
            <div className="members-header">
                <div className="members-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => navigate('/organizations')} className="btn-secondary" style={{ padding: '0.5rem' }}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1>
                                <Building2 style={{ color: '#6366f1' }} size={28} />
                                {organization.name}
                            </h1>
                            <p className="subtitle">ID: {organization._id}</p>
                        </div>
                    </div>
                </div>
                <div className="members-actions">
                    {!editMode ? (
                        <button className="btn-primary" onClick={() => setEditMode(true)}>
                            Edit Organization
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleUpdate} disabled={saving}>
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                    <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2' }} onClick={handleDelete}>
                        <Trash2 size={18} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="member-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="detail-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                        <Info size={20} style={{ color: '#6366f1' }} />
                        <h3 style={{ margin: 0 }}>Basic Information</h3>
                    </div>

                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Organization Name</label>
                            {editMode ? (
                                <input className="search-input" style={{ width: '100%' }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            ) : (
                                <div style={{ fontSize: '1rem', fontWeight: 500, color: '#1e293b' }}>{organization.name}</div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Description</label>
                            {editMode ? (
                                <textarea className="search-input" style={{ width: '100%', height: '80px' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            ) : (
                                <div style={{ fontSize: '1rem', color: '#1e293b' }}>{organization.description || '-'}</div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Account ID</label>
                            <div className="id-monospaced">{organization.account}</div>
                        </div>
                    </form>
                </div>

                <div className="detail-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                        <Globe size={20} style={{ color: '#6366f1' }} />
                        <h3 style={{ margin: 0 }}>Network Settings</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Group</label>
                            {editMode ? (
                                <input className="search-input" style={{ width: '100%' }} value={form.group} onChange={e => setForm({ ...form, group: e.target.value })} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Activity size={16} style={{ color: '#94a3b8' }} />
                                    <span>{organization.group || 'Default'}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Encryption Method</label>
                            {editMode ? (
                                <select className="search-input" style={{ width: '100%' }} value={form.encryptionMethod} onChange={e => setForm({ ...form, encryptionMethod: e.target.value as any })}>
                                    <option value="none">None</option>
                                    <option value="psk">PSK</option>
                                    <option value="ikev2">IKEv2</option>
                                </select>
                            ) : (
                                <span className={`role-badge ${organization.encryptionMethod === 'none' ? 'role-default' : 'role-manager'}`}>
                                    <Shield size={12} />
                                    {organization.encryptionMethod?.toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>VXLAN Port</label>
                                {editMode ? (
                                    <input className="search-input" style={{ width: '100%' }} value={form.vxlanPort} onChange={e => setForm({ ...form, vxlanPort: e.target.value })} />
                                ) : (
                                    <div className="id-monospaced">{organization.vxlanPort}</div>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tunnel Range</label>
                                {editMode ? (
                                    <input className="search-input" style={{ width: '100%' }} value={form.tunnelRange} onChange={e => setForm({ ...form, tunnelRange: e.target.value })} />
                                ) : (
                                    <div className="id-monospaced">{organization.tunnelRange}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationDetail;
