export type CarrierType = 'GHN' | 'GHTK' | 'AHAMOVE';
export type PaymentMethodType = 'VNPAY_QR' | 'CREDIT_CARD' | 'COD';

export interface PresetAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export interface PlacedOrder {
  orderId: string;
  trackingId: string;
  totalAmount: number | string;
  [key: string]: any;
}

export const DEFAULT_USER_ID =
  process.env.NEXT_PUBLIC_DEFAULT_USER_ID || '33333333-3333-3333-3333-333333333333';

export const PRESET_ADDRESSES: PresetAddress[] = [
  {
    id: 'addr-1',
    label: 'Nhà riêng (Mặc định)',
    fullName: 'Flash Sale Demo Buyer',
    phone: '0988 123 456',
    address: 'Số 128 Trần Hưng Đạo, Phường Phạm Ngũ Lão',
    city: 'TP. Hồ Chí Minh',
  },
  {
    id: 'addr-2',
    label: 'Văn phòng làm việc',
    fullName: 'Flash Sale Demo Buyer',
    phone: '0988 123 456',
    address: 'Tầng 18, Toà nhà Bitexco Financial Tower, Phường Bến Nghé',
    city: 'TP. Hồ Chí Minh',
  },
];
