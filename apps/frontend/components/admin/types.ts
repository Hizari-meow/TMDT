export type AdminTabId =
  | 'products'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'marketing'
  | 'finance'
  | 'logistics'
  | 'overview'
  | 'system';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  category?: string;
  brand?: string;
  sku?: string;
  variants?: any[];
  images?: string[];
  [key: string]: any;
}

export interface OrderItem {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user?: any;
  items?: any[];
  shippingFee?: number;
  carrier?: string;
  trackingCode?: string;
  [key: string]: any;
}

export interface CustomerItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  tier: string;
  totalSpent: number;
  totalOrders: number;
  loyaltyPoints: number;
  segment?: string;
  tags?: string[];
  [key: string]: any;
}

export interface WarehouseItem {
  id: string;
  name: string;
  code: string;
  location?: string;
  totalOnHand?: number;
  totalReserved?: number;
  totalAvailable?: number;
  [key: string]: any;
}

export interface InventoryStockItem {
  id: string;
  productId: string;
  warehouseId: string;
  onHand: number;
  reserved: number;
  available: number;
  warehouse?: WarehouseItem;
  product?: ProductItem;
  [key: string]: any;
}

export interface StockLedgerItem {
  id: string;
  type: string;
  quantity: number;
  balanceBefore: number;
  balanceAfter: number;
  performedBy: string;
  note?: string;
  createdAt: string;
  warehouse?: WarehouseItem;
  product?: ProductItem;
  [key: string]: any;
}

export interface TemporaryHoldItem {
  id: string;
  orderId: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  status: string;
  expiresAt: string;
  product?: ProductItem;
  warehouse?: WarehouseItem;
  [key: string]: any;
}

export interface ShipmentItem {
  id: string;
  orderId: string;
  carrier: string;
  trackingCode: string;
  status: string;
  codAmount: number;
  shippingFee: number;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  deliveredAt?: string;
  createdAt: string;
  [key: string]: any;
}

export interface FinanceTransactionItem {
  id: string;
  orderId: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
  [key: string]: any;
}

export interface EInvoiceItem {
  id: string;
  orderId: string;
  invoiceNumber: string;
  buyerName: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  status: string;
  cqtCode?: string;
  issuedAt: string;
  [key: string]: any;
}

export interface CodReconciliationItem {
  id: string;
  batchCode: string;
  carrier: string;
  totalOrders: number;
  totalCodExpected: number;
  totalCodReceived: number;
  discrepancyAmount: number;
  status: string;
  settledAt?: string;
  createdAt: string;
  [key: string]: any;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorEmail: string;
  role: string;
  action: string;
  resource: string;
  entityId: string;
  ip: string;
  severity: string;
  isSensitive: boolean;
  beforeValue?: string;
  afterValue?: string;
  description: string;
  timestamp: string;
  [key: string]: any;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usedCount: number;
  maxUsage: number;
  status: string;
  expiresAt: string;
  [key: string]: any;
}

export interface CmsPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: string;
  views: number;
  publishedAt: string;
  seoTitle?: string;
  seoDesc?: string;
  content?: string;
  tags?: string[];
  [key: string]: any;
}
