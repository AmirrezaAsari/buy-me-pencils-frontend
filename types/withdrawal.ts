/**
 * Withdrawal feature types (API response and payloads).
 * API client lives in lib/api.ts.
 */

export type WithdrawalStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'rejected';

export interface Withdrawal {
  id: string;
  amount: number;
  walletAddress: string;
  status: WithdrawalStatus;
  txHash?: string;
  failureReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface CreateWithdrawalPayload {
  amount: number;
  walletAddress: string;
}
