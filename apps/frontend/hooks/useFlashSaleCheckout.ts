'use client';

import { useState, useCallback, useRef } from 'react';
import { apiClient, CheckoutResponse } from '../lib/api-client';

export function useFlashSaleCheckout(flashSaleId: string, productId: string, userId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerCheckout = useCallback(
    async (quantity: number = 1) => {
      if (isSubmitting || isThrottled) {
        return;
      }

      setIsSubmitting(true);
      setError(null);

      // 1. Enforce 3-5s button debounce/throttle
      setIsThrottled(true);
      throttleTimerRef.current = setTimeout(() => {
        setIsThrottled(false);
      }, 3500);

      try {
        // 2. Fetch single-use Action Token
        const tokenRes = await apiClient.getActionToken(flashSaleId, userId);
        const actionToken = tokenRes.actionToken;

        // 3. Generate client idempotency key (UUIDv4)
        const idempotencyKey = crypto.randomUUID ? crypto.randomUUID() : 'idemp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

        // 4. Submit checkout request
        const res = await apiClient.checkout({
          flashSaleId,
          productId,
          userId,
          quantity,
          actionToken,
          idempotencyKey,
        });

        setCheckoutResult(res);
        setTrackingId(res.orderTrackingId);
        setIsModalOpen(true);
      } catch (err: any) {
        setError(err.message || 'Checkout failed');
        // Still open modal to show error/sold out state if applicable
        setIsModalOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [flashSaleId, productId, userId, isSubmitting, isThrottled],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    triggerCheckout,
    isSubmitting,
    isThrottled,
    trackingId,
    checkoutResult,
    error,
    isModalOpen,
    closeModal,
  };
}
