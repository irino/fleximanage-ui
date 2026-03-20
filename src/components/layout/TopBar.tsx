import React from 'react';
import { LogOut, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Layout.css';

interface TopBarProps {
    title?: string;
    onLogout: () => void;
    userEmail?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard', onLogout, userEmail }) => {
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div className="topbar">
            <div className="topbar-title">{t(title)}</div>
            <div className="topbar-actions">
                <div className="language-selector-wrapper">
                    <Languages size={18} className="icon-muted" />
                    <select
                        value={i18n.language.startsWith('en') ? 'en' : 'ja'}
                        onChange={handleLanguageChange}
                        className="lang-select"
                    >
                        <option value="en">English</option>
                        <option value="ja">日本語</option>
                    </select>
                </div>

                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{userEmail?.split('@')[0]}</span>
                        <span className="user-email">{userEmail}</span>
                    </div>
                </div>

                <button className="logout-btn" onClick={onLogout} title={t('Logout')}>
                    <LogOut size={18} />
                    <span>{t('Logout')}</span>
                </button>
            </div>
        </div>
    );
};

export default TopBar;
