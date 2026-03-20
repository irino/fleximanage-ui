
import type { components } from './schema';

// Utilize the generated types
export type Account = components['schemas']['Account'];
export type Organization = components['schemas']['Organization'];


const BASE_URL = import.meta.env.VITE_API_BASE;

function getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export async function getAccounts(): Promise<Account[]> {
    const response = await fetch(`${BASE_URL}/accounts`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch accounts');
    return response.json();
}

export async function getAccount(accountId: string): Promise<Account> {
    const response = await fetch(`${BASE_URL}/accounts/${accountId}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch account');
    return response.json();
}

export async function updateAccount(accountId: string, data: Partial<Account>): Promise<Account> {
    const response = await fetch(`${BASE_URL}/accounts/${accountId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update account');
    return response.json();
}

export async function getAccountOrganizations(_accountId: string): Promise<Organization[]> {
    // Verified endpoint from grep: /accounts/{id}/organizations seems likely or just /organizations
    // Let's try /organizations first as it's a common pattern to list what the user has access to
    const response = await fetch(`${BASE_URL}/organizations`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch organizations');
    return response.json();
}




export async function deleteAccount(accountId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/accounts/${accountId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete account');
}

