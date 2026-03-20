
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMember, updateMember, deleteMember, type Member, type MemberRequest } from '../api/members';
import { ArrowLeft, User, Mail, Shield, Building, Edit2, Save, X, Info, Trash2 } from 'lucide-react';
import { useTranslation } from "react-i18next";
import './Members.css';

const MemberDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Form state for editing
    const [formData, setFormData] = useState<MemberRequest>({
        email: '',
        userId: '',
        userFirstName: '',
        userLastName: '',
        userJobTitle: '',
        userPermissionTo: 'account',
        userEntity: '',
        userRole: 'viewer'
    });

    useEffect(() => {
        if (id) {
            fetchMemberDetail(id);
        }
    }, [id]);

    const fetchMemberDetail = async (memberId: string) => {
        try {
            setLoading(true);
            const data = await getMember(memberId);
            setMember(data);

            // Initialize form data (mapping from Member to MemberRequest)
            // Note: Member from API has user_name, user_email etc.
            // MemberRequest expects split names
            const names = data.user_name?.split(' ') || ['', ''];
            setFormData({
                email: data.user_email || '',
                userId: data.user__id || '',
                userFirstName: names[0] || '',
                userLastName: names[1] || '',
                userJobTitle: '', // Not in Member type directly
                userPermissionTo: (data.to as any) || 'account',
                userEntity: data.organization__id || '',
                userRole: (data.role as any) || 'viewer'
            });
        } catch (err) {
            console.error('Failed to fetch member detail:', err);
            setError(err instanceof Error ? err.message : 'Failed to load member details');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!id) return;
        try {
            setSaving(true);
            const updated = await updateMember(id, formData);
            setMember(updated);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            console.error('Failed to update member:', err);
            setError(err instanceof Error ? err.message : 'Failed to update member');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !member) return;
        if (!window.confirm(`${t("Delete Confirmation Title")}\n\n${t("Delete Member Confirmation")}`)) {
            return;
        }

        try {
            setDeleting(true);
            await deleteMember(id);
            navigate('/members');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete member');
            setDeleting(false);
        }
    };

    if (loading) return <div className="members-container" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading member details...</div>;
    if (error && !isEditing) return <div className="members-container" style={{ padding: '2rem' }}><div style={{ padding: '1.5rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>Error: {error}</div></div>;
    if (!member) return <div className="members-container" style={{ textAlign: 'center', padding: '3rem' }}>Member not found.</div>;

    return (
        <div className="members-container">
            <div className="members-header">
                <div className="members-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => navigate('/members')} className="btn-filter" style={{ padding: '0.5rem' }}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1>{isEditing ? 'Edit Member' : member.user_name}</h1>
                            <p className="subtitle">User ID: {member.user__id}</p>
                        </div>
                    </div>
                </div>
                <div className="members-actions">
                    {!isEditing ? (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn-secondary" onClick={handleDelete} disabled={deleting} style={{ color: '#dc2626', borderColor: '#fee2e2' }}>
                                <Trash2 size={18} />
                                <span>{deleting ? t("Deleting...") : t("Delete Member")}</span>
                            </button>
                            <button className="btn-primary" onClick={() => setIsEditing(true)} disabled={deleting}>
                                <Edit2 size={18} />
                                <span>Edit Member</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* Basic Info */}
                    <div className="org-info">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                            <User size={18} style={{ color: '#6366f1' }} />
                            Basic Information
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="subtitle" style={{ display: 'block', marginBottom: '0.4rem' }}>First Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="search-input"
                                        style={{ width: '100%' }}
                                        value={formData.userFirstName}
                                        onChange={(e) => setFormData({ ...formData, userFirstName: e.target.value })}
                                    />
                                ) : (
                                    <div className="user-name">{member.user_name?.split(' ')[0] || '-'}</div>
                                )}
                            </div>
                            <div>
                                <label className="subtitle" style={{ display: 'block', marginBottom: '0.4rem' }}>Last Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="search-input"
                                        style={{ width: '100%' }}
                                        value={formData.userLastName}
                                        onChange={(e) => setFormData({ ...formData, userLastName: e.target.value })}
                                    />
                                ) : (
                                    <div className="user-name">{member.user_name?.split(' ')[1] || '-'}</div>
                                )}
                            </div>
                            <div>
                                <label className="subtitle" style={{ display: 'block', marginBottom: '0.4rem' }}>Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        className="search-input"
                                        style={{ width: '100%' }}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                ) : (
                                    <div className="user-email"><Mail size={14} /> {member.user_email}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Access & Role */}
                    <div className="org-info">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                            <Shield size={18} style={{ color: '#10b981' }} />
                            Access & Permissions
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="subtitle" style={{ display: 'block', marginBottom: '0.4rem' }}>Role</label>
                                {isEditing ? (
                                    <select
                                        className="search-input"
                                        style={{ width: '100%' }}
                                        value={formData.userRole}
                                        onChange={(e) => setFormData({ ...formData, userRole: e.target.value as any })}
                                    >
                                        <option value="viewer">Viewer</option>
                                        <option value="manager">Manager</option>
                                        <option value="owner">Owner</option>
                                    </select>
                                ) : (
                                    <span className={`role-badge ${member.role === 'owner' ? 'role-owner' : member.role === 'manager' ? 'role-manager' : 'role-default'}`}>
                                        {member.role?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="subtitle" style={{ display: 'block', marginBottom: '0.4rem' }}>Permission To</label>
                                {isEditing ? (
                                    <select
                                        className="search-input"
                                        style={{ width: '100%' }}
                                        value={formData.userPermissionTo}
                                        onChange={(e) => setFormData({ ...formData, userPermissionTo: e.target.value as any })}
                                    >
                                        <option value="account">Account</option>
                                        <option value="organization">Organization</option>
                                        <option value="group">Group</option>
                                    </select>
                                ) : (
                                    <div className="user-name" style={{ textTransform: 'capitalize' }}>{member.to || '-'}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* System Info (Static in Detail) */}
                    <div className="org-info" style={{ gridColumn: '1 / -1' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                            <Info size={18} style={{ color: '#94a3b8' }} />
                            System Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <label className="subtitle">Internal ID (_id)</label>
                                <div className="id-monospaced" style={{ fontSize: '0.85rem' }}>{member._id}</div>
                            </div>
                            <div>
                                <label className="subtitle">User Internal ID (user__id)</label>
                                <div className="id-monospaced" style={{ fontSize: '0.85rem' }}>{member.user__id}</div>
                            </div>
                            <div>
                                <label className="subtitle">Organization Name</label>
                                <div className="org-name"><Building size={14} /> {member.organization_name || '-'}</div>
                            </div>
                            <div>
                                <label className="subtitle">Organization ID</label>
                                <div className="id-monospaced" style={{ fontSize: '0.85rem' }}>{member.organization__id || '-'}</div>
                            </div>
                            <div>
                                <label className="subtitle">Group</label>
                                <div className="user-name">{member.group || '-'}</div>
                            </div>
                            <div>
                                <label className="subtitle">Account Name</label>
                                <div className="account-name">{member.account_name || '-'}</div>
                            </div>
                            <div>
                                <label className="subtitle">Account ID</label>
                                <div className="id-monospaced" style={{ fontSize: '0.85rem' }}>{member.account__id || '-'}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MemberDetail;
