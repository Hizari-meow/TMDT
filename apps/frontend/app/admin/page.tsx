'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { AdminProvider, useAdminContext } from '@/components/admin/AdminContext';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminNavTabs } from '@/components/admin/AdminNavTabs';
import { AdminEnterpriseBanner } from '@/components/admin/AdminEnterpriseBanner';

// Tabs
import { AdminProductsTab } from '@/components/admin/tabs/AdminProductsTab';
import { AdminInventoryTab } from '@/components/admin/tabs/AdminInventoryTab';
import { AdminOrdersTab } from '@/components/admin/tabs/AdminOrdersTab';
import { AdminCustomersTab } from '@/components/admin/tabs/AdminCustomersTab';
import { AdminMarketingTab } from '@/components/admin/tabs/AdminMarketingTab';
import { AdminFinanceTab } from '@/components/admin/tabs/AdminFinanceTab';
import { AdminLogisticsTab } from '@/components/admin/tabs/AdminLogisticsTab';
import { AdminOverviewTab } from '@/components/admin/tabs/AdminOverviewTab';
import { AdminSystemTab } from '@/components/admin/tabs/AdminSystemTab';

// Modals
import { ProductModals } from '@/components/admin/modals/ProductModals';
import { InventoryModals } from '@/components/admin/modals/InventoryModals';
import { OrderModals } from '@/components/admin/modals/OrderModals';
import { CustomerModals } from '@/components/admin/modals/CustomerModals';
import { MarketingModals } from '@/components/admin/modals/MarketingModals';
import { FinanceModals } from '@/components/admin/modals/FinanceModals';
import { LogisticsModals } from '@/components/admin/modals/LogisticsModals';
import { SystemModals } from '@/components/admin/modals/SystemModals';
import { EnterpriseLifecycleModal } from '@/components/admin/modals/EnterpriseLifecycleModal';

function AdminContent() {
  const { activeTab, actionSuccessMsg } = useAdminContext();

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-sans selection:bg-[#0071e3] selection:text-white">
      {/* 1. Header Bar: Apple Enterprise Style */}
      <AdminHeader />

      {/* Toast Feedback Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-16 right-6 z-50 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-7 space-y-6 flex-1">
        {/* 2. Top Navigation: 9 Modules */}
        <AdminNavTabs />

        {/* Enterprise Operational Lifecycle Banner */}
        <AdminEnterpriseBanner />

        {/* Tab Modules */}
        {activeTab === 'products' && <AdminProductsTab />}
        {activeTab === 'inventory' && <AdminInventoryTab />}
        {activeTab === 'orders' && <AdminOrdersTab />}
        {activeTab === 'customers' && <AdminCustomersTab />}
        {activeTab === 'marketing' && <AdminMarketingTab />}
        {activeTab === 'finance' && <AdminFinanceTab />}
        {activeTab === 'logistics' && <AdminLogisticsTab />}
        {activeTab === 'overview' && <AdminOverviewTab />}
        {activeTab === 'system' && <AdminSystemTab />}
      </div>

      {/* Modular Enterprise Modals */}
      <ProductModals />
      <InventoryModals />
      <OrderModals />
      <CustomerModals />
      <MarketingModals />
      <FinanceModals />
      <LogisticsModals />
      <SystemModals />
      <EnterpriseLifecycleModal />
    </div>
  );
}

export default function AdminEnterprisePortal() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}
