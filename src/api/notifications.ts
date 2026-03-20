
const BASE_URL = import.meta.env.VITE_API_BASE;

function getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export interface NotificationRule {
    warningThreshold: number | null;
    criticalThreshold: number | null;
    thresholdUnit: string | null;
    severity: string | null;
    immediateEmail: boolean;
    resolvedAlert: boolean | null;
    sendWebHook: boolean;
    type: string;
}

export interface NotificationConf {
    account: string;
    rules: {
        [key: string]: NotificationRule;
    };
}

export async function getNotificationConfDefault(): Promise<NotificationConf> {
    const response = await fetch(`${BASE_URL}/notificationsConf/default`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        let errorMessage = 'Failed to fetch notification settings';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            console.error('Failed to parse error response');
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function updateNotificationConfDefault(data: NotificationConf): Promise<NotificationConf> {
    const response = await fetch(`${BASE_URL}/notificationsConf/default`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        let errorMessage = 'Failed to update notification settings';
        try {
            const errorData = await response.json();
            console.error('Backend Error Details:', errorData);
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            console.error('Failed to parse error response');
        }
        throw new Error(errorMessage);
    }
    return response.json();
}
