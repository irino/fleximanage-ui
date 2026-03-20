import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Router,
    Settings,
    Users,
    Building2,
    Globe,
    Bell,
    Key
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Layout.css';

const Sidebar: React.FC = () => {
    const { t } = useTranslation();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                flexiManage
            </div>
            <nav className="sidebar-nav">
                <NavLink
                    to="/home"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <LayoutDashboard size={20} />
                    <span>{t('Home')}</span>
                </NavLink>

                <div className="nav-group-label" style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                    {t('Inventory')}
                </div>

                <NavLink
                    to="/inventory/devices"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Router size={20} />
                    <span>{t('Devices')}</span>
                </NavLink>
                <NavLink
                    to="/inventory/tokens"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Key size={20} />
                    <span>{t('Tokens')}</span>
                </NavLink>

                <NavLink
                    to="/members"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Users size={20} />
                    <span>{t('Members')}</span>
                </NavLink>
                <NavLink
                    to="/organizations"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Building2 size={20} />
                    <span>Organizations</span>
                </NavLink>
                <NavLink
                    to="/account"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Globe size={20} />
                    <span>{t('Account')}</span>
                </NavLink>
                <NavLink
                    to="/notification-settings"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Bell size={20} />
                    <span>Notification Rules</span>
                </NavLink>
                <div style={{ flex: 1 }}></div>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Settings size={20} />
                    <span>{t('Settings')}</span>
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
            </div>
        </aside >
    );
};

export default Sidebar;
