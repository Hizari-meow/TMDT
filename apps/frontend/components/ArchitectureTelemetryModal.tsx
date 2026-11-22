'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Database,
  ShieldCheck,
  Activity,
  X,
  Server,
  Terminal,
  Zap,
} from 'lucide-react';

export const ArchitectureTelemetryModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Discreet Apple-style Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-[#1d1d1f] text-[11px] font-mono shadow-lg transition-all"
        title="Thông số kỹ thuật hạ tầng hệ thống"
      >
        <Activity className="w-3.5 h-3.5 text-[#0071e3]" />
        <span className="hidden sm:inline font-semibold">Telemetry</span>
      </button>

      {/* Telemetry Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between overflow-y-auto p-6 sm:p-8 space-y-6 text-[#1d1d1f]">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#0071e3] flex items-center justify-center text-white shadow-sm">
                    <Terminal className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#1d1d1f]">Thông Số Kỹ Thuật Hạ Tầng</h2>
                    <p className="text-xs text-[#6e6e73]">Kiến trúc phân tán chịu tải cao 50,000+ RPS</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-[#1d1d1f] hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stack Architecture Details */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1d1d1f] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#0071e3]" />
                      Tầng 1: Redis 7.2 In-Memory Lock
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[#6e6e73] text-[11px] leading-relaxed">
                    Trừ tồn kho atomic bằng Redis Lua Scripting trong memory dưới 2ms, chặn tuyệt đối over-selling khi có 10,000 lượt click đồng thời.
                  </p>
                </div>

                <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1d1d1f] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
                      Tầng 2: Token Chống Bot &amp; Đầu Cơ
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[#6e6e73] text-[11px] leading-relaxed">
                    Action Token ký số SHA-256 có thời hạn 30 giây, chỉ sử dụng 1 lần (Single-use) để ngăn chặn auto-clicker và dồn request.
                  </p>
                </div>

                <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1d1d1f] flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#0071e3]" />
                      Tầng 3: Hàng Đợi Bất Đồng Bộ BullMQ
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                      RUNNING
                    </span>
                  </div>
                  <p className="text-[#6e6e73] text-[11px] leading-relaxed">
                    Van xả lũ bất đồng bộ đệm đơn hàng, worker xử lý tuần tự giúp bảo vệ cơ sở dữ liệu không bị nghẽn I/O.
                  </p>
                </div>

                <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1d1d1f] flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#0071e3]" />
                      Tầng 4: PostgreSQL 16 Phân Vùng Range
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                      HEALTHY
                    </span>
                  </div>
                  <p className="text-[#6e6e73] text-[11px] leading-relaxed">
                    Phân vùng bảng đơn hàng theo tháng (Monthly Range Partitioning), tối ưu hóa index và truy vấn cho hàng triệu bản ghi.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-[#1d1d1f] hover:bg-black text-white font-semibold text-xs rounded-full transition-colors shadow-sm"
                >
                  Đóng Bảng Thông Số
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
