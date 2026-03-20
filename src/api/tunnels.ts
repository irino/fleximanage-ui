
import { api } from './client';

export interface Tunnel {
    _id: string;
    name: string;
    tunnelStatus: 'Connected' | 'Not Connected' | 'Pending' | 'Unknown';
    device?: string;
    organization?: string;
    account?: string;
}

export async function getTunnels(): Promise<Tunnel[]> {
    const { data, error } = await api.GET('/tunnels', {});
    if (error) throw error;
    return data as Tunnel[];
}
