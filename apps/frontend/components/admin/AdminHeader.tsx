'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, RefreshCw, ExternalLink } from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export interface AdminHeaderProps {
  loading?: boolean;
  onRefresh?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = (props) => {
  const ctx = useAdminContext();
  const loading = props.loading !== undefined ? props.loading : ctx.loading;
  const onRefresh = props.onRefresh || ctx.loadAllData;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/80 px-4 sm:px-8 lg:px-12 2xl:px-16 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#1d1d1f] flex items-center justify-center text-white shadow-sm">
          <Zap className="w-4 h-4 fill-white text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-[#1d1d1f]">
              TECHZONE SELLER &amp; ADMIN CENTER
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-50 text-[#0071e3] border border-blue-200">
              ENTERPRISE v4.1
            </span>
          </div>
          <p className="text-[11px] text-[#6e6e73]">
            Hệ Thống Quản Trị Kệ Hàng, SKU Biến Thể, Cây Danh Mục &amp; Vận Hành Đa Kênh
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          title="Làm mới dữ liệu từ cụm Server"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0071e3]' : ''}`} />
        </button>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-[#1d1d1f] shadow-xs transition-colors"
        >
          <span>Xem Cửa Hàng</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#6e6e73]" />
        </Link>
      </div>
    </header>
  );
};
