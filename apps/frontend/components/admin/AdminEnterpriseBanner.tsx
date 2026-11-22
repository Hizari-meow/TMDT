'use client';

import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export interface AdminEnterpriseBannerProps {
  onOpenLifecycleModal?: () => void;
}

export const AdminEnterpriseBanner: React.FC<AdminEnterpriseBannerProps> = (props) => {
  const ctx = useAdminContext();
  const onOpenLifecycleModal = props.onOpenLifecycleModal || (() => ctx.setIsLifecycleModalOpen(true));

  return (
    <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-lg border border-blue-800/60 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-400/30">
              <Zap className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span>Quy Trình Quản Trị Liên Kết Doanh Nghiệp (End-to-End Enterprise Lifecycle)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% CSDL PostgreSQL
              </span>
            </h2>
          </div>
          <p className="text-xs text-blue-200/80 leading-relaxed max-w-3xl">
            Một đơn hàng di chuyển tuần tự và đồng bộ qua tất cả phân hệ: <strong>Sản phẩm → Kho giữ hàng → Xác nhận đơn → Vận đơn giao vận → Đối soát COD &amp; Hóa đơn VAT → CRM nâng hạng thành viên → Báo cáo BI</strong>, dưới sự giám sát của <strong>RBAC &amp; Audit Log bất biến</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenLifecycleModal}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Mô Phỏng Đơn Hàng Qua 8 Phân Hệ (Live CSDL)</span>
          </button>
        </div>
      </div>

      {/* Interactive Flow Visualizer */}
      <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-x-auto text-xs">
        <div className="min-w-[850px] flex items-center justify-between text-center gap-2">
          <div className="flex-1 p-2.5 bg-white/10 rounded-xl border border-white/10 space-y-1">
            <div className="text-[10px] text-blue-300 font-bold uppercase">1. Sản Phẩm</div>
            <div className="font-bold text-white text-xs truncate">Kiểm Tra Giá &amp; Tồn</div>
            <span className="text-[9px] text-gray-400">products</span>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />

          <div className="flex-1 p-2.5 bg-white/10 rounded-xl border border-white/10 space-y-1">
            <div className="text-[10px] text-amber-300 font-bold uppercase">2. Kho Hàng</div>
            <div className="font-bold text-white text-xs truncate">Tạm Giữ &amp; Sổ Cái</div>
            <span className="text-[9px] text-gray-400">temporary_holds</span>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />

          <div className="flex-1 p-2.5 bg-white/10 rounded-xl border border-white/10 space-y-1">
            <div className="text-[10px] text-emerald-300 font-bold uppercase">3. Đơn Hàng</div>
            <div className="font-bold text-white text-xs truncate">Xác Nhận &amp; Xuất Kho</div>
            <span className="text-[9px] text-gray-400">orders &amp; items</span>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />

          <div className="flex-1 p-2.5 bg-white/10 rounded-xl border border-white/10 space-y-1">
            <div className="text-[10px] text-cyan-300 font-bold uppercase">4. Vận Chuyển</div>
            <div className="font-bold text-white text-xs truncate">Phát Hành Vận Đơn</div>
            <span className="text-[9px] text-gray-400">shipments</span>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />

          <div className="flex-1 p-2.5 bg-white/10 rounded-xl border border-white/10 space-y-1">
            <div className="text-[10px] text-purple-300 font-bold uppercase">5. COD &amp; Thuế</div>
            <div className="font-bold text-white text-xs truncate">Đối Soát &amp; HĐ VAT</div>
            <span className="text-[9px] text-gray-400">cod &amp; e_invoices</span>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />

          <div className="flex-1 p-2.5 bg-white/10 rounded-xl border border-white/10 space-y-1">
            <div className="text-[10px] text-pink-300 font-bold uppercase">6. Khách Hàng CRM</div>
            <div className="font-bold text-white text-xs truncate">Nâng Hạng VIP &amp; Điểm</div>
            <span className="text-[9px] text-gray-400">customers &amp; tiers</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-blue-200/70">
          <div className="flex items-center gap-3">
            <span>🛡️ <strong>RBAC</strong>: Kiểm soát quyền hạn 6 vai trò nhân sự</span>
            <span>📋 <strong>Audit Log</strong>: Ghi vết bất biến SHA-256 từng bước thao tác</span>
          </div>
          <div className="text-emerald-400 font-bold">
            ✓ Dữ liệu ghi nhận trực tiếp vào các bảng PostgreSQL
          </div>
        </div>
      </div>
    </div>
  );
};
