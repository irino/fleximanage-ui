
import { api } from './client';
import type { components } from './schema';

export type Organization = components['schemas']['Organization'];

/**
 * Get all organizations
 */
export async function getOrganizations() {
    const { data, error } = await api.GET('/organizations');
    if (error) throw error;
    return data || [];
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(id: string) {
    const { data, error } = await api.GET('/organizations/{id}', {
        params: {
            path: { id }
        }
    });
    if (error) throw error;
    return data;
}
