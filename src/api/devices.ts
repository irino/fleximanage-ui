
const BASE_URL = import.meta.env.VITE_API_BASE;

function getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export interface DeviceInterface {
    name: string; // e.g. "eth0"
    _id?: string;
    type?: string; // e.g. "WAN", "LAN"
    IPv4?: string;
    IPv6?: string;
    PublicIP?: string;
    linkStatus?: string; // "up", "down"
    mac?: string;
}

export interface Device {
    _id: string;
    name: string;
    description?: string;
    isConnected?: boolean;
    isApproved?: boolean;
    deviceStatus?: string;
    interfaces?: DeviceInterface[];
    site?: string;
    hostname?: string;
    machineId?: string;
    org?: string;
    account?: string;
    sync?: string;
    updatedAt?: string;
    createdAt?: string;
    versions?: {
        agent?: string;
        router?: string;
        device?: string;
        vpp?: string;
        frr?: string;
    };
}

export async function getDevices(): Promise<Device[]> {
    const response = await fetch(`${BASE_URL}/devices`, {
        headers: getHeaders()
    });

    if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 500 && errorText.includes("Cannot read properties of null")) {
            return [];
        }
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        throw new Error(`Failed to fetch devices: ${response.status}`);
    }

    return response.json();
}

export async function getDevice(id: string): Promise<Device> {
    const response = await fetch(`${BASE_URL}/devices/${id}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch device');
    return response.json();
}

export async function deleteDevice(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/devices/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete device');
}
