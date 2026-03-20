
import type { components } from './schema';

export type Organization = components['schemas']['Organization'];
export type OrganizationRequest = components['schemas']['OrganizationRequest'];

const BASE_URL = import.meta.env.VITE_API_BASE;

function getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export async function getOrganizations(): Promise<Organization[]> {
    const response = await fetch(`${BASE_URL}/organizations`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        let errorMessage = 'Failed to fetch organizations';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // ignore
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function getOrganization(id: string): Promise<Organization> {
    const response = await fetch(`${BASE_URL}/organizations/${id}`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch organization');
    }
    return response.json();
}

export async function createOrganization(data: OrganizationRequest): Promise<Organization> {
    const response = await fetch(`${BASE_URL}/organizations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        let errorMessage = 'Failed to create organization';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // ignore
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function updateOrganization(id: string, data: OrganizationRequest): Promise<Organization> {
    const response = await fetch(`${BASE_URL}/organizations/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Failed to update organization');
    }
    return response.json();
}

export async function deleteOrganization(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/organizations/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to delete organization');
    }
}
