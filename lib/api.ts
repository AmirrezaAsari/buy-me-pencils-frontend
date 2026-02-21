/**
 * API base URL: same host as the app, port 3002.
 * Use NEXT_PUBLIC_API_URL in env, or fallback for local dev.
 */
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Browser: use env or derive from current origin with port 3002
    const env = process.env.NEXT_PUBLIC_API_URL;
    if (env) return env.replace(/\/$/, '');
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3002`;
  }
  // SSR: use env or default
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
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

// --- Profile (authenticated) ---
export async function updateProfile(
  token: string,
  data: { name?: string; password?: string }
): Promise<AuthMeResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/auth/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (body as { message?: string }).message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return body as AuthMeResponse;
}

// --- Card info (authenticated) ---
export interface CardInfoResponse {
  id: string;
  cardNumber: string;
  holderName: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCardInfo(token: string): Promise<CardInfoResponse[]> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/card-info`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data as { message?: string }).message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as CardInfoResponse[];
}

export async function createCardInfo(
  token: string,
  data: { cardNumber: string; holderName: string }
): Promise<CardInfoResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/card-info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (body as { message?: string }).message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return body as CardInfoResponse;
}

export async function updateCardInfo(
  token: string,
  id: string,
  data: { cardNumber?: string; holderName?: string }
): Promise<CardInfoResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/card-info/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (body as { message?: string }).message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return body as CardInfoResponse;
}
