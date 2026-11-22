'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  CheckCircle,
  Truck,
  RotateCcw,
  Zap,
  Search,
  Filter,
  DollarSign,
  BarChart3,
  Boxes,
  Tag,
  Shield,
  Clock,
  Printer,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Download,
  Upload,
  FileText,
  FileCheck,
  CreditCard,
  Building,
  CheckSquare,
  Square,
  QrCode,
  Send,
  AlertCircle,
  Layers,
  Globe,
  Sliders,
  Sparkles,
  Calendar,
  Lock,
  Calculator,
  Percent,
  Eye,
  X,
  ChevronRight,
  FolderTree,
  Award,
  ListFilter,
  Image,
  Check,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  Play,
  Copy,
  Warehouse,
  Bell,
  History,
  PhoneCall,
  CheckCheck,
  Undo2,
  XCircle,
  AlertOctagon,
  ShieldAlert,
  Barcode,
  ClipboardList,
  MapPin,
  Phone,
  ShieldCheck,
  Mail,
  MessageSquare,
  Target,
  UserCheck,
  Star,
  Heart,
  Share2,
  PieChart,
  Activity,
  ShoppingBag,
  Smartphone,
  Monitor,
  Video,
  Store,
  MousePointer,
  Flame,
  FileSpreadsheet,
  PlayCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  Key,
  Database,
  Server,
  Image as ImageIcon
} from 'lucide-react';


export interface AdminContextType {
  inventory: any[];
  orders: any[];
  returnRequests: any[];
  customers: any[];
  warehouses: any[];
  temporaryHolds: any[];
  stockLedger: any[];
  coupons: any[];
  carriers: any[];
  auditLogs: any[];
  categoryTree: any[];
  dbCategories: any[];
  brands: any[];
  attributeGroups: any[];
  filteredProducts: any[];
  selectedOrderIds: any[];
  selectedProductIds: any[];
  productForm: {
    variants: any[];
    attributes: any[];
    media: any[];
    dimensions: any;
    [key: string]: any;
  };
  batchJob: {
    logs: any[];
    [key: string]: any;
  };
  csvValidationResult: {
    errors: any[];
    warnings: any[];
    detailedReport: any[];
    [key: string]: any;
  } | null;
  automationWorkflows: any[];
  internalNoteModal: { tags: any[]; [key: string]: any } | null;
  printDocument: { batchOrders: any[]; order: any; [key: string]: any };
  [key: string]: any;
}

export const AdminContext = createContext<AdminContextType | null>(null);


