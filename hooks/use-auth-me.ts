'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAuthMe, getStoredToken } from '../lib/api';

const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const;

export function useAuthMe() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getStoredToken());
  }, []);

  const query = useQuery({
    queryKey: [...AUTH_ME_QUERY_KEY, token ?? 'none'],
    queryFn: () => fetchAuthMe(token!),
    enabled: !!token,
  });

  const balance = query.data?.cryptoBalance ?? '0';
  const balanceNum = parseFloat(balance);

  return {
    ...query,
    token,
    balance,
    balanceNum,
    user: query.data,
  };
}

export { AUTH_ME_QUERY_KEY };
