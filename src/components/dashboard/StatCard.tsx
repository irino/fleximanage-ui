import React, { type ReactNode } from 'react';
import '../../pages/Dashboard.css';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: {
        value: number;
        label: string;
        direction: 'up' | 'down' | 'neutral';
    };
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
    return (
        <div className="stat-card">
            <div className="stat-header">
                <span className="stat-title">{title}</span>
                <div className="stat-icon-wrapper">
                    {icon}
                </div>
            </div>
            <div className="stat-value">{value}</div>
            {trend && (
                <div className="stat-trend">
                    <span className="stat-trend-value">{trend.value}</span>
                    <span>{trend.label}</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
