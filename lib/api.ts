/**
 * API base URL: same host as the app, port 3002.
 * Use NEXT_PUBLIC_API_URL in env, or fallback for local dev.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Browser: use env or derive from current origin with port 3002
    const env = process.env.NEXT_PUBLIC_API_URL;
    if (env) return env.replace(/\/$/, '');
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3002`;
  }
  // SSR: use env or default
  return process.env.NEXT_PUBLIC_API_URL || 'http://buymeapencil.ir/api';
}

const AUTH_TOKEN_KEY = 'accessToken';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export interface SignInResponse {
  accessToken: string;
}

export async function signIn(
  email: string,
  password: string
): Promise<SignInResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data as { message?: string }).message ??
      (data as { error?: string }).error ??
      `Sign in failed (${res.status})`;
    throw new Error(msg);
  }
  const accessToken = (data as SignInResponse).accessToken;
  if (!accessToken || typeof accessToken !== 'string') {
    throw new Error('Invalid response: missing accessToken');
  }
  return { accessToken };
}

export interface AuthMeResponse {
  id: string;
  email: string;
  name: string;
  type: string;
}

export async function fetchAuthMe(token: string): Promise<AuthMeResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data as { message?: string }).message ??
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as AuthMeResponse;
}

// Sign-up (OTP)
export async function requestSignUpOtp(email: string): Promise<{ message: string }> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/auth/sign-up/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data as { message?: string }).message ??
      (data as { error?: string }).error ??
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as { message: string };
}

export async function verifySignUp(
  email: string,
  code: string,
  name: string,
  password: string
): Promise<SignInResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/auth/sign-up/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, name, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data as { message?: string }).message ??
      (data as { error?: string }).error ??
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  const accessToken = (data as SignInResponse).accessToken;
  if (!accessToken || typeof accessToken !== 'string') {
    throw new Error('Invalid response: missing accessToken');
  }
  return { accessToken };
}

// Forgot password (OTP)
export async function requestForgotPasswordOtp(
  email: string
): Promise<{ message: string }> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/auth/forgot-password/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data as { message?: string }).message ??
      (data as { error?: string }).error ??
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as { message: string };
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<{ message: string }> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/auth/forgot-password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data as { message?: string }).message ??
      (data as { error?: string }).error ??
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as { message: string };
}

export interface PayResponse {
  checkoutUrl: string;
}

export interface PayError {
  message?: string;
  error?: string;
}

export interface CreatePayOptions {
  userName?: string;
  message?: string;
}

export async function createPay(
  amount: number,
  options?: CreatePayOptions
): Promise<PayResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      userName: options?.userName,
      message: options?.message,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (data as PayError).message ??
      (data as PayError).error ??
      data?.message ??
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  const url = (data as any).data.checkoutUrl;
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid response: missing checkoutUrl');
  }

  return { checkoutUrl: url };
}
