'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getMyWithdrawals,
  createWithdrawal,
  type CreateWithdrawalPayload,
} from '../lib/api';
import { AUTH_ME_QUERY_KEY } from './use-auth-me';

const WITHDRAWALS_QUERY_KEY = ['withdrawals', 'me'] as const;

export function useWithdrawals(token: string | null) {
  return useQuery({
    queryKey: [...WITHDRAWALS_QUERY_KEY, token ?? 'none'],
    queryFn: () => getMyWithdrawals(token!),
    enabled: !!token,
  });
}

export function useCreateWithdrawal(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWithdrawalPayload) =>
      createWithdrawal(token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WITHDRAWALS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}

export { WITHDRAWALS_QUERY_KEY };
