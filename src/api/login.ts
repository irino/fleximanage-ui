// src/api/login.ts
// import type { components } from "./schema";

// Get types from OpenAPI schema
// type LoginResponse = components['schemas']['LoginResponse']; // Deprecated regarding actual behavior

/**
 * User Login
 * @param username Username (Email Address)
 * @param password Password
 * @param captcha Captcha (usually empty string)
 * @returns Login token and user information
 */
export async function login(
  username: string,
  password: string,
  captcha: string = ''
): Promise<any> { // Changing return type to any temporarily to allow flexibility
  try {
    const url = `${import.meta.env.VITE_API_BASE}/users/login`
    const requestBody = {
      username,
      password,
      captcha,
    };

    console.log('🔐 Login attempt:', {
      url,
      username,
      hasCaptcha: !!captcha,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Check headers for token
    // Based on curl output, the token is in 'Refresh-JWT'
    const token = response.headers.get('Refresh-JWT') ||
      response.headers.get('Authorization') ||
      response.headers.get('x-auth-token');

    console.log('📥 Login response headers:', {
      hasRefreshJwt: response.headers.has('Refresh-JWT'),
      authorization: !!response.headers.get('Authorization'),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Login failed:', {
        status: response.status,
        error: errorData,
      });

      if (response.status === 401) {
        throw new Error('Invalid email or password');
      }

      if (response.status === 403) {
        throw new Error('Account is not verified');
      }

      throw new Error(
        errorData.message || `Login failed with status ${response.status}`
      );
    }

    const data = await response.json();

    let userId = data.userId || data.username;

    // If we have a token but no userId, try to decode specific fields from the JWT
    if (token && !data.userId) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        if (payload._id) {
          userId = payload._id;
        }
        console.log('🔓 Decoded JWT payload:', { _id: payload._id, username: payload.username });
      } catch (e) {
        console.warn('Failed to decode JWT for userId:', e);
      }
    }

    // Construct a standardized response object
    const result = {
      ...data,
      token: token || data.token,
      userId: userId
    };

    console.log('✅ Login successful processed:', {
      userId: result.userId,
      hasToken: !!result.token,
      tokenSource: token ? 'header' : (data.token ? 'body' : 'none')
    });

    return result;
  } catch (error) {
    console.error('🔴 Login error:', error);

    if (error instanceof TypeError) {
      throw new Error('Network error: Please check the connection to the backend');
    }

    throw error;
  }
}

/**
 * Logout
 * @param token Authentication token
 */
export async function logout(token: string): Promise<void> {
  try {
    console.log('🚪 Logout attempt');

    const response = await fetch(`${import.meta.env.VITE_API_BASE}/users/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    console.log('✅ Logout successful');
  } catch (error) {
    console.error('🔴 Logout error:', error);
    throw error;
  }
}
