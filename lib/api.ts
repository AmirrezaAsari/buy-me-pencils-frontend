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
  return process.env.NEXT_PUBLIC_API_URL || 'http://buymeapencil.ir/api';
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
