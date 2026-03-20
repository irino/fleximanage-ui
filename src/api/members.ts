import type { components } from './schema';

// Utilize the generated types
export type Member = components['schemas']['Member'];
export type MemberRequest = components['schemas']['MemberRequest'];

const BASE_URL = import.meta.env.VITE_API_BASE;

function getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export async function getMembers(): Promise<Member[]> {
    const response = await fetch(`${BASE_URL}/members`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        let errorMessage = 'Failed to fetch members';
        try {
            const errorData = await response.json();
            console.error('Backend Error Details (getMembers):', errorData);
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            console.error('Failed to parse error response');
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function getMember(id: string): Promise<Member> {
    const response = await fetch(`${BASE_URL}/members/${id}`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        let errorMessage = 'Failed to fetch member';
        try {
            const errorData = await response.json();
            console.error('Backend Error Details (getMember):', errorData);
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            console.error('Failed to parse error response');
        }
        throw new Error(errorMessage);
    }
    const data = await response.json();
    // The API returns an array [Member] for this endpoint
    return Array.isArray(data) ? data[0] : data;
}

export async function createMember(data: MemberRequest): Promise<Member> {
    const response = await fetch(`${BASE_URL}/members`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        let errorMessage = 'Failed to create member';
        try {
            const errorData = await response.json();
            console.error('Backend Error Details:', errorData); // Log detailed error to console
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            console.error('Failed to parse error response');
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function updateMember(id: string, data: MemberRequest): Promise<Member> {
    const response = await fetch(`${BASE_URL}/members/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        let errorMessage = 'Failed to update member';
        try {
            const errorData = await response.json();
            console.error('Backend Error Details (updateMember):', errorData);
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            console.error('Failed to parse error response');
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function deleteMember(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/members/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        let errorMessage = 'Failed to delete member';
        try {
            const errorData = await response.json();
            console.error('Backend Error Details (deleteMember):', errorData);
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            console.error('Failed to parse error response');
        }
        throw new Error(errorMessage);
    }
}

