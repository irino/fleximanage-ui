
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAccounts, type Account } from '../api/accounts';
import { Building2, Globe, Shield, Search, Filter, Plus, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Members.css';

const Accounts: React.FC = () => {
    const { t } = useTranslation();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            setLoading(true);
            const data = await getAccounts();
            setAccounts(data);
        } catch (err) {
            console.error('Failed to fetch accounts:', err);
            setError(err instanceof Error ? err.message : 'Failed to load accounts');
        } finally {
            setLoading(false);
        }
    };

    const filteredAccounts = accounts.filter(account =>
        account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="members-container" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading accounts...</div>;
    if (error) return <div className="members-container" style={{ padding: '2rem' }}><div style={{ padding: '1.5rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>Error: {error}</div></div>;

    return (
        <div className="members-container">
            <div className="members-header">
                <div className="members-title">
                    <h1>
                        <Building2 style={{ color: '#6366f1' }} size={28} />
                        {t('Account')}
                    </h1>
                    <p className="subtitle">Manage organization accounts and global settings.</p>
                </div>
                <div className="members-actions">
                    <button className="btn-primary" onClick={() => navigate('/account/create')}>
                        <Plus size={18} />
                        <span>{t('Create Account')}</span>
                    </button>
                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder={t('Search accounts...')}
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
                                <th>Account Name</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Security</th>
                                <th style={{ width: '80px' }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.map((account) => (
                                <tr key={account._id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <Link to={`/account/${account._id}`} className="user-name" style={{ textDecoration: 'none', color: '#4f46e5' }}>
                                                    {account.name}
                                                </Link>
                                                <div className="user-email" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                                    ID: {account._id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="org-info">
                                            <div className="org-name">
                                                <Globe size={14} style={{ color: '#94a3b8' }} />
                                                {account.country || '-'}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="account-info">
                                            <div className="account-name">{account.companyType || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${account.forceMfa ? 'role-manager' : 'role-default'}`}>
                                            <Shield size={12} />
                                            MFA: {account.forceMfa ? 'ENFORCED' : 'OPTIONAL'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Link to={`/account/${account._id}`} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }}>
                                            <List size={18} style={{ color: '#6366f1' }} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredAccounts.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            <Building2 size={48} className="empty-icon" />
                                            <p>No accounts found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Accounts;
