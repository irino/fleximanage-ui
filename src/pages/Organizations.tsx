import React, { useEffect, useState } from 'react';
import { getOrganizations, createOrganization, type Organization, type OrganizationRequest } from '../api/organization';
import { Building2, Plus, Search, Filter, X, List, Shield, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Members.css';

const Organizations: React.FC = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newOrg, setNewOrg] = useState<OrganizationRequest>({
        name: '',
        description: '',
        group: 'Default',
        encryptionMethod: 'ikev2',
        vxlanPort: '4789',
        tunnelRange: '10.100.0.0'
    });
    const [createError, setCreateError] = useState<string | null>(null);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const data = await getOrganizations();
            setOrganizations(data);
        } catch (err) {
            console.error('Failed to fetch organizations:', err);
            setError(err instanceof Error ? err.message : 'Failed to load organizations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError(null);
        try {
            setCreating(true);
            await createOrganization(newOrg);
            setShowCreateModal(false);
            // Reset form
            setNewOrg({
                name: '',
                description: '',
                group: 'Default',
                encryptionMethod: 'ikev2',
                vxlanPort: '4789',
                tunnelRange: '10.100.0.0'
            });
            // Refresh list
            fetchOrganizations();
        } catch (err) {
            console.error('Create Organization Error:', err);
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setCreateError(msg);
        } finally {
            setCreating(false);
        }
    };

    const filteredOrgs = organizations.filter(org =>
        org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="members-container" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading organizations...</div>;
    if (error) return <div className="members-container" style={{ padding: '2rem' }}><div style={{ padding: '1.5rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>Error: {error}</div></div>;

    return (
        <div className="members-container">
            <div className="members-header">
                <div className="members-title">
                    <h1>
                        <Building2 style={{ color: '#6366f1' }} size={28} />
                        Organizations
                    </h1>
                    <p className="subtitle">Manage organizations and their network configurations.</p>
                </div>
                <div className="members-actions">
                    <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} />
                        <span>Create Organization</span>
                    </button>
                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search organizations..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-secondary">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className="members-table-container">
                <div className="overflow-x-auto">
                    <table className="members-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Group</th>
                                <th>Encryption</th>
                                <th>Tunnel Range</th>
                                <th style={{ width: '80px' }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrgs.map((org) => (
                                <tr key={org._id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar" style={{ backgroundColor: '#f0f9ff', color: '#0ea5e9' }}>
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <div className="user-name" style={{ color: '#4f46e5', fontWeight: 600 }}>
                                                    {org.name}
                                                </div>
                                                <div className="user-email">
                                                    ID: {org._id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="org-info">
                                            <div className="org-name" style={{ color: '#475569' }}>
                                                <Activity size={14} style={{ color: '#94a3b8' }} />
                                                {org.group || 'Default'}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${org.encryptionMethod === 'none' ? 'role-default' : 'role-manager'}`}>
                                            <Shield size={12} />
                                            {org.encryptionMethod?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="account-info">
                                            <div className="account-name">{org.tunnelRange || '-'}</div>
                                            <div className="id-monospaced" style={{ fontSize: '0.75rem' }}>Port: {org.vxlanPort}</div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Link to={`/organizations/${org._id}`} className="btn-filter" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }}>
                                            <List size={18} style={{ color: '#6366f1' }} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrgs.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            <Building2 size={48} className="empty-icon" />
                                            <p>No organizations found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Organization Modal */}
            {showCreateModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Create New Organization</h2>
                            <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                <X size={24} />
                            </button>
                        </div>
                        {createError && (
                            <div style={{ margin: '1rem 1.5rem 0', padding: '0.75rem 1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', border: '1px solid #fee2e2', fontSize: '0.875rem' }}>
                                <strong>Error:</strong> {createError}
                            </div>
                        )}
                        <form onSubmit={handleCreateOrg} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ marginBottom: '1rem', gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Name *</label>
                                    <input required className="search-input" style={{ width: '100%' }} value={newOrg.name} onChange={e => setNewOrg({ ...newOrg, name: e.target.value })} placeholder="Organization Name" />
                                </div>
                                <div style={{ marginBottom: '1rem', gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Description</label>
                                    <input className="search-input" style={{ width: '100%' }} value={newOrg.description} onChange={e => setNewOrg({ ...newOrg, description: e.target.value })} placeholder="Optional description" />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Group *</label>
                                    <input required className="search-input" style={{ width: '100%' }} value={newOrg.group} onChange={e => setNewOrg({ ...newOrg, group: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Encryption Method</label>
                                    <select className="search-input" style={{ width: '100%' }} value={newOrg.encryptionMethod} onChange={e => setNewOrg({ ...newOrg, encryptionMethod: e.target.value as any })}>
                                        <option value="none">None</option>
                                        <option value="psk">PSK</option>
                                        <option value="ikev2">IKEv2 (Recommended)</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>VXLAN Port</label>
                                    <input className="search-input" style={{ width: '100%' }} value={newOrg.vxlanPort} onChange={e => setNewOrg({ ...newOrg, vxlanPort: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Tunnel Range</label>
                                    <input className="search-input" style={{ width: '100%' }} value={newOrg.tunnelRange} onChange={e => setNewOrg({ ...newOrg, tunnelRange: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary" disabled={creating}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={creating}>
                                    {creating ? 'Creating...' : 'Create Organization'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Organizations;
