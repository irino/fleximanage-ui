import React, { useEffect, useState } from 'react';
import { getTokens, createToken, deleteToken, type Token } from '../../api/tokens';
import { getOrganizations, type Organization } from '../../api/organizations';
import { Key, Search, Plus, Trash2, Copy, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../Members.css';

const Tokens: React.FC = () => {
    const { t } = useTranslation();
    const [tokens, setTokens] = useState<Token[]>([]);
    const [orgs, setOrgs] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTokenName, setNewTokenName] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [expandedTokens, setExpandedTokens] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tokenData, orgData] = await Promise.all([
                getTokens(),
                getOrganizations()
            ]);

            setTokens(tokenData);

            // Create a mapping of org ID to name
            const orgMap: Record<string, string> = {};
            if (Array.isArray(orgData)) {
                (orgData as Organization[]).forEach(org => {
                    if (org._id) orgMap[org._id] = org.name || 'Unknown';
                });
            }
            setOrgs(orgMap);

        } catch (err) {
            console.error('Failed to fetch tokens/orgs:', err);
            setError(err instanceof Error ? err.message : 'Failed to load tokens');
        } finally {
            setLoading(false);
        }
    };

    const loadTokens = async () => {
        try {
            const data = await getTokens();
            setTokens(data);
        } catch (err) {
            console.error('Failed to fetch tokens:', err);
            setError(err instanceof Error ? err.message : 'Failed to load tokens');
        }
    };

    const handleCreateToken = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createToken({ name: newTokenName });
            setNewTokenName('');
            setIsCreateModalOpen(false);
            loadTokens();
        } catch (err) {
            console.error('Failed to create token:', err);
            alert('Failed to create token');
        }
    };

    const handleDeleteToken = async (id: string) => {
        if (!window.confirm(t('Delete Token Confirmation'))) return;
        try {
            await deleteToken(id);
            loadTokens();
        } catch (err) {
            console.error('Failed to delete token:', err);
            alert('Failed to delete token');
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleToken = (id: string) => {
        setExpandedTokens(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSearch = () => {
        console.log('Searching for:', searchTerm);
    };

    const filteredTokens = tokens.filter((token: Token) =>
        token.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.token?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.org?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orgs[token.org || '']?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="members-container">
            <div className="members-header">
                <div className="members-title">
                    <h1>
                        <Key className="text-primary" size={28} />
                        {t('Tokens')}
                    </h1>
                    <p className="subtitle">{t('Token Description')}</p>
                </div>
                <div className="members-actions">
                    <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={18} />
                        <span>{t('Create Token')}</span>
                    </button>
                    <div className="search-wrapper" style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search className="search-icon" size={18} />
                            <input
                                type="text"
                                placeholder={t('Search tokens...')}
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                style={{ paddingRight: '1rem' }}
                            />
                        </div>
                        <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={handleSearch}>
                            {t('Search')}
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    {t('Loading...')}
                </div>
            ) : error ? (
                <div className="card" style={{ padding: '2rem' }}>
                    <div className="alert alert-error">
                        <div style={{ fontWeight: 'bold' }}>Error: {error}</div>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            Please ensure you are logged in and the backend is running at {import.meta.env.VITE_API_BASE}.
                        </p>
                        <button className="btn-secondary" onClick={loadData} style={{ marginTop: '1rem', fontSize: '0.85rem' }}>Retry</button>
                    </div>
                </div>
            ) : (
                <div className="card members-table-container">
                    <div className="overflow-x-auto">
                        <table className="members-table">
                            <thead>
                                <tr>
                                    <th>{t('Token Name')}</th>
                                    <th>Organization Name / ID</th>
                                    <th>{t('Token')}</th>
                                    <th>{t('Created At')}</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>{t('Action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTokens.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                            No tokens found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTokens.map((token: Token) => (
                                        <tr key={token._id}>
                                            <td>
                                                <div className="name-box">
                                                    <span className="entity-name" style={{ display: 'block' }}>{token.name}</span>
                                                    <span className="sub-text" style={{ fontSize: '0.75rem', opacity: 0.8 }}>ID: {token._id}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <span className="entity-name" style={{ display: 'block', color: '#0369a1', fontWeight: 600 }}>
                                                        {orgs[token.org || ''] || 'Loading...'}
                                                    </span>
                                                    <span className="sub-text" style={{ fontSize: '0.75rem', opacity: 0.8 }}>ID: {token.org}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="token-cell" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <code className="token-code" style={{
                                                        background: '#f1f5f9',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.8125rem',
                                                        wordBreak: expandedTokens[token._id || ''] ? 'break-all' : 'normal',
                                                        whiteSpace: expandedTokens[token._id || ''] ? 'pre-wrap' : 'nowrap',
                                                        maxWidth: expandedTokens[token._id || ''] ? 'none' : '150px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: 'inline-block'
                                                    }}>
                                                        {token.token}
                                                    </code>
                                                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                                        <button
                                                            className="action-icon-btn"
                                                            title={expandedTokens[token._id || ''] ? 'Collapse' : 'Expand'}
                                                            onClick={() => toggleToken(token._id || '')}
                                                        >
                                                            {expandedTokens[token._id || ''] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </button>
                                                        <button
                                                            className="action-icon-btn"
                                                            title={t('Copy')}
                                                            onClick={() => copyToClipboard(token.token || '', token._id || '')}
                                                        >
                                                            {copiedId === token._id ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '0.8125rem' }}>
                                                    {token.createdAt ? new Date(token.createdAt).toLocaleString() : '-'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    className="action-icon-btn delete-btn"
                                                    title={t('Delete Token')}
                                                    onClick={() => handleDeleteToken(token._id || '')}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Token Modal */}
            {isCreateModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content card" style={{ maxWidth: '450px' }}>
                        <div className="modal-header">
                            <h3>{t('Create Token')}</h3>
                        </div>
                        <form onSubmit={handleCreateToken}>
                            <div className="form-group">
                                <label className="form-label">{t('Token Name')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. My Hub Token"
                                    value={newTokenName}
                                    onChange={(e) => setNewTokenName(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <div className="form-help-text" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                                    <Info size={14} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                                    <span>Tokens are used by FlexiEdge for initial registration.</span>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                                    {t('Cancel')}
                                </button>
                                <button type="submit" className="btn-primary">
                                    {t('Create Token')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    width: 90%;
                    padding: 2rem;
                    animation: modalSlideUp 0.3s ease-out;
                }
                @keyframes modalSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .token-code {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                .delete-btn:hover {
                    color: #ef4444 !important;
                    background: #fef2f2 !important;
                }
                .text-success {
                    color: #10b981;
                }
            `}</style>
        </div>
    );
};

export default Tokens;
