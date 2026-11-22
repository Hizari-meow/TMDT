'use client';

import React from 'react';

import {
  Search,
  Shield,
  FileText,
  Play,
  History,
  Mail,
  MousePointer,
  PlayCircle
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const SystemModals: React.FC = () => {
  const {
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    isSessionReplayModalOpen,
    setIsSessionReplayModalOpen,
    selectedSessionReplay,
    scheduleForm,
    setScheduleForm,
    selectedAuditDiff,
    isAuditDiffModalOpen,
    setIsAuditDiffModalOpen,
    selectedAdminUser,
    isUserRoleModalOpen,
    setIsUserRoleModalOpen,
    adminUserForm,
    setAdminUserForm,
    isCmsModalOpen,
    setIsCmsModalOpen,
    cmsForm,
    setCmsForm,
    handleSaveEmailSchedule,
    handleUpdateAdminUser,
    handleSaveCmsPost
  } = useAdminContext();

  return (
    <>
            {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0071e3] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1d1d1f]">Lập Lịch Gửi Báo Cáo Định Kỳ Qua Email</h3>
                  <p className="text-[11px] text-[#6e6e73]">Tự động tổng hợp và gửi báo cáo PDF/Excel cho ban điều hành.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Tên Lịch Báo Cáo</label>
                <input
                  type="text"
                  value={scheduleForm.name}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                  placeholder="Ví dụ: Báo Cáo Doanh Thu Hàng Ngày CEO"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Tần Suất Gửi</label>
                  <select
                    value={scheduleForm.frequency}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="DAILY">Hàng Ngày (08:00 AM)</option>
                    <option value="WEEKLY">Hàng Tuần (Sáng Thứ Hai)</option>
                    <option value="MONTHLY">Hàng Tháng (Ngày 01)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Định Dạng Báo Cáo</label>
                  <select
                    value={scheduleForm.format}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, format: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="PDF">Bản In PDF Điều Hành (Executive)</option>
                    <option value="EXCEL">Bảng Tính Excel (.xlsx / .csv)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Góc Nhìn Báo Cáo (Role View)</label>
                <select
                  value={scheduleForm.roleView}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, roleView: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ceo">CEO View: Doanh thu, Lợi nhuận, AOV, ROAS & Tăng trưởng</option>
                  <option value="cmo">CMO View: Phễu chuyển đổi, CAC, Kênh Ads & Bỏ giỏ hàng</option>
                  <option value="cpo">CPO View: Ma trận ABC, Hàng tồn &gt; 60 ngày & Nhu cầu nhập hàng</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Danh Sách Email Nhận (Ngăn cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={scheduleForm.recipients}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, recipients: e.target.value })}
                  placeholder="ceo@techzone.vn, cfo@techzone.vn"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveEmailSchedule}
                className="px-4 py-2 bg-[#0071e3] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Lưu Cấu Hình Lịch Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.8. MODAL: TRÌNH PHÁT GHI LẠI PHIÊN (SESSION REPLAY PLAYER)        */}
      {/* =================================================================== */}

      {isSessionReplayModalOpen && selectedSessionReplay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1d1d1f]">
                    Trình Phát Ghi Lại Phiên Tương Tác: {selectedSessionReplay.id}
                  </h3>
                  <p className="text-[11px] text-[#6e6e73]">
                    {selectedSessionReplay.userType} • Thời lượng: {selectedSessionReplay.duration} • {selectedSessionReplay.pagesVisited} trang
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSessionReplayModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Replay Simulated Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
              {/* Player Stage */}
              <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-4 flex flex-col justify-between text-white relative min-h-[300px]">
                {/* Browser address mockup */}
                <div className="flex items-center gap-2 bg-gray-800/80 px-3 py-1.5 rounded-xl text-[11px] font-mono text-gray-300">
                  <span className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                  </span>
                  <span className="truncate">https://techzone.vn/checkout</span>
                </div>

                {/* Animated Cursor Mockup */}
                <div className="my-auto text-center space-y-2 p-6">
                  <div className="inline-block p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl space-y-2 text-left max-w-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                      <MousePointer className="w-4 h-4 animate-bounce" />
                      <span>Mô phỏng hành trình tương tác</span>
                    </div>
                    <div className="text-xs text-gray-200">
                      Khách hàng đang di chuyển chuột quanh khu vực chọn mã giảm giá và nút đặt hàng.
                    </div>
                    <div className="text-[10px] text-emerald-300 font-mono">
                      Outcome: {selectedSessionReplay.outcome}
                    </div>
                  </div>
                </div>

                {/* Player Controls Bar */}
                <div className="space-y-2 bg-gray-800/90 p-3 rounded-xl">
                  {/* Progress timeline */}
                  <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#0071e3] h-full w-2/3 rounded-full animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-300">
                    <div className="flex items-center gap-3">
                      <button type="button" className="hover:text-white font-bold flex items-center gap-1">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Phát Lại</span>
                      </button>
                      <span>02:15 / {selectedSessionReplay.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-gray-700 text-[10px] font-bold">Tốc độ: 1.5x</span>
                      <span className="text-emerald-400 font-semibold">1080p HD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Log Stream */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-3 overflow-y-auto max-h-[360px]">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nhật Ký Sự Kiện Từng Giây (Event Stream)
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-white rounded-xl border border-gray-200/80 space-y-0.5">
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>00:04</span>
                      <span className="text-blue-600 font-bold">NAVIGATE</span>
                    </div>
                    <p className="font-semibold text-gray-800">Truy cập Trang chủ TechZone từ Google Search</p>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-200/80 space-y-0.5">
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>00:32</span>
                      <span className="text-purple-600 font-bold">SCROLL</span>
                    </div>
                    <p className="font-semibold text-gray-800">Cuộn 75% trang xem bảng thông số kỹ thuật</p>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-200/80 space-y-0.5">
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>01:10</span>
                      <span className="text-emerald-600 font-bold">CLICK</span>
                    </div>
                    <p className="font-semibold text-gray-800">Nhấp nút &quot;Mua Ngay &amp; Nhận Hàng Siêu Tốc&quot;</p>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-200/80 space-y-0.5">
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>01:45</span>
                      <span className="text-blue-600 font-bold">CHECKOUT</span>
                    </div>
                    <p className="font-semibold text-gray-800">Điền địa chỉ giao hàng và tính cước vận chuyển</p>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-200/80 space-y-0.5">
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>02:15</span>
                      <span className="text-amber-600 font-bold">PROMO</span>
                    </div>
                    <p className="font-semibold text-gray-800">Nhập mã ưu đãi giảm giá FLASH50K</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 shrink-0">
              <span className="text-[11px] text-gray-500 font-mono">
                Microsoft Clarity &amp; Hotjar Recording ID: {selectedSessionReplay.id}
              </span>
              <button
                type="button"
                onClick={() => setIsSessionReplayModalOpen(false)}
                className="px-4 py-2 bg-[#1d1d1f] hover:bg-black text-white font-bold rounded-xl text-xs transition-colors"
              >
                Đóng Trình Phát
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.9. MODAL: CHI TIẾT NHẬT KÝ KIỂM TOÁN (AUDIT DIFF VIEWER)          */}
      {/* =================================================================== */}

      {isAuditDiffModalOpen && selectedAuditDiff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAuditDiffModalOpen(false)} />
          <div className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl z-10 text-[#1d1d1f] my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-[#1d1d1f]">
                  Chi Tiết Kiểm Toán Bất Biến: {selectedAuditDiff.id}
                </h3>
                {selectedAuditDiff.isSensitive && (
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-bold">
                    HÀNH ĐỘNG NHẠY CẢM
                  </span>
                )}
              </div>
              <button onClick={() => setIsAuditDiffModalOpen(false)} className="text-gray-400 hover:text-black p-1">
                ✕
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80">
                <div>
                  <span className="text-[10px] text-gray-500 block">Người thực hiện</span>
                  <span className="font-bold text-[#1d1d1f]">{selectedAuditDiff.actorName}</span>
                  <span className="text-[10px] text-gray-400 block font-mono">{selectedAuditDiff.actorEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Thời gian thao tác</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(selectedAuditDiff.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Địa chỉ IP</span>
                  <span className="font-mono font-bold text-gray-700">{selectedAuditDiff.ip}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Mức độ nghiêm trọng</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedAuditDiff.severity === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : selectedAuditDiff.severity === 'WARNING'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {selectedAuditDiff.severity}
                  </span>
                </div>
              </div>

              {/* Action Description */}
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <span className="text-[10px] text-blue-600 font-bold block uppercase tracking-wider">Mô tả nghiệp vụ</span>
                <p className="text-xs font-semibold text-blue-950 mt-0.5">{selectedAuditDiff.description}</p>
                <div className="mt-1 text-[11px] text-gray-500">
                  Tài nguyên: <strong className="text-gray-800 font-mono">{selectedAuditDiff.resource}</strong> • Định danh: <strong className="text-gray-800 font-mono">{selectedAuditDiff.entityId}</strong>
                </div>
              </div>

              {/* Before vs After Diff View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Giá Trị Trước Khi Sửa (Before Value)</span>
                  </div>
                  <pre className="p-3 bg-rose-50/50 border border-rose-200 rounded-2xl font-mono text-[11px] text-rose-950 whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                    {selectedAuditDiff.beforeValue || 'Không có dữ liệu trước (Khởi tạo mới)'}
                  </pre>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Giá Trị Sau Khi Sửa (After Value)</span>
                  </div>
                  <pre className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-2xl font-mono text-[11px] text-emerald-950 whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                    {selectedAuditDiff.afterValue || 'Không có dữ liệu'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 shrink-0">
              <span className="text-[11px] text-gray-500 font-mono">
                Bản ghi bất biến (Append-Only) • Không thể chỉnh sửa hoặc xóa
              </span>
              <button
                type="button"
                onClick={() => setIsAuditDiffModalOpen(false)}
                className="px-4 py-2 bg-[#1d1d1f] hover:bg-black text-white font-bold rounded-xl text-xs transition-colors"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.9. MODAL: CHỈNH SỬA ĐẶC QUYỀN TÀI KHOẢN ADMIN (RBAC USER MODAL)   */}
      {/* =================================================================== */}

      {isUserRoleModalOpen && selectedAdminUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsUserRoleModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl z-10 text-[#1d1d1f] my-8 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0071e3]" />
                <h3 className="text-base font-bold text-[#1d1d1f]">
                  Phân Quyền: {adminUserForm.name}
                </h3>
              </div>
              <button onClick={() => setIsUserRoleModalOpen(false)} className="text-gray-400 hover:text-black p-1">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-1">
                <div className="text-[10px] text-gray-500 font-semibold">Tài Khoản Nhân Sự:</div>
                <div className="font-bold text-gray-900">{adminUserForm.name}</div>
                <div className="font-mono text-gray-500">{adminUserForm.email}</div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Vai Trò Phân Quyền (RBAC Role)</label>
                <select
                  value={adminUserForm.role}
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, role: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] font-semibold focus:outline-none focus:border-[#0071e3]"
                >
                  <option value="Super Admin">Super Admin (Toàn quyền hệ thống &amp; Hạ tầng)</option>
                  <option value="Quản lý">Quản lý (Báo cáo, Đơn hàng, Sản phẩm, Khuyến mãi)</option>
                  <option value="Kế toán">Kế toán (Tài chính, Hóa đơn VAT; Không sửa giá bán)</option>
                  <option value="Nhân viên kho">Nhân viên kho (Nhập/xuất kho; Ẩn doanh thu)</option>
                  <option value="CSKH">CSKH (Xem đơn, Đổi trả, Chat; Ẩn giá vốn COGS)</option>
                  <option value="Marketing">Marketing (Khuyến mãi, Banner, SEO, Bài viết CMS)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Trạng Thái Tài Khoản</label>
                <select
                  value={adminUserForm.status}
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] font-semibold focus:outline-none focus:border-[#0071e3]"
                >
                  <option value="ACTIVE">ACTIVE (Đang Hoạt Động Bình Thường)</option>
                  <option value="SUSPENDED">SUSPENDED (Tạm Phong Tỏa Quyền Đăng Nhập)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminUserForm.enforce2fa}
                    onChange={(e) => setAdminUserForm({ ...adminUserForm, enforce2fa: e.target.checked })}
                    className="w-4 h-4 text-[#0071e3] rounded"
                  />
                  <span className="font-semibold text-gray-800">Bắt buộc xác thực 2 bước 2FA (TOTP)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminUserForm.ipRestricted}
                    onChange={(e) => setAdminUserForm({ ...adminUserForm, ipRestricted: e.target.checked })}
                    className="w-4 h-4 text-[#0071e3] rounded"
                  />
                  <span className="font-semibold text-gray-800">Giới hạn IP truy cập (Chỉ cho phép từ mạng nội bộ)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 shrink-0">
              <button
                type="button"
                onClick={() => setIsUserRoleModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleUpdateAdminUser}
                className="px-4 py-2 bg-[#0071e3] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Lưu Thay Đổi Đặc Quyền
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.9. MODAL: BIÊN TẬP BÀI VIẾT CMS & METADATA SEO                    */}
      {/* =================================================================== */}

      {isCmsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCmsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl z-10 text-[#1d1d1f] my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0071e3]" />
                <h3 className="text-base font-bold text-[#1d1d1f]">
                  {cmsForm.id ? `Chỉnh Sửa Bài Viết: ${cmsForm.title}` : 'Soạn Thảo Bài Viết Blog / Tin Tức Mới'}
                </h3>
              </div>
              <button onClick={() => setIsCmsModalOpen(false)} className="text-gray-400 hover:text-black p-1">
                ✕
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Tiêu Đề Bài Viết</label>
                <input
                  type="text"
                  value={cmsForm.title}
                  onChange={(e) => setCmsForm({ ...cmsForm, title: e.target.value })}
                  placeholder="Nhập tiêu đề bài viết công nghệ..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Đường Dẫn Tĩnh (Slug URL)</label>
                  <input
                    type="text"
                    value={cmsForm.slug}
                    onChange={(e) => setCmsForm({ ...cmsForm, slug: e.target.value })}
                    placeholder="vd: danh-gia-iphone-16-pro-max"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Chuyên Mục</label>
                  <select
                    value={cmsForm.category}
                    onChange={(e) => setCmsForm({ ...cmsForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] font-semibold focus:outline-none focus:border-[#0071e3]"
                  >
                    <option value="Tin Tức Apple">Tin Tức Apple</option>
                    <option value="Đánh Giá & Review">Đánh Giá &amp; Review</option>
                    <option value="Hướng Dẫn Công Nghệ">Hướng Dẫn Công Nghệ</option>
                    <option value="Khuyến Mãi & Sự Kiện">Khuyến Mãi &amp; Sự Kiện</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Tác Giả / Ban Biên Tập</label>
                  <input
                    type="text"
                    value={cmsForm.author}
                    onChange={(e) => setCmsForm({ ...cmsForm, author: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Trạng Thái Xuất Bản</label>
                  <select
                    value={cmsForm.status}
                    onChange={(e) => setCmsForm({ ...cmsForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] font-semibold focus:outline-none focus:border-[#0071e3]"
                  >
                    <option value="PUBLISHED">PUBLISHED (Xuất bản công khai)</option>
                    <option value="DRAFT">DRAFT (Lưu bản nháp nội bộ)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Thẻ Tiêu Đề SEO (Meta Title)</label>
                <input
                  type="text"
                  value={cmsForm.seoTitle}
                  onChange={(e) => setCmsForm({ ...cmsForm, seoTitle: e.target.value })}
                  placeholder="Tiêu đề hiển thị trên Google Search..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Thẻ Mô Tả SEO (Meta Description)</label>
                <textarea
                  rows={2}
                  value={cmsForm.seoDesc}
                  onChange={(e) => setCmsForm({ ...cmsForm, seoDesc: e.target.value })}
                  placeholder="Tóm tắt nội dung bài viết dưới 160 ký tự cho công cụ tìm kiếm..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Nội Dung Bài Viết (Rich Text Content)</label>
                <textarea
                  rows={6}
                  value={cmsForm.content}
                  onChange={(e) => setCmsForm({ ...cmsForm, content: e.target.value })}
                  placeholder="Soạn nội dung bài viết, chèn hình ảnh minh họa..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 shrink-0">
              <button
                type="button"
                onClick={() => setIsCmsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveCmsPost}
                className="px-4 py-2 bg-[#0071e3] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Lưu &amp; Xuất Bản Bài Viết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: MÔ PHỎNG QUY TRÌNH LIÊN KẾT 8 PHÂN HỆ DOANH NGHIỆP TRÊN CSDL */}
      {/* =================================================================== */}


    </>
  );
};
