'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  type AdminWithdrawalResponse,
} from '../lib/api';

const ADMIN_WITHDRAWALS_QUERY_KEY = ['admin', 'withdrawals'] as const;

export function useAdminWithdrawals(token: string | null) {
  return useQuery({
    queryKey: [...ADMIN_WITHDRAWALS_QUERY_KEY, token ?? 'none'],
    queryFn: () => getAdminWithdrawals(token!),
    enabled: !!token,
  });
}

export function useApproveWithdrawal(token: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (withdrawalId: string) => approveWithdrawal(token!, withdrawalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_WITHDRAWALS_QUERY_KEY });
    },
  });
}

export function useRejectWithdrawal(token: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (withdrawalId: string) => rejectWithdrawal(token!, withdrawalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_WITHDRAWALS_QUERY_KEY });
    },
  });
}

export { ADMIN_WITHDRAWALS_QUERY_KEY };
export type { AdminWithdrawalResponse };
