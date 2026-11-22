'use client';

import React from 'react';
import {
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Tag,
  DollarSign,
  Truck,
  BarChart3,
  Shield,
} from 'lucide-react';

import { useAdminContext } from '@/components/admin/AdminContext';

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

export interface AdminNavTabsProps {
  activeTab?: AdminTabId;
  setActiveTab?: (tab: AdminTabId) => void;
}

export const AdminNavTabs: React.FC<AdminNavTabsProps> = (props) => {
  const ctx = useAdminContext();
  const activeTab = props.activeTab || ctx.activeTab;
  const setActiveTab = props.setActiveTab || ctx.setActiveTab;

  const tabs = [
    { id: 'products' as const, label: '4.1. Quản Lý Sản Phẩm & Biến Thể', icon: Package },
    { id: 'inventory' as const, label: '4.2. Kho & Sổ Cái', icon: Boxes },
    { id: 'orders' as const, label: '4.3. Đơn Hàng & In Tem', icon: ShoppingCart },
    { id: 'customers' as const, label: '4.4. Khách Hàng (CRM)', icon: Users },
    { id: 'marketing' as const, label: '4.5. Khuyến Mãi & Flash Sale', icon: Tag },
    { id: 'finance' as const, label: '4.6. Tài Chính & Hóa Đơn VAT', icon: DollarSign },
    { id: 'logistics' as const, label: '4.7. Vận Chuyển & Logistics', icon: Truck },
    { id: 'overview' as const, label: '4.8. Báo Cáo & BI', icon: BarChart3 },
    { id: 'system' as const, label: '4.9. Phân Quyền & Cấu Hình', icon: Shield },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-gray-200/80 pb-4 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              active
                ? 'bg-[#0071e3] text-white shadow-xs'
                : 'bg-white text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-50 border border-gray-200/80'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
