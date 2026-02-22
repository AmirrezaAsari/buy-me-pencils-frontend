/**
 * TRON address: base58, starts with T, 34 characters.
 * Backend uses TronWeb for full validation; this is a quick format check.
 */
export function isValidTronAddress(address: string): boolean {
  const trimmed = (address ?? '').trim();
  return trimmed.length === 34 && /^T[a-zA-Z0-9]{33}$/.test(trimmed);
}
