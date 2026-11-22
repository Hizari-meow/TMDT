'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { apiClient } from '../lib/api-client';
import {
  DEFAULT_USER_ID,
  PRESET_ADDRESSES,
  CarrierType,
  PaymentMethodType,
  PlacedOrder,
} from './checkout/types';
import { CheckoutModalHeader } from './checkout/CheckoutModalHeader';
import { OrderSuccessView } from './checkout/OrderSuccessView';
import { AddressSection } from './checkout/AddressSection';
import { CarrierSection } from './checkout/CarrierSection';
import { PaymentSection } from './checkout/PaymentSection';
import { OrderSummarySection } from './checkout/OrderSummarySection';

export const CheckoutModal: React.FC = () => {
  const router = useRouter();
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    items,
    selectedItemIds,
    totalAmount,
    removeItem,
    discount,
    pointsDiscount,
  } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [fullName, setFullName] = useState(PRESET_ADDRESSES[0].fullName);
  const [phone, setPhone] = useState(PRESET_ADDRESSES[0].phone);
  const [address, setAddress] = useState(PRESET_ADDRESSES[0].address);
  const [city, setCity] = useState(PRESET_ADDRESSES[0].city);

  const [carrier, setCarrier] = useState<CarrierType>('AHAMOVE');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('VNPAY_QR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success state
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const handleClose = () => {
    if (!isSubmitting) {
      setIsCheckoutOpen(false);
      setPlacedOrder(null);
      setErrorMessage(null);
    }
  };

  useEffect(() => {
    if (!isCheckoutOpen) {
      setPlacedOrder(null);
      setErrorMessage(null);
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleSelectPresetAddress = (id: string) => {
    setSelectedAddressId(id);
    const found = PRESET_ADDRESSES.find((a) => a.id === id);
    if (found) {
      setFullName(found.fullName);
      setPhone(found.phone);
      setAddress(found.address);
      setCity(found.city);
    }
  };

  const checkoutItems = items.filter((i) => selectedItemIds.includes(i.productId));

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        userId: DEFAULT_USER_ID,
        items: checkoutItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
        },
        paymentMethod,
        carrier,
      };

      const result = await apiClient.checkoutStandardOrder(orderPayload);
      // Remove only the items that were purchased so other cart items remain intact
      checkoutItems.forEach((item) => removeItem(item.productId));
      setPlacedOrder(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại tồn kho.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden my-8 z-10 flex flex-col max-h-[90vh] text-[#1d1d1f]">
        {/* Header */}
        <CheckoutModalHeader onClose={handleClose} />

        {/* ORDER SUCCESS SCREEN */}
        {placedOrder ? (
          <OrderSuccessView
            placedOrder={placedOrder}
            address={address}
            city={city}
            carrier={carrier}
            onPrint={() => window.print()}
            onViewOrders={() => {
              handleClose();
              router.push('/orders');
            }}
          />
        ) : (
          /* FORM BODY */
          <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Address Selection Section */}
            <AddressSection
              selectedAddressId={selectedAddressId}
              onSelectPresetAddress={handleSelectPresetAddress}
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              setPhone={setPhone}
              address={address}
              setAddress={setAddress}
              city={city}
              setCity={setCity}
            />

            {/* Carrier Selection */}
            <CarrierSection carrier={carrier} setCarrier={setCarrier} />

            {/* Payment Method Section */}
            <PaymentSection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              totalAmount={totalAmount}
            />

            {/* Order Items Review & Footer Summary */}
            <OrderSummarySection
              checkoutItems={checkoutItems}
              discount={discount}
              pointsDiscount={pointsDiscount}
              totalAmount={totalAmount}
              isSubmitting={isSubmitting}
            />
          </form>
        )}
      </div>
    </div>
  );
};
