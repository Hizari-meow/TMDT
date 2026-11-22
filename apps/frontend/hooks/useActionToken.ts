'use client';

import { useState, useCallback } from 'react';
import { apiClient, ActionTokenResponse } from '../lib/api-client';

export function useActionToken(flashSaleId: string, userId: string) {
  const [tokenData, setTokenData] = useState<ActionTokenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acquireToken = useCallback(async (): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getActionToken(flashSaleId, userId);
      setTokenData(data);
      return data.actionToken;
    } catch (err: any) {
      setError(err.message || 'Failed to acquire token');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [flashSaleId, userId]);

  return {
    actionToken: tokenData?.actionToken,
    expiresInSeconds: tokenData?.expiresInSeconds,
    loading,
    error,
    acquireToken,
  };
}
