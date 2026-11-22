'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient, OrderStatusResponse } from '../lib/api-client';

export type QueueState = 'INITIALIZING' | 'RESERVED' | 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'SOLD_OUT' | 'FAILED';

export function useOrderStatusSSE(trackingId: string | null) {
  const [status, setStatus] = useState<QueueState>('INITIALIZING');
  const [details, setDetails] = useState<OrderStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backoffRef = useRef<number>(1000);

  useEffect(() => {
    if (!trackingId) {
      setStatus('INITIALIZING');
      setDetails(null);
      return;
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const sseUrl = `${API_BASE_URL}/api/v1/orders/${trackingId}/status`;

    // 1. Establish Server-Sent Events stream
    const es = new EventSource(sseUrl);
    eventSourceRef.current = es;

    es.onopen = () => {
      setIsLive(true);
      setError(null);
    };

    es.addEventListener('status_update', (event) => {
      try {
        const data = JSON.parse(event.data);
        setDetails(data);
        if (data.status) {
          setStatus(data.status as QueueState);
        }

        // Close connection if terminal state
        if (['PAID', 'CANCELLED', 'FAILED'].includes(data.status)) {
          es.close();
          setIsLive(false);
        }
      } catch (e) {
        console.error('Failed to parse SSE payload', e);
      }
    });

    es.onerror = () => {
      // SSE connection dropped; initiate exponential backoff polling fallback
      setIsLive(false);
      es.close();

      const startPolling = async () => {
        try {
          const pollData = await apiClient.pollOrderStatus(trackingId);
          setDetails(pollData);
          if (pollData.status) {
            setStatus(pollData.status as QueueState);
          }

          if (['PAID', 'CANCELLED', 'FAILED'].includes(pollData.status)) {
            return;
          }

          // Next poll with exponential backoff (up to 5s)
          backoffRef.current = Math.min(backoffRef.current * 1.5, 5000);
          pollTimerRef.current = setTimeout(startPolling, backoffRef.current);
        } catch (err: any) {
          setError(err.message);
        }
      };

      pollTimerRef.current = setTimeout(startPolling, backoffRef.current);
    };

    return () => {
      if (es) {
        es.close();
      }
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, [trackingId]);

  return {
    status,
    details,
    error,
    isLive,
  };
}
