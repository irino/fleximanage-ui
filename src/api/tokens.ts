import { api } from './client';
import type { components } from './schema';

export type Token = components['schemas']['Token'];
export type TokenRequest = components['schemas']['TokenRequest'];

/**
 * Get all registration tokens.
 */
export async function getTokens(): Promise<Token[]> {
    const { data, error } = await api.GET('/tokens');
    if (error) throw error;
    return data as Token[];
}

/**
 * Create a new registration token.
 * @param tokenData Token request parameters.
 */
export async function createToken(tokenData: TokenRequest): Promise<Token> {
    const { data, error } = await api.POST('/tokens', {
        body: tokenData,
    });
    if (error) throw error;
    return data as Token;
}

/**
 * Delete a registration token.
 * @param id The token ID.
 */
export async function deleteToken(id: string): Promise<void> {
    const { error } = await api.DELETE('/tokens/{id}', {
        params: {
            path: { id },
        },
    });
    if (error) throw error;
}
