import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './Layout.css';

interface MainLayoutProps {
    onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
    // In a real app, retrieve user info from context or store
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';

    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content-wrapper">
                <TopBar onLogout={onLogout} userEmail={userEmail} />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