export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'inventory'
    | 'orders'
    | 'customers'
    | 'marketing'
    | 'finance'
    | 'logistics'
    | 'system'
  >('products');

  // Sub-tabs for 4.1. Quản lý sản phẩm
  const [productSubTab, setProductSubTab] = useState<
    'list' | 'categories' | 'brands' | 'attributes' | 'batch_jobs'
  >('list');

  // Sub-tabs for 4.2. Quản lý kho (Inventory)
  const [inventorySubTab, setInventorySubTab] = useState<
    'realtime' | 'alerts' | 'warehouses' | 'ledger' | 'omnichannel'
  >('realtime');

  // 4.2 Multi-warehouse & Omnichannel States
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [temporaryHolds, setTemporaryHolds] = useState<any[]>([]);
  const [safeBufferPercent, setSafeBufferPercent] = useState<number>(90);
  const [isOmnichannelSyncing, setIsOmnichannelSyncing] = useState<boolean>(false);
  const [omnichannelSyncResult, setOmnichannelSyncResult] = useState<any>(null);
  const [alertChannels, setAlertChannels] = useState<{ email: boolean; slack: boolean; zalo: boolean }>({
    email: true,
    slack: true,
    zalo: true,
  });
  const [selectedLedgerFilter, setSelectedLedgerFilter] = useState<string>('ALL');
  const [selectedLedgerWarehouse, setSelectedLedgerWarehouse] = useState<string>('ALL');

  // Core Data States
  const [overview, setOverview] = useState<any>(null);
  const [funnelData, setFunnelData] = useState<any>(null);

  // 4.8. Báo Cáo & Phân Tích Chuyên Sâu (Enterprise BI & Analytics Suite)
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState<'today' | '7days' | '30days' | 'quarter' | 'year'>('30days');
  const [analyticsChannel, setAnalyticsChannel] = useState<'ALL' | 'website' | 'shopee' | 'tiktok' | 'pos'>('ALL');
  const [analyticsRole, setAnalyticsRole] = useState<'ceo' | 'cmo' | 'cpo'>('ceo');
  const [analyticsActiveSubTab, setAnalyticsActiveSubTab] = useState<'revenue' | 'products' | 'funnel' | 'behavior' | 'cohort' | 'schedules'>('revenue');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSessionReplayModalOpen, setIsSessionReplayModalOpen] = useState(false);
  const [selectedSessionReplay, setSelectedSessionReplay] = useState<any>(null);
  const [scheduleForm, setScheduleForm] = useState({
    name: 'Báo Cáo Tự Động Định Kỳ TechZone',
    frequency: 'WEEKLY',
    recipients: 'ceo@techzone.vn, cfo@techzone.vn',
    format: 'PDF',
    roleView: 'ceo',
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState<Record<string, number>>({});
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);
  const [inventory, setInventory] = useState<any[]>([]);
  const [stockLedger, setStockLedger] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [finance, setFinance] = useState<any>(null);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [attributeGroups, setAttributeGroups] = useState<any[]>([]);
  const [isNewAttrModalOpen, setIsNewAttrModalOpen] = useState(false);
  const [newAttrForm, setNewAttrForm] = useState({
    categoryType: 'Thiết Bị Điện Tử & Di Động',
    name: '',
    options: '',
    isFilter: true,
  });
  const [loading, setLoading] = useState(true);

  // Filters & Selection
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('ALL');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSeverity, setAuditSeverity] = useState('ALL');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // ==========================================
  // 4.9. QUẢN TRỊ HỆ THỐNG & RBAC STATES
  // ==========================================
  const [systemActiveSubTab, setSystemActiveSubTab] = useState<
    'rbac' | 'audit' | 'cms' | 'config' | 'integrations' | 'maintenance'
  >('rbac');
  const [auditResourceFilter, setAuditResourceFilter] = useState<string>('ALL');
  const [selectedAuditDiff, setSelectedAuditDiff] = useState<any | null>(null);
  const [isAuditDiffModalOpen, setIsAuditDiffModalOpen] = useState(false);

  const [selectedAdminUser, setSelectedAdminUser] = useState<any | null>(null);
  const [isUserRoleModalOpen, setIsUserRoleModalOpen] = useState(false);
  const [adminUserForm, setAdminUserForm] = useState({
    id: '',
    name: '',
    email: '',
    role: 'Super Admin',
    status: 'ACTIVE',
    ipRestricted: true,
    enforce2fa: true,
  });

  const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);
  const [cmsForm, setCmsForm] = useState({
    id: '',
    title: '',
    slug: '',
    category: 'Tin Tức Apple',
    author: 'TechZone Editor',
    status: 'PUBLISHED',
    seoTitle: '',
    seoDesc: '',
    content: '',
  });

  const [storeConfigForm, setStoreConfigForm] = useState({
    storeName: 'TechZone Flagship Store VN',
    legalEntity: 'Công Ty Cổ Phần Công Nghệ & Thương Mại TechZone Việt Nam',
    taxCode: '0109887766',
    legalRepresentative: 'Nguyễn Văn Doanh',
    hotline: '1900 8899 (Nhánh 1: CSKH, Nhánh 2: Khiếu nại)',
    supportEmail: 'hotro@techzone.vn',
    headquarters: 'Tầng 18, Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    maintenanceMode: false,
    maintenanceMessage: 'Hệ thống đang tiến hành nâng cấp hạ tầng flash sale 10.10. Vui lòng quay lại sau!',
  });

  const [isBackingUpDb, setIsBackingUpDb] = useState(false);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);

  // ==========================================
  // ENTERPRISE LINKED LIFECYCLE WORKFLOW STATE
  // ==========================================
  const [isLifecycleModalOpen, setIsLifecycleModalOpen] = useState(false);
  const [lifecycleRunning, setLifecycleRunning] = useState(false);
  const [lifecycleResult, setLifecycleResult] = useState<any | null>(null);
  const [lifecycleCarrier, setLifecycleCarrier] = useState('GHN');
  const [lifecycleCoupon, setLifecycleCoupon] = useState('TECHZONE_VIP_2M');
  const [lifecycleScenario, setLifecycleScenario] = useState('E1');

  // ==========================================
  // MODALS STATE
  // ==========================================
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<
    'basic' | 'variants' | 'attributes' | 'media' | 'seo'
  >('basic');

  const [isBatchProductModalOpen, setIsBatchProductModalOpen] = useState(false);
  const [isCsvImportModalOpen, setIsCsvImportModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isEInvoiceModalOpen, setIsEInvoiceModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isCustomer360Open, setIsCustomer360Open] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // CRM Sub-tabs & States for 4.4. Quản lý khách hàng (CRM)
  const [crmSubTab, setCrmSubTab] = useState<'list' | 'rfm_segments' | 'automation' | 'tiers'>('list');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTierFilter, setCustomerTierFilter] = useState<string>('ALL');
  const [customerLifecycleFilter, setCustomerLifecycleFilter] = useState<string>('ALL');
  const [customerSourceFilter, setCustomerSourceFilter] = useState<string>('ALL');
  const [customerBehaviorFilter, setCustomerBehaviorFilter] = useState<string>('ALL');
  const [customer360Data, setCustomer360Data] = useState<any | null>(null);
  const [customer360Loading, setCustomer360Loading] = useState(false);
  const [customer360ActiveTab, setCustomer360ActiveTab] = useState<'overview' | 'orders' | 'products' | 'interactions' | 'notes'>('overview');
  const [newCustomerNote, setNewCustomerNote] = useState('');
  const [newCustomerTag, setNewCustomerTag] = useState('');
  const [crmSegmentsData, setCrmSegmentsData] = useState<any | null>(null);
  const [campaignTarget, setCampaignTarget] = useState<{ type: 'SEGMENT' | 'CUSTOMER'; id: string; name: string }>({
    type: 'SEGMENT',
    id: 'VIP',
    name: 'Khách VIP Trung Thành',
  });
  const [campaignChannel, setCampaignChannel] = useState<'EMAIL' | 'SMS' | 'PUSH'>('EMAIL');
  const [campaignType, setCampaignType] = useState<string>('CHÀO_MỪNG');
  const [campaignCouponCode, setCampaignCouponCode] = useState('TECHZONE50');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [isSubmittingCampaign, setIsSubmittingCampaign] = useState(false);
  const [remarketingSyncLoading, setRemarketingSyncLoading] = useState<string | null>(null);

  // Automation Workflows State (5 Kịch bản tự động hóa chăm sóc)
  const [automationWorkflows, setAutomationWorkflows] = useState<Array<{
    id: string;
    name: string;
    trigger: string;
    action: string;
    channel: 'EMAIL' | 'SMS' | 'PUSH';
    voucher: string;
    active: boolean;
    openRate: string;
    conversionRate: string;
  }>>([
    {
      id: 'wf-1',
      name: 'Email Chào Mừng Thành Viên Mới',
      trigger: 'Ngay sau khi đăng ký tài khoản thành công',
      action: 'Gửi thư cảm ơn + Hướng dẫn mua sắm ưu đãi',
      channel: 'EMAIL',
      voucher: 'TECHZONE-NEW10',
      active: true,
      openRate: '78.5%',
      conversionRate: '24.2%',
    },
    {
      id: 'wf-2',
      name: 'Nhắc Nhở Giỏ Hàng Bỏ Quên (Cart Recovery)',
      trigger: 'Sau 2 giờ khách thêm hàng vào giỏ nhưng chưa thanh toán',
      action: 'Gửi thông báo đẩy + Tặng mã Freeship hỏa tốc',
      channel: 'PUSH',
      voucher: 'FREESHIP-2H',
      active: true,
      openRate: '64.0%',
      conversionRate: '18.7%',
    },
    {
      id: 'wf-3',
      name: 'Chúc Mừng Sinh Nhật Khách Hàng',
      trigger: 'Vào 08:00 sáng ngày sinh nhật của khách hàng',
      action: 'Gửi thiệp chúc mừng + Voucher độc quyền theo hạng thẻ',
      channel: 'SMS',
      voucher: 'BDAY-VIP15',
      active: true,
      openRate: '92.1%',
      conversionRate: '35.4%',
    },
    {
      id: 'wf-4',
      name: 'Xin Đánh Giá Sau Khi Giao Hàng Thành Công',
      trigger: 'Sau 24h kể từ khi đơn hàng chuyển sang DELIVERED',
      action: 'Mời đánh giá sản phẩm 5 sao để nhận 50 điểm thưởng',
      channel: 'EMAIL',
      voucher: 'REWARD-50PTS',
      active: true,
      openRate: '56.3%',
      conversionRate: '28.9%',
    },
    {
      id: 'wf-5',
      name: 'Kịch Bản "Nhớ Bạn" Cho Khách Ngủ Đông (Win-Back)',
      trigger: 'Khi khách hàng không phát sinh đơn trong hơn 60 ngày',
      action: 'Gửi bộ sưu tập sản phẩm mới + Voucher tri ân 20%',
      channel: 'EMAIL',
      voucher: 'COMEBACK-20',
      active: false,
      openRate: '42.8%',
      conversionRate: '12.1%',
    },
  ]);

  // ==========================================
  // 4.5. MARKETING & PROMOTIONS ENTERPRISE SUITE STATES
  // ==========================================
  const [marketingSubTab, setMarketingSubTab] = useState<
    'coupons_deals' | 'loyalty' | 'campaigns' | 'banners_landing' | 'ad_tracking' | 'affiliate_referral'
  >('coupons_deals');
  const [marketingData, setMarketingData] = useState<any | null>(null);

  // Marketing Modals
  const [isFlashSaleModalOpen, setIsFlashSaleModalOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [isCrossSellModalOpen, setIsCrossSellModalOpen] = useState(false);
  const [isLoyaltyAdjustModalOpen, setIsLoyaltyAdjustModalOpen] = useState(false);
  const [isMarketingCampaignModalOpen, setIsMarketingCampaignModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLandingPageModalOpen, setIsLandingPageModalOpen] = useState(false);

  // Marketing Form States
  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    type: 'PERCENTAGE',
    discountValue: 15,
    minOrderAmount: 200,
    maxDiscountAmount: 50,
    applicableCategories: 'ALL',
    targetCustomerTier: 'ALL',
    totalUsageLimit: 500,
    perCustomerLimit: 1,
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    allowFlashSaleStack: true,
    allowMultiCouponStack: false,
    description: '',
  });

  const [newFlashSaleForm, setNewFlashSaleForm] = useState({
    title: 'Flash Sale Giờ Vàng Mới',
    slotTime: '12:00 - 14:00 Ngày Mai',
    productName: 'iPhone 16 Pro 256GB - Titanium Natural',
    originalPrice: 999,
    salePrice: 599,
    stock: 50,
  });

  const [newComboForm, setNewComboForm] = useState({
    name: 'Combo Apple Ecosystem 2026',
    description: 'Trọn bộ trải nghiệm đỉnh cao ưu đãi',
    items: 'iPhone 16 Pro, AirPods Pro 2, Củ sạc 30W',
    originalPrice: 1299,
    bundlePrice: 1099,
  });

  const [newCrossSellForm, setNewCrossSellForm] = useState({
    type: 'CROSS_SELL',
    triggerProduct: 'iPhone 16 Pro 256GB',
    suggestedProduct: 'Ốp lưng Silicon MagSafe & Kính cường lực Belkin',
    discountOffer: 'Mua kèm giảm ngay 50% phụ kiện bảo vệ',
  });

  const [loyaltyAdjustForm, setLoyaltyAdjustForm] = useState({
    customerId: '33333333-3333-3333-3333-333333333333',
    customerName: 'Flash Sale Demo Buyer',
    deltaPoints: 500,
    reason: 'Tặng điểm tri ân khách hàng thân thiết VIP',
  });

  const [newMarketingCampaignForm, setNewMarketingCampaignForm] = useState({
    name: 'Chiến Dịch Khuyến Mãi Flash Sale Q4',
    channel: 'EMAIL',
    targetSegment: 'Khách VIP & Khách Thường Xuyên',
    subject: '[TechZone Deal] Mở bán đặc quyền giờ vàng thiết bị Apple',
    schedule: 'Gửi ngay',
  });

  const [newBannerForm, setNewBannerForm] = useState({
    title: 'Hero Banner: Mở Bán Flagship 2026',
    placement: 'HOMEPAGE_HERO_SLIDER',
    device: 'ALL',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&auto=format&fit=crop&q=80',
    targetUrl: '/#catalog',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
  });

  const [newLandingPageForm, setNewLandingPageForm] = useState({
    title: 'Mở Bán Đặc Quyền Flagship Deal',
    slug: '/campaign/flagship-vip-deal',
    hasLeadForm: true,
    enableAbTest: true,
    variantAName: 'Bản A (Giảm 50% Flash Sale Giá Gốc)',
    variantBName: 'Bản B (Tặng AirPods Pro 2 Khi Mua iPhone)',
  });

  // ==========================================
  // 4.6. THANH TOÁN VÀ TÀI CHÍNH STATES
  // ==========================================
  const [financeSubTab, setFinanceSubTab] = useState<
    'reconciliation' | 'revenue_profit' | 'debts_marketplace' | 'tax_reports' | 'einvoices'
  >('reconciliation');
  const [isReconcileRunning, setIsReconcileRunning] = useState(false);
  const [isAdjustEInvoiceModalOpen, setIsAdjustEInvoiceModalOpen] = useState(false);
  const [selectedEInvoice, setSelectedEInvoice] = useState<any | null>(null);
  const [isArDebtModalOpen, setIsArDebtModalOpen] = useState(false);
  const [isApDebtModalOpen, setIsApDebtModalOpen] = useState(false);

  const [newEInvoiceForm, setNewEInvoiceForm] = useState({
    orderTracking: '',
    customerName: '',
    taxCode: '',
    buyerAddress: '',
    buyerEmail: '',
    totalAmount: 999,
    vatRatePercent: 8,
    provider: 'VNPT' as 'VNPT' | 'MISA' | 'VIETTEL',
  });

  const [adjustEInvoiceForm, setAdjustEInvoiceForm] = useState({
    action: 'ĐIỀU_CHỈNH' as 'ĐIỀU_CHỈNH' | 'THAY_THẾ' | 'HỦY_BỎ',
    reason: 'Điều chỉnh giảm giá trị theo thỏa thuận đổi trả',
    adjustmentAmount: -50,
    newCustomerName: '',
    newTaxCode: '',
  });

  const [newArDebtForm, setNewArDebtForm] = useState({
    clientName: 'Công ty Cổ phần Công Nghệ Mới',
    taxCode: '0109988776',
    contractNo: 'HD-B2B-2026-102',
    totalAmount: 25000,
    paymentTerm: 'Net 30',
    dueDate: '2026-11-15',
    description: 'Cung cấp 20 máy iPhone 16 Pro cho phòng ban R&D',
  });

  const [newApDebtForm, setNewApDebtForm] = useState({
    supplierName: 'Digiworld Corporation (DGW)',
    taxCode: '0302861742',
    invoiceNo: '1C26TDW-009182',
    totalAmount: 38000,
    paymentTerm: 'Net 45',
    dueDate: '2026-11-20',
    description: 'Nhập lô hàng phụ kiện sạc không dây và tai nghe',
  });

  // ==========================================
  // 4.7. VẬN CHUYỂN VÀ LOGISTICS STATES
  // ==========================================
  const [logisticsSubTab, setLogisticsSubTab] = useState<
    'carriers' | 'calculator' | 'warehouses_mapping' | 'tracking_exceptions' | 'cod_scorecard'
  >('carriers');
  const [logisticsData, setLogisticsData] = useState<any>(null);
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState(false);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [selectedShipmentForException, setSelectedShipmentForException] = useState<any | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [selectedTrackingShipment, setSelectedTrackingShipment] = useState<any | null>(null);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [selectedLabelData, setSelectedLabelData] = useState<any | null>(null);

  const [shipmentFilterStatus, setShipmentFilterStatus] = useState('ALL');
  const [shipmentSearch, setShipmentSearch] = useState('');

  const [newShipmentForm, setNewShipmentForm] = useState({
    carrierId: 'ghn',
    orderId: '4DCB7F0C',
    warehouseId: 'WH-HN-01',
    customerName: 'Hoàng Minh Tuấn',
    customerPhone: '0912 889 912',
    deliveryAddress: 'Số 18 Phố Huế, P. Hàng Bài, Hoàn Kiếm, Hà Nội',
    weightGrams: 500,
    lengthCm: 20,
    widthCm: 15,
    heightCm: 6,
    shippingFee: 22000,
    codAmount: 999,
    insuranceFee: 15000,
    shippingMethod: 'EXPRESS',
  });

  const [warehouseForm, setWarehouseForm] = useState({
    id: '',
    name: 'Kho Vệ Tinh Hải Phòng',
    address: 'Số 12 Lê Hồng Phong, Ngô Quyền, Hải Phòng',
    province: 'Hải Phòng',
    district: 'Quận Ngô Quyền',
    ward: 'Phường Đông Khê',
    contactName: 'Đỗ Mạnh Thắng',
    contactPhone: '0225.8888.999',
    isDefault: false,
    areaSqMeters: 800,
  });

  const [exceptionForm, setExceptionForm] = useState({
    action: 'RESCHEDULE' as 'RESCHEDULE' | 'CHANGE_ADDRESS' | 'RETURN_TO_WAREHOUSE',
    scheduledDate: 'Sáng mai 03/10 (08:30 - 11:30)',
    note: 'Khách hàng bận họp buổi sáng, hẹn giao lại vào khung giờ chiều hoặc sáng mai',
    newAddress: 'Số 12 Duy Tân, Cầu Giấy, Hà Nội (Tòa nhà FPT)',
    newPhone: '0988 667 788',
    reason: 'Khách đổi ý không muốn nhận hàng hoặc không thể liên lạc sau 3 lần giao',
  });

  const [calculatorForm, setCalculatorForm] = useState({
    fromProvince: 'Hà Nội',
    toProvince: 'TP. Hồ Chí Minh',
    weightGrams: 450,
    lengthCm: 22,
    widthCm: 14,
    heightCm: 6,
    codAmount: 999,
    orderValueVnd: 1500000,
  });
  const [calculatorResult, setCalculatorResult] = useState<any>(null);
  const [isCalculatingRate, setIsCalculatingRate] = useState(false);

  // Sub-tabs for 4.3. Quản lý đơn hàng (Orders)
  const [orderSubTab, setOrderSubTab] = useState<
    'orders_list' | 'returns_list' | 'fraud_shield'
  >('orders_list');
  const [orderChannelFilter, setOrderChannelFilter] = useState<string>('ALL');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('ALL');
  const [returnRequests, setReturnRequests] = useState<any[]>([]);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Khách hàng đổi ý / Thay đổi địa chỉ');
  const [inspectReturnModal, setInspectReturnModal] = useState<any | null>(null);
  const [inspectResult, setInspectResult] = useState<'RESTOCKED' | 'DAMAGED_WRITEOFF'>('RESTOCKED');
  const [inspectNotes, setInspectNotes] = useState<string>('');
  const [selectedPrintFormat, setSelectedPrintFormat] = useState<'A4' | 'A5' | 'A6_DECAL' | 'K80'>('K80');
  const [internalNoteModal, setInternalNoteModal] = useState<{
    order: any;
    note: string;
    tags: string[];
  } | null>(null);

  // Background Job Simulation State
  const [batchJob, setBatchJob] = useState<{
    running: boolean;
    jobId: string;
    progress: number;
    total: number;
    status: 'QUEUED' | 'RUNNING' | 'COMPLETED';
    logs: string[];
  } | null>(null);

  // Print Document Modal (Supports Waybill, Picking List, VAT Invoice across A4, A5, A6 Decal, K80)
  const [printDocument, setPrintDocument] = useState<{
    type: 'WAYBILL' | 'PICKING_LIST' | 'VAT_INVOICE';
    order?: any;
    batchOrders?: any[];
    format?: 'A4' | 'A5' | 'A6_DECAL' | 'K80';
  } | null>(null);

  // Target item holders for modals
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [refundTargetOrder, setRefundTargetOrder] = useState<any>(null);

  // ==========================================
  // 4.1. COMPREHENSIVE PRODUCT FORM STATE
  // ==========================================
  const initialProductState = {
    id: '',
    name: 'Áo thun Polo Thể Thao Nam Breathable',
    sku: 'AT-A',
    description: 'Chất liệu vải thể thao co giãn 4 chiều, thoáng khí, kháng khuẩn, công nghệ Cool-Dry thấm hút mồ hôi tối ưu.',
    shortDescription: 'Áo polo thể thao nam cao cấp, co giãn 4 chiều thoáng khí.',
    price: 350,
    originalPrice: 450,
    costPrice: 180,
    stock: 60,
    weightGrams: 220,
    dimensions: { length: 25, width: 20, height: 3 },
    status: 'ACTIVE' as 'DRAFT' | 'ACTIVE' | 'HIDDEN' | 'ARCHIVED',
    publishAt: '2026-10-01T08:00',
    categoryId: 'cat-root-1',
    categoryName: 'Thời Trang & Thể Thao',
    brandName: 'Nike Sportswear',
    // Variant Matrix
    variantOption1Name: 'Màu sắc',
    variantOption1Values: 'Đỏ, Xanh, Đen',
    variantOption2Name: 'Kích cỡ (Size)',
    variantOption2Values: 'S, M, L',
    variants: [
      { id: 'v1', sku: 'AT-A-DO-S', name: 'Đỏ - S', color: 'Đỏ', size: 'S', price: 350, costPrice: 180, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80' },
      { id: 'v2', sku: 'AT-A-DO-M', name: 'Đỏ - M', color: 'Đỏ', size: 'M', price: 350, costPrice: 180, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80' },
      { id: 'v3', sku: 'AT-A-DO-L', name: 'Đỏ - L', color: 'Đỏ', size: 'L', price: 350, costPrice: 180, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80' },
      { id: 'v4', sku: 'AT-A-XANH-M', name: 'Xanh - M', color: 'Xanh', size: 'M', price: 350, costPrice: 180, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80' },
      { id: 'v5', sku: 'AT-A-DEN-M', name: 'Đen - M', color: 'Đen', size: 'M', price: 350, costPrice: 180, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80' },
    ],
    // Attributes
    attributes: [
      { name: 'Chất liệu', value: 'Cotton 95% & Spandex 5%' },
      { name: 'Xuất xứ', value: 'Việt Nam (Gia công xuất khẩu)' },
      { name: 'Kiểu dáng', value: 'Slim-fit tôn dáng năng động' },
      { name: 'Bảo hành', value: 'Đổi mới trong 30 ngày nếu có lỗi vải' },
    ],
    // Media Library
    media: [
      { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', isCover: true, alt: 'Áo thun Polo đỏ mặt trước', cdnStatus: 'WebP (Nén 68%) • 1200x1200px' },
      { url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80', isCover: false, alt: 'Áo thun Polo xanh chi tiết cổ áo', cdnStatus: 'WebP (Nén 72%) • 1200x1200px' },
      { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', isCover: false, alt: 'Áo thun Polo đen mặc phối đồ', cdnStatus: 'WebP (Nén 65%) • 1200x1200px' },
    ],
    // SEO
    seoTitle: 'Áo Thun Polo Thể Thao Nam Breathable Co Giãn | TechZone Fashion',
    seoDescription: 'Mua áo thun polo nam thể thao cao cấp chính hãng. Co giãn 4 chiều, công nghệ Cool-Dry thoáng khí. Giảm ngay 20%, đổi trả 30 ngày miễn phí.',
    slug: 'ao-thun-polo-the-thao-nam-breathable',
    canonicalUrl: 'https://techzone.vn/products/ao-thun-polo-the-thao-nam-breathable',
  };

  const [productForm, setProductForm] = useState(initialProductState);

  // 4.1. Batch Update Form
  const [batchProductForm, setBatchProductForm] = useState<{
    action: 'CHANGE_PRICE' | 'SET_STOCK' | 'ARCHIVE' | 'SET_CATEGORY';
    value: string;
    categoryId: string;
  }>({
    action: 'CHANGE_PRICE',
    value: '299',
    categoryId: 'cat-root-1',
  });

  // 4.1. CSV Validation State
  const [csvValidationResult, setCsvValidationResult] = useState<{
    filename: string;
    totalRows: number;
    validRows: number;
    errors: string[];
    warnings: string[];
    detailedReport: Array<{ line: number; sku: string; status: 'VALID' | 'ERROR' | 'WARNING'; message: string }>;
  } | null>(null);

  // 4.2. Stock Adjustment Form
  const [stockForm, setStockForm] = useState({
    productId: '',
    type: 'NHẬP_KHO_NCC' as 'NHẬP_KHO_NCC' | 'XUẤT_THỦ_CÔNG' | 'CHUYỂN_KHO' | 'KIỂM_KÊ_ĐIỀU_CHỈNH',
    warehouse: 'Kho Hà Nội (Cầu Giấy)',
    toWarehouse: 'Kho TP.HCM (Quận 1)',
    delta: 50,
    unitCost: 750,
    systemStock: 45,
    actualStock: 45,
    referenceId: 'PO-APL-2026-X1',
    batchNumber: 'LOT-2026-09A',
    expiryDate: '2028-12-31',
    notes: 'Nhập lô hàng chính hãng Apple AASP số 2026-Q4-01',
    performedBy: 'Trần Văn Quản Kho',
  });

  // 4.3. Refund Form
  const [refundForm, setRefundForm] = useState({
    reason: 'Khách hàng đổi ý / Sản phẩm chưa bóc seal',
    refundAmount: 0,
  });

  // 4.4. Campaign Dispatch Form
  const [campaignForm, setCampaignForm] = useState({
    customerId: '',
    customerName: '',
    segment: 'Khách VIP Vàng & Kim Cương',
    campaignType: 'TẶNG VOUCHER TRI ÂN HỘI VIÊN VIP',
    couponCode: 'TECHZONE50',
    message: 'TechZone gửi tặng quý khách mã giảm $50 cho đơn hàng tiếp theo. Áp dụng đến hết 31/12/2026.',
    channel: 'EMAIL' as 'EMAIL' | 'SMS' | 'PUSH',
  });

  // 4.5. Coupon Creator Form
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREESHIP',
    discountValue: 10,
    minOrderAmount: 150,
    totalUsageLimit: 200,
    endDate: '2026-12-31',
    allowFlashSaleStack: true,
    description: 'Giảm giá thiết bị & phụ kiện công nghệ cho khách hàng thân thiết',
  });

  // 4.6. E-Invoice Issuer Form
  const [invoiceForm, setInvoiceForm] = useState({
    orderTracking: '',
    customerName: '',
    taxCode: '0108923481',
    buyerAddress: 'Tầng 12, Toà nhà Keangnam, Cầu Giấy, Hà Nội',
    totalAmount: 999.0,
    provider: 'VNPT' as 'VNPT' | 'MISA',
  });

  // 4.7. Logistics Shipping Calculator Form
  const [calcForm, setCalcForm] = useState({
    fromProvince: 'Hà Nội',
    toProvince: 'Hồ Chí Minh',
    weightGrams: 450,
    lengthCm: 20,
    widthCm: 15,
    heightCm: 10,
    codAmount: 0,
  });
  const [calcResult, setCalcResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 4.9. Store Settings State
  const [storeForm, setStoreForm] = useState({
    storeName: 'TechZone Apple Authorised Premium Reseller',
    taxId: '0108923481',
    supportHotline: '1800 6975',
    currency: 'USD ($)',
    vatRate: 10,
    maintenanceMode: false,
  });

  // ==========================================
  // FETCH ALL DATA
  // ==========================================
  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        resOverview,
        resFunnel,
        resOrders,
        resInventory,
        resLedger,
        resCustomers,
        resFinance,
        resCoupons,
        resCarriers,
        resSettings,
        resAudit,
        resCategories,
        resDbCategories,
        resBrands,
        resAttributes,
        resWarehouses,
        resHolds,
        resReturns,
        resCrmSegments,
        resMarketingFullData,
        resLogisticsFull,
        resAnalytics,
      ] = await Promise.all([
        fetch('http://localhost:3001/api/v1/admin/overview').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/analytics/funnel').then((r) => r.json()),
        fetch(`http://localhost:3001/api/v1/admin/orders?status=${orderStatusFilter}&search=${encodeURIComponent(orderSearch)}`).then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/inventory').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/inventory/ledger').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/customers').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/finance/full-data').then((r) => r.json()).catch(() => null),
        fetch('http://localhost:3001/api/v1/admin/marketing/coupons').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/logistics/carriers').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/system/settings').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/audit-logs').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/categories/tree').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/categories').then((r) => r.json()).catch(() => []),
        fetch('http://localhost:3001/api/v1/admin/brands').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/attributes').then((r) => r.json()),
        fetch('http://localhost:3001/api/v1/admin/inventory/warehouses').then((r) => r.json()).catch(() => []),
        fetch('http://localhost:3001/api/v1/admin/inventory/holds').then((r) => r.json()).catch(() => []),
        fetch('http://localhost:3001/api/v1/admin/orders/returns').then((r) => r.json()).catch(() => []),
        fetch('http://localhost:3001/api/v1/admin/customers/segments/summary').then((r) => r.json()).catch(() => null),
        fetch('http://localhost:3001/api/v1/admin/marketing/full-data').then((r) => r.json()).catch(() => null),
        fetch('http://localhost:3001/api/v1/admin/logistics/full-data').then((r) => r.json()).catch(() => null),
        fetch('http://localhost:3001/api/v1/admin/analytics/enterprise-report?timeRange=30days&channel=ALL&role=ceo').then((r) => r.json()).catch(() => null),
      ]);

      setOverview(resOverview);
      setFunnelData(resFunnel);
      if (resAnalytics) setAnalyticsData(resAnalytics);
      const orderList = resOrders?.orders || resOrders?.data || (Array.isArray(resOrders) ? resOrders : []);
      setOrders(orderList);
      setOrderStatusCounts(resOrders?.statusCounts || {});
      if (resOrders?.pagination?.total !== undefined) {
        setTotalOrdersCount(resOrders.pagination.total);
      } else if (resOrders?.meta?.total !== undefined) {
        setTotalOrdersCount(resOrders.meta.total);
      } else {
        setTotalOrdersCount(orderList.length);
      }
      setInventory(resInventory || []);
      setStockLedger(resLedger || []);
      setCustomers(resCustomers || []);
      setFinance(resFinance || null);
      setCoupons(resCoupons || []);
      setCarriers(resCarriers || []);
      setLogisticsData(resLogisticsFull || null);
      setSystemSettings(resSettings || null);
      if (resSettings?.storeInfo) {
        setStoreConfigForm((prev) => ({
          ...prev,
          ...resSettings.storeInfo,
        }));
      }
      setAuditLogs(resAudit || []);
      setCategoryTree(resCategories || []);
      setDbCategories(resDbCategories || []);
      setBrands(resBrands || []);
      setAttributeGroups(resAttributes || []);
      setWarehouses(resWarehouses || []);
      setTemporaryHolds(resHolds || []);
      setReturnRequests(resReturns || []);
      if (resCrmSegments) setCrmSegmentsData(resCrmSegments);
      if (resMarketingFullData) setMarketingData(resMarketingFullData);

      if (resDbCategories && resDbCategories.length > 0 && !productForm.categoryId) {
        setProductForm((prev) => ({ ...prev, categoryId: resDbCategories[0].id }));
      }

      if (resInventory && resInventory.length > 0) {
        setStockForm((prev) => ({ ...prev, productId: resInventory[0].id }));
      }
    } catch (err) {
      console.error('Failed to load admin portal data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['overview', 'products', 'inventory', 'orders', 'customers', 'marketing', 'finance', 'logistics', 'system'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
  }, [orderStatusFilter]);

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // ==========================================
  // 4.8. BI & ANALYTICS ACTION HANDLERS
  // ==========================================
  const fetchEnterpriseAnalytics = async (timeRange?: string, channel?: string, role?: string) => {
    try {
      const t = timeRange || analyticsTimeRange;
      const c = channel || analyticsChannel;
      const r = role || analyticsRole;
      const res = await fetch(`http://localhost:3001/api/v1/admin/analytics/enterprise-report?timeRange=${t}&channel=${c}&role=${r}`);
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Error fetching enterprise analytics:', err);
    }
  };

  const handleSaveEmailSchedule = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/analytics/schedule-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scheduleForm.name,
          frequency: scheduleForm.frequency,
          recipients: scheduleForm.recipients.split(',').map((s) => s.trim()),
          format: scheduleForm.format,
          roleView: scheduleForm.roleView,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.allSchedules) {
          setAnalyticsData((prev: any) => ({ ...prev, emailSchedules: json.allSchedules }));
        }
        setIsScheduleModalOpen(false);
        showToast('Đã lưu cấu hình tự động gửi email báo cáo định kỳ!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportAnalytics = (format: 'excel' | 'pdf') => {
    if (format === 'excel') {
      const gmv = analyticsData?.metrics?.gmv || 0;
      const ordersCount = analyticsData?.metrics?.totalOrders || 0;
      const aov = analyticsData?.metrics?.aov || 0;
      const rows = [
        ['Báo Cáo Phân Tích Doanh Nghiệp TechZone', 'Thời Gian: ' + (analyticsData?.periodLabel || '30 ngày qua')],
        ['Chỉ Số', 'Giá Trị', 'Tăng Trưởng'],
        ['Tổng Giá Trị GMV (₫)', gmv.toLocaleString('vi-VN'), analyticsData?.metrics?.growthGmv || '+18.4%'],
        ['Doanh Thu Thuần (₫)', (analyticsData?.metrics?.netRevenue || 0).toLocaleString('vi-VN'), '+17.2%'],
        ['Lợi Nhuận Gộp (₫)', (analyticsData?.metrics?.grossProfit || 0).toLocaleString('vi-VN'), analyticsData?.metrics?.grossProfitMargin || '38.5%'],
        ['Lợi Nhuận Ròng (₫)', (analyticsData?.metrics?.netProfit || 0).toLocaleString('vi-VN'), analyticsData?.metrics?.netProfitMargin || '22.8%'],
        ['Tổng Đơn Hàng', ordersCount, analyticsData?.metrics?.growthOrders || '+12.6%'],
        ['Giá Trị Đơn Trung Bình AOV (₫)', aov.toLocaleString('vi-VN'), analyticsData?.metrics?.growthAov || '+5.2%'],
        ['Chi Phí Khách Mới CAC (₫)', (analyticsData?.metrics?.cac || 0).toLocaleString('vi-VN'), analyticsData?.metrics?.growthCac || '-8.5%'],
        ['Hiệu Suất Quảng Cáo ROAS', (analyticsData?.metrics?.roas || 5.42) + 'x', analyticsData?.metrics?.growthRoas || '+14.2%'],
        [],
        ['Top Sản Phẩm Bán Chạy', 'Số Lượng Đã Bán', 'Doanh Thu (₫)', 'Tốc Độ Bán'],
        ...(analyticsData?.bestSellers || []).map((b: any) => [b.name, b.soldUnits, b.revenue.toLocaleString('vi-VN'), b.velocity]),
        [],
        ['Hàng Tồn Kho Lâu Ngày (>60 Ngày)', 'Tồn Kho (Cái)', 'Vốn Đọng (₫)', 'Khuyến Nghị Hành Động'],
        ...(analyticsData?.deadstockItems || []).map((d: any) => [d.name, d.stock, d.capitalLocked.toLocaleString('vi-VN'), d.recommendation]),
      ];
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map((e: any[]) => e.map((val: any) => `"${val}"`).join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `TechZone_Bao_Cao_${analyticsTimeRange}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Đã xuất báo cáo dữ liệu kinh doanh định dạng Excel (.csv) thành công!');
    } else {
      window.print();
    }
  };

  // ==========================================
  // 4.9. QUẢN TRỊ HỆ THỐNG & RBAC ACTION HANDLERS
  // ==========================================
  const handleSaveStoreConfig = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/system/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeConfigForm),
      });
      if (res.ok) {
        const data = await res.json();
        setSystemSettings((prev: any) => ({
          ...prev,
          storeInfo: data.storeInfo,
        }));
        const auditRes = await fetch('http://localhost:3001/api/v1/admin/audit-logs');
        if (auditRes.ok) {
          setAuditLogs(await auditRes.json());
        }
        showToast('Đã lưu cấu hình thông tin cửa hàng & pháp lý thành công!');
      }
    } catch (err) {
      console.error('Error saving store config:', err);
    }
  };

  const handleOpenEditUserModal = (user: any) => {
    setSelectedAdminUser(user);
    setAdminUserForm({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      ipRestricted: user.ipRestricted,
      enforce2fa: user.enforce2fa,
    });
    setIsUserRoleModalOpen(true);
  };

  const handleUpdateAdminUser = async () => {
    if (!adminUserForm.id) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/system/rbac/users/${adminUserForm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: adminUserForm.role,
          status: adminUserForm.status,
          enforce2fa: adminUserForm.enforce2fa,
          ipRestricted: adminUserForm.ipRestricted,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSystemSettings((prev: any) => ({
          ...prev,
          adminUsers: data.adminUsers,
        }));
        const auditRes = await fetch('http://localhost:3001/api/v1/admin/audit-logs');
        if (auditRes.ok) {
          setAuditLogs(await auditRes.json());
        }
        setIsUserRoleModalOpen(false);
        showToast(`Đã cập nhật đặc quyền tài khoản ${adminUserForm.name} thành công!`);
      }
    } catch (err) {
      console.error('Error updating admin user:', err);
    }
  };

  const handleTriggerBackup = async () => {
    setIsBackingUpDb(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/system/backup/create', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setSystemSettings((prev: any) => ({
          ...prev,
          backupSnapshots: data.allSnapshots,
        }));
        const auditRes = await fetch('http://localhost:3001/api/v1/admin/audit-logs');
        if (auditRes.ok) {
          setAuditLogs(await auditRes.json());
        }
        showToast(`Tạo bản sao lưu CSDL PostgreSQL thành công: ${data.snapshot.filename}`);
      }
    } catch (err) {
      console.error('Error creating backup:', err);
    } finally {
      setIsBackingUpDb(false);
    }
  };

  const handleToggleMaintenance = async () => {
    setIsTogglingMaintenance(true);
    const nextState = !storeConfigForm.maintenanceMode;
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/system/maintenance/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: nextState,
          message: storeConfigForm.maintenanceMessage,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setStoreConfigForm((prev) => ({
          ...prev,
          maintenanceMode: nextState,
        }));
        setSystemSettings((prev: any) => ({
          ...prev,
          storeInfo: data.storeInfo,
        }));
        const auditRes = await fetch('http://localhost:3001/api/v1/admin/audit-logs');
        if (auditRes.ok) {
          setAuditLogs(await auditRes.json());
        }
        showToast(nextState ? 'Đã BẬT Chế độ bảo trì cửa hàng!' : 'Đã TẮT chế độ bảo trì, mở lại cửa hàng cho khách!');
      }
    } catch (err) {
      console.error('Error toggling maintenance:', err);
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  const handleOpenCmsModal = (post?: any) => {
    if (post) {
      setCmsForm({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category,
        author: post.author,
        status: post.status,
        seoTitle: post.seoTitle || post.title,
        seoDesc: post.seoDesc || '',
        content: post.content || 'Nội dung bài viết công nghệ chuẩn SEO...',
      });
    } else {
      setCmsForm({
        id: '',
        title: '',
        slug: '',
        category: 'Tin Tức Apple',
        author: 'Ban Biên Tập TechZone',
        status: 'PUBLISHED',
        seoTitle: '',
        seoDesc: '',
        content: '',
      });
    }
    setIsCmsModalOpen(true);
  };

  const handleSaveCmsPost = async () => {
    if (!cmsForm.title) {
      alert('Vui lòng nhập tiêu đề bài viết CMS');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/system/cms/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsForm),
      });
      if (res.ok) {
        const data = await res.json();
        setSystemSettings((prev: any) => ({
          ...prev,
          cmsPosts: data.allPosts,
        }));
        const auditRes = await fetch('http://localhost:3001/api/v1/admin/audit-logs');
        if (auditRes.ok) {
          setAuditLogs(await auditRes.json());
        }
        setIsCmsModalOpen(false);
        showToast(`Đã xuất bản bài viết CMS: "${cmsForm.title}" thành công!`);
      }
    } catch (err) {
      console.error('Error saving CMS post:', err);
    }
  };

  // ==========================================
  // CRM 4.4 ACTION HANDLERS
  // ==========================================
  const handleOpenCustomer360 = async (cust: any) => {
    setSelectedCustomer(cust);
    setIsCustomer360Open(true);
    setCustomer360ActiveTab('overview');
    setCustomer360Loading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/customers/${cust.id}/360`);
      if (res.ok) {
        const data = await res.json();
        setCustomer360Data(data);
      } else {
        setCustomer360Data(null);
      }
    } catch {
      setCustomer360Data(null);
    } finally {
      setCustomer360Loading(false);
    }
  };

  const handleExecuteLifecycle = async () => {
    setLifecycleRunning(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/workflow/process-order-lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: lifecycleScenario,
          carrier: lifecycleCarrier,
          couponCode: lifecycleCoupon,
          quantity: 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLifecycleResult(data.lifecycleSummary);
        showToast('Quy trình đơn hàng qua 8 phân hệ doanh nghiệp đã hoàn tất trong CSDL!');
        await fetchData();
      } else {
        showToast('Lỗi: ' + (data.message || 'Không thành công'));
      }
    } catch (e: any) {
      showToast('Lỗi kết nối máy chủ: ' + e.message);
    } finally {
      setLifecycleRunning(false);
    }
  };

  const handleSaveCustomerNote = async () => {
    if (!newCustomerNote.trim() || !selectedCustomer) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/customers/${selectedCustomer.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newCustomerNote.trim(), author: 'Admin Quản Trị' }),
      });
      if (res.ok) {
        const result = await res.json();
        setCustomer360Data((prev: any) => ({
          ...prev,
          notes: [result.note, ...(prev?.notes || [])],
        }));
        setNewCustomerNote('');
        showToast('Đã lưu ghi chú nội bộ thành công!');
      }
    } catch {
      showToast('Lỗi khi lưu ghi chú');
    }
  };

  const handleAddCustomerTag = async () => {
    if (!newCustomerTag.trim() || !selectedCustomer) return;
    const currentTags = customer360Data?.tags || selectedCustomer.tags || [];
    if (currentTags.includes(newCustomerTag.trim())) {
      setNewCustomerTag('');
      return;
    }
    const updatedTags = [...currentTags, newCustomerTag.trim()];
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/customers/${selectedCustomer.id}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: updatedTags }),
      });
      if (res.ok) {
        setCustomer360Data((prev: any) => ({
          ...prev,
          tags: updatedTags,
        }));
        setCustomers((prev) =>
          prev.map((c) => (c.id === selectedCustomer.id ? { ...c, tags: updatedTags } : c))
        );
        setNewCustomerTag('');
        showToast(`Đã gắn thẻ [${newCustomerTag.trim()}] cho khách hàng!`);
      }
    } catch {
      showToast('Lỗi khi cập nhật thẻ');
    }
  };

  const handleRemoveCustomerTag = async (tagToRemove: string) => {
    if (!selectedCustomer) return;
    const currentTags = customer360Data?.tags || [];
    const updatedTags = currentTags.filter((t: string) => t !== tagToRemove);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/customers/${selectedCustomer.id}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: updatedTags }),
      });
      if (res.ok) {
        setCustomer360Data((prev: any) => ({
          ...prev,
          tags: updatedTags,
        }));
        setCustomers((prev) =>
          prev.map((c) => (c.id === selectedCustomer.id ? { ...c, tags: updatedTags } : c))
        );
        showToast(`Đã gỡ thẻ [${tagToRemove}]`);
      }
    } catch {
      showToast('Lỗi khi gỡ thẻ');
    }
  };

  const handleOpenCampaignModal = (cust?: any, segmentName?: string) => {
    if (cust) {
      setCampaignTarget({ type: 'CUSTOMER', id: cust.id, name: `${cust.fullName} (${cust.email})` });
      setCampaignSubject(`[TechZone VIP] Dành riêng cho ${cust.fullName}: Ưu đãi 50% thiết bị Apple mới`);
      setCampaignMessage(`Chào ${cust.fullName},\n\nTechZone gửi tặng bạn mã giảm giá đặc quyền áp dụng cho tất cả thiết bị Apple chính hãng VN/A.`);
    } else {
      setCampaignTarget({ type: 'SEGMENT', id: segmentName || 'VIP', name: segmentName ? `Tệp: ${segmentName}` : 'Khách VIP Trung Thành' });
      setCampaignSubject(`[TechZone Private Deal] Ưu đãi độc quyền dành cho khách hàng thân thiết`);
      setCampaignMessage(`Kính gửi quý khách,\n\nTechZone trân trọng gửi tặng ưu đãi đặc quyền cho đợt mở bán Flash Sale 2026.`);
    }
    setIsCampaignModalOpen(true);
  };

  const handleSendCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCampaign(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/customers/dispatch-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: campaignTarget.type === 'CUSTOMER' ? campaignTarget.id : undefined,
          segment: campaignTarget.type === 'SEGMENT' ? campaignTarget.id : undefined,
          campaignType: campaignType,
          couponCode: campaignCouponCode,
          message: campaignMessage,
          channel: campaignChannel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsCampaignModalOpen(false);
        showToast(`Đã phát hành chiến dịch tới ${data.dispatchedCount} khách hàng qua ${campaignChannel}!`);
      } else {
        showToast('Lỗi khi phát hành chiến dịch');
      }
    } catch {
      showToast('Lỗi kết nối khi gửi chiến dịch');
    } finally {
      setIsSubmittingCampaign(false);
    }
  };

  const handleSyncRemarketing = async (platform: 'FACEBOOK' | 'GOOGLE', segment: string) => {
    setRemarketingSyncLoading(`${platform}_${segment}`);
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/customers/remarketing/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, segment }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message);
      } else {
        showToast('Lỗi khi đồng bộ Remarketing');
      }
    } catch {
      showToast('Lỗi kết nối API đồng bộ');
    } finally {
      setRemarketingSyncLoading(null);
    }
  };

  const handleToggleWorkflow = (id: string) => {
    setAutomationWorkflows((prev) =>
      prev.map((wf) => (wf.id === id ? { ...wf, active: !wf.active } : wf))
    );
    const wf = automationWorkflows.find((w) => w.id === id);
    showToast(`Đã ${!wf?.active ? 'bật' : 'tắt'} kịch bản tự động: ${wf?.name}`);
  };

  // ==========================================
  // 4.5. MARKETING & PROMOTIONS ACTION HANDLERS
  // ==========================================
  const handleToggleCoupon = async (code: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/marketing/coupons/${code}/status`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const data = await res.json();
        setCoupons(prev => prev.map(c => c.code === code ? { ...c, status: data.coupon.status } : c));
        setMarketingData((prev: any) => prev ? {
          ...prev,
          coupons: (prev.coupons || []).map((c: any) => c.code === code ? { ...c, status: data.coupon.status } : c),
        } : prev);
        showToast(`Đã chuyển trạng thái mã [${code}] sang ${data.coupon.status}`);
      }
    } catch {
      showToast('Lỗi khi đổi trạng thái mã giảm giá');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa mã giảm giá [${code}] không?`)) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/marketing/coupons/${code}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.code !== code));
        setMarketingData((prev: any) => prev ? {
          ...prev,
          coupons: (prev.coupons || []).filter((c: any) => c.code !== code),
        } : prev);
        showToast(`Đã xóa mã giảm giá [${code}] thành công`);
      }
    } catch {
      showToast('Lỗi khi xóa mã giảm giá');
    }
  };

  const handleCreateCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/marketing/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCouponForm),
      });
      if (res.ok) {
        const newCp = await res.json();
        setCoupons(prev => [newCp, ...prev]);
        setMarketingData((prev: any) => prev ? {
          ...prev,
          coupons: [newCp, ...(prev.coupons || [])],
        } : prev);
        setIsCouponModalOpen(false);
        showToast(`Đã tạo thành công mã giảm giá [${newCp.code}]!`);
      } else {
        showToast('Lỗi khi tạo mã giảm giá');
      }
    } catch {
      showToast('Lỗi kết nối API tạo coupon');
    }
  };

  const handleCreateFlashSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/marketing/flash-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFlashSaleForm),
      });
      if (res.ok) {
        const data = await res.json();
        setMarketingData((prev: any) => prev ? {
          ...prev,
          flashSaleSlots: [data.slot, ...(prev.flashSaleSlots || [])],
        } : prev);
        setIsFlashSaleModalOpen(false);
        showToast(`Đã tạo khung giờ Flash Sale [${data.slot.title}] thành công!`);
      }
    } catch {
      showToast('Lỗi khi tạo khung giờ Flash Sale');
    }
  };

  const handleCreateComboSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/marketing/combos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComboForm),
      });
      if (res.ok) {
        const data = await res.json();
        setMarketingData((prev: any) => prev ? {
          ...prev,
          combos: [data.combo, ...(prev.combos || [])],
        } : prev);
        setIsComboModalOpen(false);
        showToast(`Đã tạo Combo [${data.combo.name}] thành công!`);
      }
    } catch {
      showToast('Lỗi khi tạo Combo');
    }
  };

  const handleCreateCrossSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/marketing/cross-sells', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCrossSellForm),
      });
      if (res.ok) {
        const data = await res.json();
        setMarketingData((prev: any) => prev ? {
          ...prev,
          crossSellRules: [data.rule, ...(prev.crossSellRules || [])],
        } : prev);
        setIsCrossSellModalOpen(false);
        showToast(`Đã kích hoạt quy tắc mua kèm/upsell thành công!`);
      }
    } catch {
      showToast('Lỗi khi tạo quy tắc mua kèm');
    }
  };

  const handleAdjustLoyaltySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/marketing/loyalty/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loyaltyAdjustForm),
      });
      if (res.ok) {
        const data = await res.json();
        setMarketingData((prev: any) => prev ? {
          ...prev,
          loyalty: {
            ...prev.loyalty,
            history: [data.entry, ...(prev.loyalty?.history || [])],
          },
        } : prev);
        setIsLoyaltyAdjustModalOpen(false);
        showToast(`Đã điều chỉnh ${loyaltyAdjustForm.deltaPoints > 0 ? '+' : ''}${loyaltyAdjustForm.deltaPoints} điểm cho khách hàng!`);
      }
    } catch {
      showToast('Lỗi khi điều chỉnh điểm thưởng');
    }
  };

  const handleCreateCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMarketingCampaignForm),
      });
      if (res.ok) {
        const data = await res.json();
        setMarketingData((prev: any) => prev ? {
          ...prev,
          campaigns: [data.campaign, ...(prev.campaigns || [])],
        } : prev);
        setIsMarketingCampaignModalOpen(false);
        showToast(`Đã phát hành chiến dịch Marketing [${data.campaign.name}]!`);
      }
    } catch {
      showToast('Lỗi khi phát hành chiến dịch');
    }
  };

  const handleCreateBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/marketing/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBannerForm),
      });
      if (res.ok) {
        const data = await res.json();
        setMarketingData((prev: any) => prev ? {
          ...prev,
          banners: [data.banner, ...(prev.banners || [])],
        } : prev);
        setIsBannerModalOpen(false);
        showToast(`Đã xuất bản Banner [${data.banner.title}]!`);
      }
    } catch {
      showToast('Lỗi khi tạo banner');
    }
  };

  const handleCreateLandingPageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/marketing/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLandingPageForm),
      });
      if (res.ok) {
        const data = await res.json();
        setMarketingData((prev: any) => prev ? {
          ...prev,
          landingPages: [data.landingPage, ...(prev.landingPages || [])],
        } : prev);
        setIsLandingPageModalOpen(false);
        showToast(`Đã tạo Landing Page [${data.landingPage.title}] kèm A/B Testing!`);
      }
    } catch {
      showToast('Lỗi khi tạo landing page');
    }
  };

  const handlePayoutAffiliate = async (partnerId: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/marketing/affiliate/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId }),
      });
      if (res.ok) {
        const data = await res.json();
        setMarketingData((prev: any) => prev ? {
          ...prev,
          affiliate: {
            ...prev.affiliate,
            partners: (prev.affiliate?.partners || []).map((p: any) => p.id === partnerId ? { ...p, unpaidCommission: 0 } : p),
          },
        } : prev);
        showToast(data.message);
      }
    } catch {
      showToast('Lỗi khi thanh toán hoa hồng Affiliate');
    }
  };

  const handleSyncAdProductFeed = async (platform: 'GOOGLE' | 'META' | 'TIKTOK') => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/marketing/ad-tracking/sync-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message);
      }
    } catch {
      showToast('Lỗi khi đồng bộ Product Feed');
    }
  };

  // ==========================================
  // 4.6. FINANCE & PAYMENTS ACTION HANDLERS
  // ==========================================
  const handleRunReconciliation = async () => {
    setIsReconcileRunning(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/finance/reconcile-now', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setFinance((prev: any) => prev ? {
          ...prev,
          reconciliation: {
            ...prev.reconciliation,
            summary: data.summary,
          },
        } : prev);
        showToast(data.message || 'Đã quét đối soát 3 nguồn tự động thành công!');
      }
    } catch {
      showToast('Lỗi khi kích hoạt đối soát');
    } finally {
      setIsReconcileRunning(false);
    }
  };

  const handleResolveDiscrepancy = async (discrepancyId: string, action: string, note?: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/finance/discrepancies/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discrepancyId, action, note }),
      });
      if (res.ok) {
        const data = await res.json();
        setFinance((prev: any) => prev ? {
          ...prev,
          discrepancies: prev.discrepancies?.map((d: any) => d.id === discrepancyId ? data.discrepancy : d),
          reconciliation: {
            ...prev.reconciliation,
            records: prev.reconciliation?.records?.map((r: any) => r.orderId === data.discrepancy?.orderId ? { ...r, status: 'MATCHED' } : r),
            summary: {
              ...prev.reconciliation?.summary,
              discrepancyCount: Math.max(0, (prev.reconciliation?.summary?.discrepancyCount || 1) - 1),
            },
          },
        } : prev);
        showToast(data.message);
      }
    } catch {
      showToast('Lỗi xử lý chênh lệch');
    }
  };

  const handleApproveCod = async (settlementId: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/finance/cod/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settlementId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFinance((prev: any) => prev ? {
          ...prev,
          codSettlement: prev.codSettlement?.map((c: any) => c.id === settlementId ? data.cod : c),
        } : prev);
        showToast(data.message);
      }
    } catch {
      showToast('Lỗi duyệt đối soát COD');
    }
  };

  const handleCreateArDebtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/finance/debts/ar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArDebtForm),
      });
      if (res.ok) {
        const data = await res.json();
        setFinance((prev: any) => prev ? {
          ...prev,
          accountsReceivable: [data.debt, ...(prev.accountsReceivable || [])],
        } : prev);
        setIsArDebtModalOpen(false);
        showToast(`Đã tạo công nợ phải thu cho ${data.debt.clientName}!`);
      }
    } catch {
      showToast('Lỗi tạo công nợ phải thu');
    }
  };

  const handleSettleArDebt = async (debtId: string, amount: number) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/finance/debts/ar/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debtId, amount }),
      });
      if (res.ok) {
        const data = await res.json();
        setFinance((prev: any) => prev ? {
          ...prev,
          accountsReceivable: prev.accountsReceivable?.map((d: any) => d.id === debtId ? data.debt : d),
        } : prev);
        showToast(data.message);
      }
    } catch {
      showToast('Lỗi thu hồi công nợ');
    }
  };

  const handleCreateApDebtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/finance/debts/ap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApDebtForm),
      });
      if (res.ok) {
        const data = await res.json();
        setFinance((prev: any) => prev ? {
          ...prev,
          accountsPayable: [data.debt, ...(prev.accountsPayable || [])],
        } : prev);
        setIsApDebtModalOpen(false);
        showToast(`Đã ghi nhận công nợ phải trả cho ${data.debt.supplierName}!`);
      }
    } catch {
      showToast('Lỗi tạo công nợ nhà cung cấp');
    }
  };

  const handlePayApDebt = async (debtId: string, amount: number) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/finance/debts/ap/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debtId, amount }),
      });
      if (res.ok) {
        const data = await res.json();
        setFinance((prev: any) => prev ? {
          ...prev,
          accountsPayable: prev.accountsPayable?.map((a: any) => a.id === debtId ? data.debt : a),
        } : prev);
        showToast(data.message);
      }
    } catch {
      showToast('Lỗi thanh toán nhà cung cấp');
    }
  };

  const handleApproveVendorPayout = async (vendorId: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/finance/marketplace/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFinance((prev: any) => prev ? {
          ...prev,
          marketplaceSellers: prev.marketplaceSellers?.map((v: any) => v.id === vendorId ? data.vendor : v),
        } : prev);
        showToast(data.message);
      }
    } catch {
      showToast('Lỗi quyết toán sàn marketplace');
    }
  };

  const handleIssueEInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/finance/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEInvoiceForm),
      });
      if (res.ok) {
        const data = await res.json();
        setFinance((prev: any) => prev ? {
          ...prev,
          eInvoices: [data.invoice, ...(prev.eInvoices || [])],
        } : prev);
        setIsEInvoiceModalOpen(false);
        showToast(`Đã phát hành Hóa đơn VAT [${data.invoice.einvoiceNo}] - Mã CQT: ${data.invoice.cqtCode}!`);
      }
    } catch {
      showToast('Lỗi phát hành hóa đơn');
    }
  };

  const handleAdjustOrCancelEInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEInvoice) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/finance/invoices/${selectedEInvoice.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adjustEInvoiceForm),
      });
      if (res.ok) {
        const data = await res.json();
        setFinance((prev: any) => prev ? {
          ...prev,
          eInvoices: adjustEInvoiceForm.action === 'HỦY_BỎ'
            ? prev.eInvoices?.map((i: any) => i.id === selectedEInvoice.id ? data.invoice : i)
            : [data.invoice, ...(prev.eInvoices || [])],
        } : prev);
        setIsAdjustEInvoiceModalOpen(false);
        showToast(data.message);
      }
    } catch {
      showToast('Lỗi xử lý hóa đơn điện tử');
    }
  };

  const handleResendEInvoiceEmail = async (invoiceId: string, email: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/finance/invoices/${invoiceId}/resend-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message);
      }
    } catch {
      showToast('Lỗi gửi email hóa đơn');
    }
  };

  const openEInvoiceModal = (ord?: any) => {
    if (ord) {
      setNewEInvoiceForm(prev => ({
        ...prev,
        orderTracking: ord.trackingNumber || ord.id,
        customerName: ord.user?.fullName || 'Khách Hàng',
        totalAmount: ord.totalAmount || 999,
        buyerEmail: ord.user?.email || '',
      }));
    }
    setIsEInvoiceModalOpen(true);
  };

  // ==========================================
  // 4.1. PRODUCT ACTION HANDLERS
  // ==========================================

  // Open Add Product Dialog
  const openAddProductModal = () => {
    setIsEditMode(false);
    setProductForm({
      ...initialProductState,
      id: '',
      name: '',
      sku: 'PROD-' + Date.now().toString().slice(-6),
      variants: [],
    });
    setActiveModalTab('basic');
    setIsProductModalOpen(true);
  };

  // Open Edit Product Dialog
  const openEditProductModal = (prod: any) => {
    setIsEditMode(true);
    setProductForm({
      id: prod.id,
      name: prod.name,
      sku: prod.sku || `APL-${prod.name.slice(0, 3).toUpperCase()}`,
      description: prod.description || 'Sản phẩm chính hãng với bảo hành 12 tháng.',
      shortDescription: prod.shortDescription || 'Mô tả ngắn gọn sản phẩm.',
      price: Number(prod.price),
      originalPrice: prod.originalPrice || Math.round(Number(prod.price) * 1.15),
      costPrice: prod.costPrice || Math.round(Number(prod.price) * 0.75),
      stock: prod.stock,
      weightGrams: prod.weightGrams || 220,
      dimensions: typeof prod.dimensions === 'object' ? prod.dimensions : { length: 15, width: 8, height: 2 },
      status: prod.status || (prod.stock > 0 ? 'ACTIVE' : 'ARCHIVED'),
      publishAt: prod.publishAt || '2026-10-01T08:00',
      categoryId: prod.categoryId || 'cat-root-1',
      categoryName: prod.category?.name || 'Công nghệ',
      brandName: prod.brand?.name || 'Apple Inc.',
      variantOption1Name: 'Màu sắc',
      variantOption1Values: 'Titan Tự Nhiên, Titan Sa Mạc, Titan Đen',
      variantOption2Name: 'Dung lượng / Size',
      variantOption2Values: '256GB, 512GB, 1TB',
      variants: prod.variants && prod.variants.length > 0 ? prod.variants : [
        { id: 'v1', sku: `${prod.sku}-256`, name: 'Titan Tự Nhiên • 256GB', color: 'Titan Tự Nhiên', size: '256GB', price: Number(prod.price), costPrice: Math.round(Number(prod.price) * 0.75), stock: 20, imageUrl: prod.imageUrl },
        { id: 'v2', sku: `${prod.sku}-512`, name: 'Titan Sa Mạc • 512GB', color: 'Titan Sa Mạc', size: '512GB', price: Number(prod.price) + 200, costPrice: Math.round((Number(prod.price) + 200) * 0.75), stock: 15, imageUrl: prod.imageUrl },
      ],
      attributes: prod.attributes || [
        { name: 'Chất liệu', value: 'Titanium Cấp 5 & Ceramic Shield' },
        { name: 'Xuất xứ', value: 'Mỹ (Lắp ráp Foxconn)' },
        { name: 'Bảo hành', value: '12 Tháng 1 Đổi 1 AppleCare AASP' },
      ],
      media: prod.media || [
        { url: prod.imageUrl, isCover: true, alt: `${prod.name} góc trực diện`, cdnStatus: 'WebP (Nén 68%) • 1200x1200px' },
      ],
      seoTitle: prod.seo?.title || `${prod.name} Chính Hãng Apple VN/A | Giá Tốt TechZone`,
      seoDescription: prod.seo?.metaDescription || `Mua ngay ${prod.name} chính hãng 12 tháng tại TechZone. Giảm ngay $500, trả góp 0%, giao 2h.`,
      slug: prod.seo?.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      canonicalUrl: prod.seo?.canonicalUrl || `https://techzone.vn/products/${prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    });
    setActiveModalTab('basic');
    setIsProductModalOpen(true);
  };

  // Generate Variant Matrix (Tổ hợp Màu x Size)
  const handleGenerateVariantMatrix = () => {
    const colors = productForm.variantOption1Values.split(',').map((c) => c.trim()).filter(Boolean);
    const sizes = productForm.variantOption2Values.split(',').map((s) => s.trim()).filter(Boolean);

    const newVariants: any[] = [];
    let idx = 1;

    colors.forEach((color) => {
      sizes.forEach((size) => {
        const skuSlug = `${productForm.sku}-${color.slice(0, 3).toUpperCase()}-${size.toUpperCase()}`.replace(/\s+/g, '');
        newVariants.push({
          id: `v-${idx++}`,
          name: `${color} - ${size}`,
          color,
          size,
          sku: skuSlug,
          price: productForm.price,
          costPrice: productForm.costPrice,
          stock: 20,
          imageUrl: productForm.media[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        });
      });
    });

    setProductForm({ ...productForm, variants: newVariants });
    showToast(`Đã tự động sinh ma trận ${newVariants.length} biến thể (${colors.length} Màu x ${sizes.length} Size)!`);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isEditMode
        ? `http://localhost:3001/api/v1/admin/products/${productForm.id}`
        : 'http://localhost:3001/api/v1/admin/products';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productForm.name,
          sku: productForm.sku,
          description: productForm.description,
          price: Number(productForm.price),
          costPrice: Number(productForm.costPrice),
          stock: Number(productForm.stock),
          weightGrams: Number(productForm.weightGrams),
          dimensions: `${productForm.dimensions.length}x${productForm.dimensions.width}x${productForm.dimensions.height} cm`,
          imageUrl: productForm.media[0]?.url || '',
          categoryId: productForm.categoryId,
        }),
      });

      if (res.ok) {
        showToast(
          isEditMode
            ? `Đã cập nhật sản phẩm "${productForm.name}" & ma trận ${productForm.variants.length} biến thể!`
            : `Đã thêm sản phẩm "${productForm.name}" lên kệ hàng thành công!`
        );
        setIsProductModalOpen(false);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi lưu thông tin sản phẩm');
    }
  };

  // Soft Delete Product (Xóa mềm - bảo toàn đơn hàng)
  const handleSoftDelete = async (prodId: string, prodName: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/products/${prodId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast(`Đã xóa mềm (Archive) "${prodName}". Đơn hàng cũ vẫn giữ nguyên tính toàn vẹn.`);
        setIsProductModalOpen(false);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi xóa mềm sản phẩm');
    }
  };

  // Toggle Attribute Filter (Bật / Tắt bộ lọc khách hàng)
  const handleToggleAttributeFilter = async (categoryType: string, attributeName: string, currentStatus: boolean) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/attributes/toggle', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryType, attributeName, isFilter: !currentStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setAttributeGroups(data.attributes || []);
        showToast(`Đã ${!currentStatus ? 'BẬT' : 'TẮT'} bộ lọc "${attributeName}" cho khách hàng!`);
      }
    } catch {
      showToast('Lỗi khi cập nhật trạng thái bộ lọc');
    }
  };

  // Add Option to Attribute
  const handleAddOptionToAttribute = async (categoryType: string, attributeName: string, option: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/attributes/add-option', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryType, attributeName, option }),
      });
      if (res.ok) {
        const data = await res.json();
        setAttributeGroups(data.attributes || []);
        showToast(`Đã thêm tùy chọn "${option}" vào thuộc tính "${attributeName}"!`);
      }
    } catch {
      showToast('Lỗi khi thêm tùy chọn thuộc tính');
    }
  };

  // Create New Attribute
  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttrForm.name) return;
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryType: newAttrForm.categoryType,
          name: newAttrForm.name,
          options: newAttrForm.options.split(',').map((s) => s.trim()).filter(Boolean),
          isFilter: newAttrForm.isFilter,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAttributeGroups(data.attributes || []);
        showToast(`Đã thêm thuộc tính "${newAttrForm.name}" thành công!`);
        setIsNewAttrModalOpen(false);
        setNewAttrForm({
          categoryType: 'Thiết Bị Điện Tử & Di Động',
          name: '',
          options: '',
          isFilter: true,
        });
      }
    } catch {
      showToast('Lỗi khi thêm thuộc tính');
    }
  };

  // Run Batch Update with Background Queue Simulation
  const handleExecuteBatchUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductIds.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 sản phẩm');
      return;
    }

    const jobId = `JOB-BATCH-${Math.floor(1000 + Math.random() * 9000)}`;
    setBatchJob({
      running: true,
      jobId,
      progress: 15,
      total: selectedProductIds.length,
      status: 'RUNNING',
      logs: [
        `[${new Date().toLocaleTimeString()}] BullMQ Queue nhận lệnh: Cập nhật ${selectedProductIds.length} sản phẩm`,
        `[${new Date().toLocaleTimeString()}] Phân bổ worker xử lý tiến trình ngầm...`,
      ],
    });

    try {
      await fetch('http://localhost:3001/api/v1/admin/products/batch-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProductIds,
          action: batchProductForm.action,
          value: batchProductForm.value,
        }),
      });

      setTimeout(() => {
        setBatchJob((prev) => prev && {
          ...prev,
          progress: 65,
          logs: [
            ...prev.logs,
            `[${new Date().toLocaleTimeString()}] Đang cập nhật giá & tồn kho trên cụm cơ sở dữ liệu PostgreSQL...`,
            `[${new Date().toLocaleTimeString()}] Xóa bỏ cache Redis phân tán tương ứng...`,
          ],
        });
      }, 500);

      setTimeout(() => {
        setBatchJob((prev) => prev && {
          ...prev,
          progress: 100,
          status: 'COMPLETED',
          logs: [
            ...prev.logs,
            `[${new Date().toLocaleTimeString()}] Hoàn tất! Đã cập nhật ${selectedProductIds.length} sản phẩm thành công.`,
          ],
        });
        showToast(`Worker đã xử lý xong ${selectedProductIds.length} sản phẩm!`);
        setSelectedProductIds([]);
        fetchData();
      }, 1200);
    } catch {
      showToast('Lỗi khi gửi yêu cầu cập nhật hàng loạt');
    }
  };

  // Download Template CSV File
  const handleDownloadTemplateCsv = () => {
    const templateContent =
      'sku,name,description,price,cost_price,stock,weight_grams,dimensions,category,brand,status,variants\n' +
      'AT-A-DO-M,"Áo thun Polo Nam Đỏ M","Vải thể thao co giãn thoáng khí",350,180,20,220,"25x20x3 cm","Thời Trang Nam","Nike Sportswear","ACTIVE","Màu Đỏ x Size M"\n' +
      'IP16P-NAT-256,"iPhone 16 Pro 256GB Natural","Titanium cấp 5 hàng không vũ trụ",999,750,15,220,"15x8x2 cm","Điện Thoại","Apple Inc.","ACTIVE","Titan Tự Nhiên x 256GB"\n' +
      'AP2-USBC,"AirPods Pro 2 USB-C","Chống ồn chủ động 2X, Chip H2",249,180,30,60,"6x5x2 cm","Phụ Kiện Âm Thanh","Apple Inc.","ACTIVE","Trắng Chuẩn"';

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + templateContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'mau_import_san_pham_techzone.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã tải xuống file CSV mẫu (mau_import_san_pham_techzone.csv)!');
  };

  // Upload and Validate CSV line-by-line via Backend
  const handleCsvFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      const headers = lines[0]?.split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));

      const rows: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim().replace(/["']/g, ''));
        rows.push({
          sku: cols[0],
          name: cols[1],
          price: cols[3],
          costPrice: cols[4],
          stock: cols[5],
        });
      }

      try {
        const res = await fetch('http://localhost:3001/api/v1/admin/products/import-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rows }),
        });

        if (res.ok) {
          const valData = await res.json();
          setCsvValidationResult({
            filename: file.name,
            totalRows: valData.totalRows,
            validRows: valData.validCount,
            errors: valData.report.filter((r: any) => r.status === 'ERROR').map((r: any) => `Dòng ${r.line} [${r.sku}]: ${r.message}`),
            warnings: valData.report.filter((r: any) => r.status === 'WARNING').map((r: any) => `Dòng ${r.line} [${r.sku}]: ${r.message}`),
            detailedReport: valData.report,
          });
          setIsCsvImportModalOpen(true);
        }
      } catch {
        showToast('Lỗi kiểm tra file CSV');
      }
    };
    reader.readAsText(file);
  };

  // Reorder Category Tree
  const handleMoveCategory = async (catId: string, direction: 'UP' | 'DOWN') => {
    const updated = [...categoryTree];
    const idx = updated.findIndex((c) => c.id === catId);
    if (idx === -1) return;

    if (direction === 'UP' && idx > 0) {
      const temp = updated[idx];
      updated[idx] = updated[idx - 1];
      updated[idx - 1] = temp;
    } else if (direction === 'DOWN' && idx < updated.length - 1) {
      const temp = updated[idx];
      updated[idx] = updated[idx + 1];
      updated[idx + 1] = temp;
    }

    setCategoryTree(updated);
    try {
      await fetch('http://localhost:3001/api/v1/admin/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: updated.map((c) => c.id) }),
      });
      showToast('Đã lưu thứ tự sắp xếp cây danh mục mới!');
    } catch {}
  };

  // Filtered Products
  const filteredProducts = inventory.filter((p) => {
    const matchSearch =
      productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(productSearch.toLowerCase());
    const matchStatus =
      productStatusFilter === 'ALL' ||
      (productStatusFilter === 'ACTIVE' && p.stock > 0) ||
      (productStatusFilter === 'ARCHIVED' && p.stock === 0);
    return matchSearch && matchStatus;
  });

  // Export Data to CSV
  const handleExportCSV = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) {
      showToast('Không có dữ liệu để xuất.');
      return;
    }
    const headers = Object.keys(rows[0]).join(',');
    const values = rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + headers + '\n' + values;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã xuất file ${filename}.csv thành công!`);
  };

  // Order Status Updates
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || 'Lỗi cập nhật trạng thái đơn hàng');
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (status === 'READY_FOR_PICKUP') {
        const sName = data.shipperInfo?.name || 'Nguyễn Văn Tùng';
        const sPhone = data.shipperInfo?.phone || '0982 341 234';
        showToast(`🚚 Đã gọi bưu tá thành công: ${sName} (${sPhone}) đang đến kho lấy hàng!`);
      } else if (status === 'SHIPPING') {
        const sName = data.shipperInfo?.name || 'Shipper';
        showToast(`📦 Đã bàn giao kiện hàng cho Bưu tá ${sName}! Kiện hàng đang vận chuyển.`);
      } else if (status === 'DELIVERED') {
        showToast(`🎉 Khách hàng đã ký nhận thành công! Đã ghi nhận đối soát COD.`);
      } else if (status === 'PACKING') {
        showToast(`📦 Đã chuyển đơn #${orderId.slice(-6)} sang Đang đóng gói & chuẩn bị xuất kho.`);
      } else {
        showToast(`Đã cập nhật trạng thái đơn #${orderId.slice(-6)} sang ${status}`);
      }
      fetchData();
    } catch {
      showToast('Lỗi kết nối máy chủ khi cập nhật đơn hàng');
    }
  };

  const handleBulkUpdate = async (status: string) => {
    if (selectedOrderIds.length === 0) return;
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/orders/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedOrderIds, status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || 'Lỗi khi cập nhật đơn hàng hàng loạt');
        return;
      }
      showToast(`Đã cập nhật ${selectedOrderIds.length} đơn hàng sang ${status}`);
      setSelectedOrderIds([]);
      fetchData();
    } catch {
      showToast('Lỗi khi cập nhật đơn hàng hàng loạt');
    }
  };

  // 4.3. ORDER MANAGEMENT ACTION HANDLERS
  const handleCallVerification = async (orderId: string, status: 'VERIFIED' | 'NO_ANSWER' | 'UNREACHABLE') => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/orders/${orderId}/call-verification`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, callVerification: status } : o))
        );
        showToast(
          status === 'VERIFIED'
            ? 'Đã xác thực số điện thoại khách hàng! Đơn hàng đủ điều kiện xuất kho.'
            : status === 'NO_ANSWER'
            ? 'Đã ghi nhận cuộc gọi không bắt máy (Thử lại sau 15p)'
            : 'Đã đánh dấu số không liên lạc được / Nghi ngờ bom hàng'
        );
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || 'Lỗi khi cập nhật xác thực cuộc gọi');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ');
    }
  };

  const handleSaveInternalNote = async (orderId: string, note: string, tags?: string[]) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/orders/${orderId}/internal-note`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNote: note, tags }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, internalNote: note, tags: tags || o.tags } : o))
        );
        setInternalNoteModal(null);
        showToast('Đã lưu ghi chú nội bộ và nhãn đơn hàng thành công!');
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || 'Lỗi khi lưu ghi chú nội bộ');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ khi lưu ghi chú');
    }
  };

  const handleCancelOrderConfirm = async () => {
    if (!cancelModalOrder) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/orders/${cancelModalOrder.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      if (res.ok) {
        showToast(`Đã hủy đơn hàng #${(cancelModalOrder.trackingId || cancelModalOrder.id || '').slice(0, 8)}. Hệ thống đã tự động hoàn tồn kho khả dụng!`);
        setCancelModalOrder(null);
        setCancelReason('Khách hàng đổi ý / Thay đổi địa chỉ');
        fetchData();
      }
    } catch {
      showToast('Lỗi khi hủy đơn hàng');
    }
  };

  const handleReviewReturn = async (id: string, action: 'APPROVE' | 'REJECT', reason?: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/orders/returns/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || (action === 'APPROVE' ? 'Đã duyệt yêu cầu đổi trả và tạo vận đơn thu hồi!' : 'Đã từ chối yêu cầu đổi trả'));
        fetchData();
      }
    } catch {
      showToast('Lỗi khi xử lý duyệt yêu cầu đổi trả');
    }
  };

  const handleInspectReturn = async (id: string, result: 'RESTOCKED' | 'DAMAGED_WRITEOFF', notes?: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/orders/returns/${id}/inspect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, notes }),
      });
      const data = await res.json();
      if (res.ok) {
        setInspectReturnModal(null);
        showToast(data.message || 'Đã kiểm tra hàng và kích hoạt hoàn tiền tự động!');
        fetchData();
      }
    } catch {
      showToast('Lỗi khi kiểm tra hàng hoàn kho');
    }
  };

  // 4.2. INVENTORY ACTION HANDLERS
  const handleReleaseHold = async (holdId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/inventory/holds/${holdId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTemporaryHolds((prev) => prev.filter((h) => h.id !== holdId));
        showToast(`Đã giải phóng phiên giữ hàng #${holdId}, hoàn trả số lượng vào tồn kho khả dụng!`);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi giải phóng giữ hàng');
    }
  };

  const handleTriggerOmnichannelSync = async () => {
    setIsOmnichannelSyncing(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/inventory/omnichannel-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bufferPercentage: safeBufferPercent }),
      });
      const data = await res.json();
      setOmnichannelSyncResult(data);
      showToast(`Đã đồng bộ tồn kho thành công lên 4 sàn với tỷ lệ tồn kho an toàn ${safeBufferPercent}%!`);
    } catch {
      showToast('Lỗi khi đồng bộ tồn kho đa kênh');
    } finally {
      setIsOmnichannelSyncing(false);
    }
  };

  const handleDispatchTestAlert = async (item?: any) => {
    try {
      const channels = Object.entries(alertChannels)
        .filter(([_, active]) => active)
        .map(([c]) => c.toUpperCase());
      await fetch('http://localhost:3001/api/v1/admin/inventory/alerts/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channels,
          productId: item?.id,
          productName: item?.name,
          currentStock: item ? item.available : 15,
          threshold: item ? item.minThreshold : 25,
        }),
      });
      showToast(`Đã gửi cảnh báo tồn kho tới [${channels.join(', ')}]!`);
    } catch {
      showToast('Lỗi khi gửi thông báo cảnh báo');
    }
  };

  const openStockModalForReorder = (prod: any) => {
    setStockForm({
      productId: prod.id,
      type: 'NHẬP_KHO_NCC',
      warehouse: 'Kho Hà Nội (Cầu Giấy)',
      toWarehouse: 'Kho TP.HCM (Quận 1)',
      delta: prod.recommendedReorder || 50,
      unitCost: prod.costPrice || 750,
      systemStock: prod.available || 0,
      actualStock: prod.available || 0,
      referenceId: `PO-NCC-APL-${Date.now().toString().slice(-4)}`,
      batchNumber: `LOT-2026-Q4-${Date.now().toString().slice(-3)}`,
      expiryDate: '2028-12-31',
      notes: `Nhập bổ sung theo gợi ý vận tốc bán (${prod.salesVelocity || 8} cái/ngày)`,
      performedBy: 'Trần Văn Quản Kho',
    });
    setIsStockModalOpen(true);
  };

  // ==========================================
  // 4.7. VẬN CHUYỂN VÀ LOGISTICS ACTION HANDLERS
  // ==========================================
  const handleToggleCarrier = async (carrierId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
      const res = await fetch(`http://localhost:3001/api/v1/admin/logistics/carriers/${carrierId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi cập nhật trạng thái hãng');
    }
  };

  const handleUpdateSmartRouting = async (newStrategy: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/logistics/smart-routing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy: newStrategy }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi cập nhật Smart Routing');
    }
  };

  const handleCreateShipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/logistics/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShipmentForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setIsNewShipmentModalOpen(false);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi tạo vận đơn');
    }
  };

  const handleBatchCreateShipments = async () => {
    try {
      const sampleOrderIds = ['ORD-BATCH-101', 'ORD-BATCH-102', 'ORD-BATCH-103'];
      const res = await fetch('http://localhost:3001/api/v1/admin/logistics/shipments/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: sampleOrderIds }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi tạo vận đơn hàng loạt');
    }
  };

  const handleUpdateShipmentStatus = async (shipmentId: string, status: string, note?: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/logistics/shipments/${shipmentId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi cập nhật trạng thái vận đơn');
    }
  };

  const handleDeliveryExceptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipmentForException) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/logistics/shipments/${selectedShipmentForException.id}/exception`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: exceptionForm.action,
          payload: {
            scheduledDate: exceptionForm.scheduledDate,
            note: exceptionForm.note,
            newAddress: exceptionForm.newAddress,
            newPhone: exceptionForm.newPhone,
            reason: exceptionForm.reason,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setIsExceptionModalOpen(false);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi xử lý sự cố giao hàng');
    }
  };

  const handlePrintShipmentLabel = async (shipmentId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/logistics/shipments/${shipmentId}/print`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setSelectedLabelData(data);
        setIsLabelModalOpen(true);
      }
    } catch {
      showToast('Lỗi khi tạo nhãn in vận chuyển');
    }
  };

  const handleApproveLogisticsCod = async (batchId: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/logistics/cod/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi duyệt tất toán COD');
    }
  };

  const handleCalculateRateSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCalculatingRate(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/logistics/calculate-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calculatorForm),
      });
      const data = await res.json();
      setCalculatorResult(data);
    } catch {
      showToast('Lỗi khi tính cước vận chuyển');
    } finally {
      setIsCalculatingRate(false);
    }
  };

  const handleSaveWarehouseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/logistics/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(warehouseForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setIsWarehouseModalOpen(false);
        fetchData();
      }
    } catch {
      showToast('Lỗi khi lưu thông tin kho hàng');
    }
  };


  const value: Record<string, any> = {
    activeTab,
    setActiveTab,
    productSubTab,
    setProductSubTab,
    inventorySubTab,
    setInventorySubTab,
    warehouses,
    setWarehouses,
    temporaryHolds,
    setTemporaryHolds,
    safeBufferPercent,
    setSafeBufferPercent,
    isOmnichannelSyncing,
    setIsOmnichannelSyncing,
    omnichannelSyncResult,
    setOmnichannelSyncResult,
    alertChannels,
    setAlertChannels,
    selectedLedgerFilter,
    setSelectedLedgerFilter,
    selectedLedgerWarehouse,
    setSelectedLedgerWarehouse,
    overview,
    setOverview,
    funnelData,
    setFunnelData,
    analyticsData,
    setAnalyticsData,
    analyticsTimeRange,
    setAnalyticsTimeRange,
    analyticsChannel,
    setAnalyticsChannel,
    analyticsRole,
    setAnalyticsRole,
    analyticsActiveSubTab,
    setAnalyticsActiveSubTab,
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    isSessionReplayModalOpen,
    setIsSessionReplayModalOpen,
    selectedSessionReplay,
    setSelectedSessionReplay,
    scheduleForm,
    setScheduleForm,
    orders,
    setOrders,
    orderStatusCounts,
    setOrderStatusCounts,
    totalOrdersCount,
    setTotalOrdersCount,
    inventory,
    setInventory,
    stockLedger,
    setStockLedger,
    customers,
    setCustomers,
    finance,
    setFinance,
    coupons,
    setCoupons,
    carriers,
    setCarriers,
    systemSettings,
    setSystemSettings,
    auditLogs,
    setAuditLogs,
    categoryTree,
    setCategoryTree,
    dbCategories,
    setDbCategories,
    brands,
    setBrands,
    attributeGroups,
    setAttributeGroups,
    isNewAttrModalOpen,
    setIsNewAttrModalOpen,
    newAttrForm,
    setNewAttrForm,
    loading,
    setLoading,
    orderStatusFilter,
    setOrderStatusFilter,
    orderSearch,
    setOrderSearch,
    productSearch,
    setProductSearch,
    productStatusFilter,
    setProductStatusFilter,
    selectedOrderIds,
    setSelectedOrderIds,
    selectedProductIds,
    setSelectedProductIds,
    auditSearch,
    setAuditSearch,
    auditSeverity,
    setAuditSeverity,
    actionSuccessMsg,
    setActionSuccessMsg,
    systemActiveSubTab,
    setSystemActiveSubTab,
    auditResourceFilter,
    setAuditResourceFilter,
    selectedAuditDiff,
    setSelectedAuditDiff,
    isAuditDiffModalOpen,
    setIsAuditDiffModalOpen,
    selectedAdminUser,
    setSelectedAdminUser,
    isUserRoleModalOpen,
    setIsUserRoleModalOpen,
    adminUserForm,
    setAdminUserForm,
    isCmsModalOpen,
    setIsCmsModalOpen,
    cmsForm,
    setCmsForm,
    storeConfigForm,
    setStoreConfigForm,
    isBackingUpDb,
    setIsBackingUpDb,
    isTogglingMaintenance,
    setIsTogglingMaintenance,
    isLifecycleModalOpen,
    setIsLifecycleModalOpen,
    lifecycleRunning,
    setLifecycleRunning,
    lifecycleResult,
    setLifecycleResult,
    lifecycleCarrier,
    setLifecycleCarrier,
    lifecycleCoupon,
    setLifecycleCoupon,
    isProductModalOpen,
    setIsProductModalOpen,
    isEditMode,
    setIsEditMode,
    activeModalTab,
    setActiveModalTab,
    isBatchProductModalOpen,
    setIsBatchProductModalOpen,
    isCsvImportModalOpen,
    setIsCsvImportModalOpen,
    isStockModalOpen,
    setIsStockModalOpen,
    isCouponModalOpen,
    setIsCouponModalOpen,
    isEInvoiceModalOpen,
    setIsEInvoiceModalOpen,
    isRefundModalOpen,
    setIsRefundModalOpen,
    isCustomer360Open,
    setIsCustomer360Open,
    isCampaignModalOpen,
    setIsCampaignModalOpen,
    crmSubTab,
    setCrmSubTab,
    customerSearch,
    setCustomerSearch,
    customerTierFilter,
    setCustomerTierFilter,
    customerLifecycleFilter,
    setCustomerLifecycleFilter,
    customerSourceFilter,
    setCustomerSourceFilter,
    customerBehaviorFilter,
    setCustomerBehaviorFilter,
    customer360Data,
    setCustomer360Data,
    customer360Loading,
    setCustomer360Loading,
    customer360ActiveTab,
    setCustomer360ActiveTab,
    newCustomerNote,
    setNewCustomerNote,
    newCustomerTag,
    setNewCustomerTag,
    crmSegmentsData,
    setCrmSegmentsData,
    campaignTarget,
    setCampaignTarget,
    campaignChannel,
    setCampaignChannel,
    campaignType,
    setCampaignType,
    campaignCouponCode,
    setCampaignCouponCode,
    campaignSubject,
    setCampaignSubject,
    campaignMessage,
    setCampaignMessage,
    isSubmittingCampaign,
    setIsSubmittingCampaign,
    remarketingSyncLoading,
    setRemarketingSyncLoading,
    automationWorkflows,
    setAutomationWorkflows,
    marketingSubTab,
    setMarketingSubTab,
    marketingData,
    setMarketingData,
    isFlashSaleModalOpen,
    setIsFlashSaleModalOpen,
    isComboModalOpen,
    setIsComboModalOpen,
    isCrossSellModalOpen,
    setIsCrossSellModalOpen,
    isLoyaltyAdjustModalOpen,
    setIsLoyaltyAdjustModalOpen,
    isMarketingCampaignModalOpen,
    setIsMarketingCampaignModalOpen,
    isBannerModalOpen,
    setIsBannerModalOpen,
    isLandingPageModalOpen,
    setIsLandingPageModalOpen,
    newCouponForm,
    setNewCouponForm,
    newFlashSaleForm,
    setNewFlashSaleForm,
    newComboForm,
    setNewComboForm,
    newCrossSellForm,
    setNewCrossSellForm,
    loyaltyAdjustForm,
    setLoyaltyAdjustForm,
    newMarketingCampaignForm,
    setNewMarketingCampaignForm,
    newBannerForm,
    setNewBannerForm,
    newLandingPageForm,
    setNewLandingPageForm,
    financeSubTab,
    setFinanceSubTab,
    isReconcileRunning,
    setIsReconcileRunning,
    isAdjustEInvoiceModalOpen,
    setIsAdjustEInvoiceModalOpen,
    selectedEInvoice,
    setSelectedEInvoice,
    isArDebtModalOpen,
    setIsArDebtModalOpen,
    isApDebtModalOpen,
    setIsApDebtModalOpen,
    newEInvoiceForm,
    setNewEInvoiceForm,
    adjustEInvoiceForm,
    setAdjustEInvoiceForm,
    newArDebtForm,
    setNewArDebtForm,
    newApDebtForm,
    setNewApDebtForm,
    logisticsSubTab,
    setLogisticsSubTab,
    logisticsData,
    setLogisticsData,
    isNewShipmentModalOpen,
    setIsNewShipmentModalOpen,
    isWarehouseModalOpen,
    setIsWarehouseModalOpen,
    isExceptionModalOpen,
    setIsExceptionModalOpen,
    selectedShipmentForException,
    setSelectedShipmentForException,
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    selectedTrackingShipment,
    setSelectedTrackingShipment,
    isLabelModalOpen,
    setIsLabelModalOpen,
    selectedLabelData,
    setSelectedLabelData,
    shipmentFilterStatus,
    setShipmentFilterStatus,
    shipmentSearch,
    setShipmentSearch,
    newShipmentForm,
    setNewShipmentForm,
    warehouseForm,
    setWarehouseForm,
    exceptionForm,
    setExceptionForm,
    calculatorForm,
    setCalculatorForm,
    calculatorResult,
    setCalculatorResult,
    isCalculatingRate,
    setIsCalculatingRate,
    orderSubTab,
    setOrderSubTab,
    orderChannelFilter,
    setOrderChannelFilter,
    orderPaymentFilter,
    setOrderPaymentFilter,
    returnRequests,
    setReturnRequests,
    selectedOrderDetail,
    setSelectedOrderDetail,
    cancelModalOrder,
    setCancelModalOrder,
    cancelReason,
    setCancelReason,
    inspectReturnModal,
    setInspectReturnModal,
    inspectResult,
    setInspectResult,
    inspectNotes,
    setInspectNotes,
    selectedPrintFormat,
    setSelectedPrintFormat,
    internalNoteModal,
    setInternalNoteModal,
    batchJob,
    setBatchJob,
    printDocument,
    setPrintDocument,
    selectedCustomer,
    setSelectedCustomer,
    refundTargetOrder,
    setRefundTargetOrder,
    initialProductState,
    productForm,
    setProductForm,
    batchProductForm,
    setBatchProductForm,
    csvValidationResult,
    setCsvValidationResult,
    stockForm,
    setStockForm,
    refundForm,
    setRefundForm,
    campaignForm,
    setCampaignForm,
    couponForm,
    setCouponForm,
    invoiceForm,
    setInvoiceForm,
    calcForm,
    setCalcForm,
    calcResult,
    setCalcResult,
    isCalculating,
    setIsCalculating,
    storeForm,
    setStoreForm,
    fetchData,
    showToast,
    fetchEnterpriseAnalytics,
    handleSaveEmailSchedule,
    handleExportAnalytics,
    handleSaveStoreConfig,
    handleOpenEditUserModal,
    handleUpdateAdminUser,
    handleTriggerBackup,
    handleToggleMaintenance,
    handleOpenCmsModal,
    handleSaveCmsPost,
    handleOpenCustomer360,
    handleExecuteLifecycle,
    handleSaveCustomerNote,
    handleAddCustomerTag,
    handleRemoveCustomerTag,
    handleOpenCampaignModal,
    handleSendCampaignSubmit,
    handleSyncRemarketing,
    handleToggleWorkflow,
    handleToggleCoupon,
    handleDeleteCoupon,
    handleCreateCouponSubmit,
    handleCreateFlashSaleSubmit,
    handleCreateComboSubmit,
    handleCreateCrossSellSubmit,
    handleAdjustLoyaltySubmit,
    handleCreateCampaignSubmit,
    handleCreateBannerSubmit,
    handleCreateLandingPageSubmit,
    handlePayoutAffiliate,
    handleSyncAdProductFeed,
    handleRunReconciliation,
    handleResolveDiscrepancy,
    handleApproveCod,
    handleCreateArDebtSubmit,
    handleSettleArDebt,
    handleCreateApDebtSubmit,
    handlePayApDebt,
    handleApproveVendorPayout,
    handleIssueEInvoiceSubmit,
    handleAdjustOrCancelEInvoiceSubmit,
    handleResendEInvoiceEmail,
    openEInvoiceModal,
    openAddProductModal,
    openEditProductModal,
    handleGenerateVariantMatrix,
    handleSaveProduct,
    handleSoftDelete,
    handleToggleAttributeFilter,
    handleAddOptionToAttribute,
    handleCreateAttribute,
    handleExecuteBatchUpdate,
    handleDownloadTemplateCsv,
    handleCsvFileUpload,
    handleMoveCategory,
    filteredProducts,
    handleExportCSV,
    handleUpdateOrderStatus,
    handleBulkUpdate,
    handleCallVerification,
    handleSaveInternalNote,
    handleCancelOrderConfirm,
    handleReviewReturn,
    handleInspectReturn,
    handleReleaseHold,
    handleTriggerOmnichannelSync,
    handleDispatchTestAlert,
    openStockModalForReorder,
    handleToggleCarrier,
    handleUpdateSmartRouting,
    handleCreateShipmentSubmit,
    handleBatchCreateShipments,
    handleUpdateShipmentStatus,
    handleDeliveryExceptionSubmit,
    handlePrintShipmentLabel,
    handleApproveLogisticsCod,
    handleCalculateRateSubmit,
    handleSaveWarehouseSubmit,
    lifecycleScenario,
    setLifecycleScenario,
  };

  return (
    <AdminContext.Provider value={value as AdminContextType}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext(): AdminContextType {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}
