
import React, { useEffect, useState } from 'react';
import { getMembers, createMember, type Member, type MemberRequest } from '../api/members';
import { Users as UsersIcon, Mail, Shield, Building, User, Search, Filter, Plus, X, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Members.css';

const Members: React.FC = () => {
    const { t } = useTranslation();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newMember, setNewMember] = useState<MemberRequest>({
        userId: '',
        userJobTitle: '',
        userEntity: '',
        userLastName: '',
        userFirstName: '',
        userRole: 'viewer',
        email: '',
        userPermissionTo: 'account'
    });
    const [createError, setCreateError] = useState<string | null>(null);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const data = await getMembers();
            setMembers(data);
        } catch (err) {
            console.error('Failed to fetch members:', err);
            setError(err instanceof Error ? err.message : 'Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError(null);
        try {
            setCreating(true);
            await createMember(newMember);
            setShowCreateModal(false);
            // Reset form
            setNewMember({
                userId: '',
                userJobTitle: '',
                userEntity: '',
                userLastName: '',
                userFirstName: '',
                userRole: 'viewer',
                email: '',
                userPermissionTo: 'account'
            });
            // Refresh list
            fetchMembers();
        } catch (err) {
            console.error('Create Member Error:', err);
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setCreateError(msg);
        } finally {
            setCreating(false);
        }
    };

    const filteredMembers = members.filter(member =>
        member.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="members-container" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading members...</div>;
    if (error) return <div className="members-container" style={{ padding: '2rem' }}><div style={{ padding: '1.5rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>Error: {error}</div></div>;

    return (
        <div className="members-container">
            <div className="members-header">
                <div className="members-title">
                    <h1>
                        <UsersIcon style={{ color: '#6366f1' }} size={28} />
                        {t('Members')}
                    </h1>
                    <p className="subtitle">Manage organization members and their access levels.</p>
                </div>
                <div className="members-actions">
                    <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} />
                        <span>{t('Create Member')}</span>
                    </button>
                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder={t('Search users...')}
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
                                <th>User</th>
                                <th>Role</th>
                                <th>Organization</th>
                                <th>Account</th>
                                <th style={{ width: '80px' }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member._id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <Link to={`/members/${member._id}`} className="user-name" style={{ textDecoration: 'none', color: '#4f46e5' }}>
                                                    {member.user_name}
                                                </Link>
                                                <div className="user-email">
                                                    <Mail size={12} />
                                                    {member.user_email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${member.role === 'owner' ? 'role-owner' :
                                            member.role === 'manager' ? 'role-manager' :
                                                'role-default'
                                            }`}>
                                            <Shield size={12} />
                                            {member.role?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="org-info">
                                            <div className="org-name">
                                                <Building size={14} style={{ color: '#94a3b8' }} />
                                                {member.organization_name || '-'}
                                            </div>
                                            <div className="id-monospaced">{member.organization__id}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="account-info">
                                            <div className="account-name">{member.account_name || '-'}</div>
                                            <div className="id-monospaced">{member.account__id}</div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Link to={`/members/${member._id}`} className="btn-filter" style={{ padding: '0.4rem', border: 'none', background: 'transparent !important' }}>
                                            <List size={18} style={{ color: '#6366f1' }} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            <UsersIcon size={48} className="empty-icon" />
                                            <p>No members found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Member Modal Overlay */}
            {showCreateModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Create New Member</h2>
                            <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                <X size={24} />
                            </button>
                        </div>
                        {createError && (
                            <div style={{ margin: '1rem 1.5rem 0', padding: '0.75rem 1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', border: '1px solid #fee2e2', fontSize: '0.875rem' }}>
                                <strong>Error:</strong> {createError}
                            </div>
                        )}
                        <form onSubmit={handleCreateMember} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>User ID *</label>
                                    <input required className="search-input" style={{ width: '100%' }} value={newMember.userId} onChange={e => setNewMember({ ...newMember, userId: e.target.value })} placeholder="Unique User ID" />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Email *</label>
                                    <input required type="email" className="search-input" style={{ width: '100%' }} value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} placeholder="user@example.com" />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>First Name *</label>
                                    <input required className="search-input" style={{ width: '100%' }} value={newMember.userFirstName} onChange={e => setNewMember({ ...newMember, userFirstName: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Last Name *</label>
                                    <input required className="search-input" style={{ width: '100%' }} value={newMember.userLastName} onChange={e => setNewMember({ ...newMember, userLastName: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Job Title</label>
                                    <input className="search-input" style={{ width: '100%' }} value={newMember.userJobTitle} onChange={e => setNewMember({ ...newMember, userJobTitle: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Role</label>
                                    <select className="search-input" style={{ width: '100%' }} value={newMember.userRole} onChange={e => setNewMember({ ...newMember, userRole: e.target.value as any })}>
                                        <option value="viewer">Viewer</option>
                                        <option value="manager">Manager</option>
                                        <option value="owner">Owner</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Permission To</label>
                                    <select className="search-input" style={{ width: '100%' }} value={newMember.userPermissionTo} onChange={e => setNewMember({ ...newMember, userPermissionTo: e.target.value as any })}>
                                        <option value="account">Account</option>
                                        <option value="organization">Organization</option>
                                        <option value="group">Group</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Entity (Org/Group ID)</label>
                                    <input className="search-input" style={{ width: '100%' }} value={newMember.userEntity} onChange={e => setNewMember({ ...newMember, userEntity: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary" disabled={creating}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={creating}>
                                    {creating ? 'Creating...' : 'Create Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;
