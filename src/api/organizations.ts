import { api } from './client';

export interface Organization {
    _id: string;
    name: string;
    description?: string;
    vxlanPort?: string;
}

export async function getOrganizations(): Promise<Organization[]> {
    const { data, error } = await api.GET('/organizations');
    if (error) throw new Error('Failed to fetch organizations');
    return data as Organization[];
}
