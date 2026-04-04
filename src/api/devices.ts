import { api } from './client';

export interface DeviceInterface {
    _id: string;
    name: string;
    type: string;
    IPv4?: string;
    IPv4Mask?: string;
    IPv6?: string;
    IPv6Mask?: string;
    PublicIP?: string;
    PublicPort?: string;
    NatType?: string;
    useStun?: boolean;
    useFixedPublicPort?: boolean;
    internetAccess?: string;
    monitorInternet?: boolean;
    linkStatus?: string;
    gateway?: string;
    metric?: string;
    mtu?: number;
    dhcp?: string;
    MAC?: string;
    routing?: string;
    isAssigned?: boolean;
    driver?: string;
    devId?: string;
    parentDevId?: string;
    vlanTag?: string;
    locked?: boolean;
    pathlabels?: string[];
    deviceType?: string;
    configuration?: any;
    deviceParams?: any;
    qosPolicy?: any;
    bandwidthMbps?: {
        tx: number;
        rx: number;
    };
    dnsServers?: string[];
    dnsDomains?: string[];
    useDhcpDnsServers?: boolean;
    ospf?: {
        area: string;
        keyId: string;
        key: string;
    };
    isPublicAddressRateLimited?: boolean;
}

export interface Device {
    _id: string;
    org: string;
    description: string;
    deviceToken: string;
    machineId: string;
    site: string;
    hostname: string;
    serial?: string;
    name: string;
    isApproved: boolean;
    fromToken: string;
    account: string;
    ipList: string;
    policies?: {
        multilink: { policy: any; status: string; requestTime: any };
        firewall: { policy: any; status: string; requestTime: any };
        qos: { policy: any; status: string; requestTime: any };
    };
    applications: any[];
    labels: string[];
    upgradeSchedule: {
        jobQueued: boolean;
        _id: string;
        time: any;
    };
    sync: {
        state: string;
        hash: string;
        trials: number;
        autoSync: string;
    };
    ospf?: {
        helloInterval: number;
        deadInterval: number;
        redistributeBgp: boolean;
        custom: string;
    };
    coords: [number, number];
    bgp?: {
        enable: boolean;
        localASN: string;
        keepaliveInterval: string;
        holdInterval: string;
        redistributeOspf: boolean;
        custom: string;
        neighbors: any[];
    };
    routingFilters: any[];
    cpuInfo: {
        hwCores: number;
        grubCores: number;
        vppCores: number;
        configuredVppCores: number;
        powerSaving: boolean;
    };
    distro: {
        version: string;
        codename: string;
    };
    advancedRouting?: {
        custom: string;
    };
    isConnected: boolean;
    state: string;
    orgInfo: {
        vxlanPort: string;
    };
    versions: {
        agent: string;
        router: string;
        device: string;
    };
    interfaces: DeviceInterface[];
    staticroutes: any[];
    dhcp: any[];
    deviceSpecificRulesEnabled: boolean;
    firewall: {
        rules: any[];
    };
    deviceStatus?: any;
}

export async function getDevices(): Promise<Device[]> {
    const { data, error, response } = await api.GET('/devices');

    if (error) {
        if (response.status === 500 && JSON.stringify(error).includes("Cannot read properties of null")) {
            return [];
        }
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        throw new Error(`Failed to fetch devices: ${response.status}`);
    }

    return data as Device[];
}

export async function getDevice(id: string): Promise<Device> {
    const { data, error } = await api.GET('/devices/{id}', {
        params: {
            path: { id }
        }
    });
    if (error) throw new Error('Failed to fetch device');

    // Handle case where API returns [device] or { device: { ... } }
    const rawData = data as any;
    if (Array.isArray(rawData)) {
        return rawData[0] as Device;
    }
    if (rawData && rawData.device) {
        return rawData.device as Device;
    }

    return rawData as Device;
}

export async function updateDevice(id: string, device: Partial<Device>): Promise<Device> {
    const { data, error } = await api.PUT('/devices/{id}', {
        params: {
            path: { id }
        },
        body: device as any
    });
    if (error) throw new Error('Failed to update device');
    return data as Device;
}

export async function deleteDevice(id: string): Promise<void> {
    const { error } = await api.DELETE('/devices/{id}', {
        params: {
            path: { id }
        }
    });
    if (error) throw new Error('Failed to delete device');
}
