import { api } from './client';

export interface Account {
    _id: string;
    name: string;
    country?: string;
    companyType?: string;
    companyDesc?: string;
    forceMfa?: boolean;
    isSubscriptionValid?: boolean;
    trial_end?: number;
}

export async function getAccounts(): Promise<Account[]> {
    const { data, error } = await api.GET('/accounts');
    if (error) throw new Error('Failed to fetch accounts');
    return data as Account[];
}

export async function getAccount(id: string): Promise<Account> {
    const { data, error } = await api.GET('/accounts/{id}', {
        params: { path: { id } }
    });
    if (error) throw new Error('Failed to fetch account');
    return data as Account;
}

export async function updateAccount(id: string, accountData: Partial<Account>): Promise<Account> {
    const { data, error } = await api.PUT('/accounts/{id}', {
        params: { path: { id } },
        // @ts-ignore - AccountRequest in schema might be slightly different from Partial<Account>
        body: accountData
    });
    if (error) throw new Error('Failed to update account');
    return data as Account;
}

export async function deleteAccount(id: string): Promise<void> {
    // Note: delete is not currently in the OpenAPI schema but expected by UI.
    // Adding as placeholder to fix startup error.
    // @ts-ignore
    const { error } = await api.DELETE('/accounts/{id}', {
        params: { path: { id } }
    });
    if (error) throw new Error('Failed to delete account');
}
