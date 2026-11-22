export interface OrderMetadata {
  shippingAddress?: {
    fullName: string;
    phone: string;
    address: string;
    city?: string;
  };
  paymentMethod?: string;
  carrier?: string;
  carrierId?: string;
  waybillCode?: string;
  shipperInfo?: {
    name: string;
    phone: string;
    licensePlate?: string;
    hub?: string;
    photo?: string;
  };
  packageDetails?: {
    weightGrams: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    chargeableGrams: number;
    shippingFee: number;
  };
  warehouse?: {
    id: string;
    name: string;
    address: string;
  };
  channel?: string;
  shelfLocation?: string;
  callVerification?: 'VERIFIED' | 'PENDING_CALL' | 'NO_ANSWER' | 'UNREACHABLE';
  internalNote?: string;
  tags?: string[];
  failedReason?: string;
  failedAttempts?: number;
  scheduledReDeliveryDate?: string;
  timeline?: Array<{
    time: string;
    title: string;
    actor: string;
    note?: string;
    location?: string;
  }>;
}

class OrderMetadataStore {
  private store = new Map<string, OrderMetadata>();

  get(orderId: string): OrderMetadata | undefined {
    return this.store.get(orderId);
  }

  set(orderId: string, metadata: Partial<OrderMetadata>): OrderMetadata {
    const existing = this.store.get(orderId) || {};
    const updated: OrderMetadata = {
      ...existing,
      ...metadata,
      shippingAddress: metadata.shippingAddress || existing.shippingAddress,
      tags: metadata.tags || existing.tags || [],
      timeline: metadata.timeline || existing.timeline || [],
    };
    this.store.set(orderId, updated);
    return updated;
  }

  addTimelineEvent(
    orderId: string,
    event: { time?: string; title: string; actor: string; note?: string; location?: string },
  ) {
    const meta = this.store.get(orderId) || {};
    const timeline = meta.timeline ? [...meta.timeline] : [];
    timeline.push({
      time: event.time || new Date().toISOString(),
      title: event.title,
      actor: event.actor,
      note: event.note,
      location: event.location,
    });
    meta.timeline = timeline;
    this.store.set(orderId, meta);
  }

  has(orderId: string): boolean {
    return this.store.has(orderId);
  }
}

export const orderMetadataStore = new OrderMetadataStore();
