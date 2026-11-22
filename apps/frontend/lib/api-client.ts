const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ActionTokenResponse {
  actionToken: string;
  flashSaleId: string;
  userId: string;
  expiresInSeconds: number;
}

export interface StockResponse {
  flashSaleId: string;
  stock: number;
}

export interface CheckoutResponse {
  orderTrackingId: string;
  status: string;
  message: string;
  flashSaleId: string;
  productId: string;
  quantity: number;
  estimatedWaitSeconds: number;
  statusCode?: number;
  idempotentReplay?: boolean;
}

export interface OrderStatusResponse {
  trackingId: string;
  status: string;
  orderId?: string;
  totalAmount?: number | string;
  source?: string;
  reason?: string;
  updated_at?: string;
}

export const apiClient = {
  /**
   * Fetches real-time stock
   */
  async getStock(flashSaleId: string): Promise<StockResponse> {
    const res = await fetch(`${API_BASE_URL}/api/v1/flash-sale/${flashSaleId}/stock`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch stock: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Retrieves single-use Action Token with 30s TTL
   */
  async getActionToken(flashSaleId: string, userId: string): Promise<ActionTokenResponse> {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/flash-sale/${flashSaleId}/token?userId=${encodeURIComponent(userId)}`,
      { cache: 'no-store' },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Failed to acquire action token');
    }
    return res.json();
  },

  /**
   * Executes high-concurrency checkout
   */
  async checkout(payload: {
    flashSaleId: string;
    productId: string;
    userId: string;
    quantity: number;
    actionToken: string;
    idempotencyKey: string;
  }): Promise<CheckoutResponse> {
    const res = await fetch(`${API_BASE_URL}/api/v1/flash-sale/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': payload.idempotencyKey,
        'X-Action-Token': payload.actionToken,
        'X-User-Id': payload.userId,
      },
      body: JSON.stringify({
        flashSaleId: payload.flashSaleId,
        productId: payload.productId,
        userId: payload.userId,
        quantity: payload.quantity,
      }),
    });

    const data = await res.json();
    if (!res.ok && res.status !== 202) {
      throw new Error(data.message || data.errorCode || 'Checkout failed');
    }
    return data;
  },

  /**
   * Polls order status (fallback if SSE connection fails)
   */
  async pollOrderStatus(trackingId: string): Promise<OrderStatusResponse> {
    const res = await fetch(`${API_BASE_URL}/api/v1/orders/${trackingId}/poll`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to query order status');
    }
    return res.json();
  },

  /**
   * Simulates payment settlement webhook for demo/testing
   */
  async mockPayOrder(orderId: string, amount: number) {
    const transactionId = 'mock_tx_' + Date.now();
    const res = await fetch(`${API_BASE_URL}/api/v1/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionId,
        orderId,
        amount,
        status: 'PAID',
      }),
    });
    return res.json();
  },

  /**
   * Fetches product categories with item counts
   */
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/api/v1/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  },

  /**
   * Fetches catalog products with optional category, search, and sort filters
   */
  async getProducts(params?: { categoryId?: string; search?: string; sort?: string }) {
    const query = new URLSearchParams();
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);

    const qs = query.toString();
    const url = qs ? `${API_BASE_URL}/api/v1/products?${qs}` : `${API_BASE_URL}/api/v1/products`;
    const res = await fetch(url, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  },

  /**
   * Standard Cart Checkout
   */
  async checkoutStandardOrder(payload: {
    userId: string;
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress?: { fullName: string; phone: string; address: string; city: string };
    paymentMethod?: string;
    carrier?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/v1/orders/standard-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Checkout failed');
    }
    return data;
  },

  /**
   * Fetches user's order history across monthly partitions
   */
  async getUserOrders(userId: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/orders/user/${encodeURIComponent(userId)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  },

  /**
   * Authentication APIs
   */
  async authLogin(email: string, password?: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Đăng nhập không thành công');
    }
    return data;
  },

  async authVerify2FA(email: string, code: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/verify-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Mã xác thực không hợp lệ');
    }
    return data;
  },

  async authRegister(payload: { fullName: string; email: string; password?: string; phone?: string }) {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Đăng ký tài khoản không thành công');
    }
    return data;
  },

  async authSocial(provider: string, email?: string, fullName?: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/social-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, email, fullName }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Đăng nhập liên kết thất bại');
    }
    return data;
  },
};
