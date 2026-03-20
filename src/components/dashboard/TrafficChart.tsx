import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const data = [
    { time: '00:00', download: 4000, upload: 2400 },
    { time: '04:00', download: 3000, upload: 1398 },
    { time: '08:00', download: 2000, upload: 9800 },
    { time: '12:00', download: 2780, upload: 3908 },
    { time: '16:00', download: 1890, upload: 4800 },
    { time: '20:00', download: 2390, upload: 3800 },
    { time: '24:00', download: 3490, upload: 4300 },
];

const TrafficChart: React.FC = () => {
    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={(value) => `${value / 1000}Gb`}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Area
                        type="monotone"
                        dataKey="download"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                        name="Download Traffic"
                    />
                    <Area
                        type="monotone"
                        dataKey="upload"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.2}
                        name="Upload Traffic"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrafficChart;
