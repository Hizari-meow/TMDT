'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Search,
  Filter,
  Shield,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  Download,
  Upload,
  FileText,
  FileCheck,
  CreditCard,
  Building,
  Send,
  Globe,
  Sliders,
  Lock,
  Percent,
  Eye,
  X,
  Check,
  Copy,
  Bell,
  History,
  AlertOctagon,
  ShieldCheck,
  UserCheck,
  Store,
  HelpCircle,
  Key,
  Database,
  Image as ImageIcon
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const AdminSystemTab: React.FC = () => {
  const {
    systemSettings,
    auditLogs,
    auditSearch,
    setAuditSearch,
    auditSeverity,
    setAuditSeverity,
    systemActiveSubTab,
    setSystemActiveSubTab,
    auditResourceFilter,
    setAuditResourceFilter,
    setSelectedAuditDiff,
    setIsAuditDiffModalOpen,
    storeConfigForm,
    setStoreConfigForm,
    isBackingUpDb,
    isTogglingMaintenance,
    showToast,
    handleSaveStoreConfig,
    handleOpenEditUserModal,
    handleTriggerBackup,
    handleToggleMaintenance,
    handleOpenCmsModal
  } = useAdminContext();

          const sys = systemSettings || {};
          const storeInfo = sys.storeInfo || storeConfigForm;
          const sec = sys.securityGovernance || {
            enforce2fa: true,
            sessionTimeoutMinutes: 30,
            ipWhitelistEnabled: true,
            marketplaceMultiTenantIsolation: true,
            maxFailedLoginAttempts: 5,
          };
          const roles = sys.rbacRoles || [];
          const matrix = sys.permissionMatrix || [];
          const adminUsers = sys.adminUsers || [];
          const auditList = auditLogs || sys.auditLogs || [];
          const cmsPosts = sys.cmsPosts || [];
          const staticPages = sys.staticPages || [];
          const faqList = sys.faqList || [];
          const mediaList = sys.mediaLibrary || [];
          const backups = sys.backupSnapshots || [];
          const apiKeys = sys.developerApiKeys || [];
          const webhooks = sys.webhookEndpoints || [];
          const languages = sys.languages || [];
          const currencies = sys.currencies || [];
          const alertChannels = sys.internalAlertChannels || {};

          // Filter audit logs
          const filteredAuditLogs = (auditList || []).filter((log: any) => {
            if (!log) return false;
            const searchLower = (auditSearch || '').toLowerCase().trim();
            const matchesSearch =
              !searchLower ||
              (log.actorName && String(log.actorName).toLowerCase().includes(searchLower)) ||
              (log.actorEmail && String(log.actorEmail).toLowerCase().includes(searchLower)) ||
              (log.action && String(log.action).toLowerCase().includes(searchLower)) ||
              (log.resource && String(log.resource).toLowerCase().includes(searchLower)) ||
              (log.entityId && String(log.entityId).toLowerCase().includes(searchLower)) ||
              (log.ip && String(log.ip).includes(searchLower));
            const matchesSeverity =
              !auditSeverity || auditSeverity === 'ALL' || log.severity === auditSeverity;
            const matchesResource =
              !auditResourceFilter || auditResourceFilter === 'ALL' || log.resource === auditResourceFilter;
            return matchesSearch && matchesSeverity && matchesResource;
          });

          return (
            <div className="space-y-6">
              {/* Header Banner & Security Governance Status */}
              <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0071e3] flex items-center justify-center font-bold">
                        <Shield className="w-4 h-4" />
                      </div>
                      <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f]">
                        4.9. Quản Trị Hệ Thống &amp; Phân Quyền Doanh Nghiệp
                      </h2>
                    </div>
                    <p className="text-xs text-[#6e6e73]">
                      Cơ chế phân quyền vai trò (RBAC), nhật ký kiểm toán bất biến (Immutable Audit Trail), quản lý nội dung CMS &amp; thiết lập đa kênh an toàn.
                    </p>
                  </div>

                  {/* Security Status Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Multi-Tenant: Cách Ly Độc Lập</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>2FA TOTP: Bắt Buộc 100%</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200/80 rounded-xl text-xs font-semibold">
                      <History className="w-3.5 h-3.5" />
                      <span>Audit Trail: Append-Only</span>
                    </div>
                    {storeConfigForm.maintenanceMode ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold animate-pulse">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>Chế Độ Bảo Trì: ĐANG BẬT</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cửa Hàng: Hoạt Động</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-tab Navigation */}
                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSystemActiveSubTab('rbac')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      systemActiveSubTab === 'rbac'
                        ? 'bg-[#0071e3] text-white shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Phân Quyền RBAC &amp; Nhân Viên</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSystemActiveSubTab('audit')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      systemActiveSubTab === 'audit'
                        ? 'bg-[#0071e3] text-white shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Nhật Ký Hoạt Động (Audit Trail)</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-current">
                      {auditList.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSystemActiveSubTab('cms')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      systemActiveSubTab === 'cms'
                        ? 'bg-[#0071e3] text-white shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Quản Lý Nội Dung CMS &amp; Media</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSystemActiveSubTab('config')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      systemActiveSubTab === 'config'
                        ? 'bg-[#0071e3] text-white shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Cấu Hình Cửa Hàng &amp; Thuế</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSystemActiveSubTab('integrations')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      systemActiveSubTab === 'integrations'
                        ? 'bg-[#0071e3] text-white shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>API, Webhook &amp; Cảnh Báo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSystemActiveSubTab('maintenance')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      systemActiveSubTab === 'maintenance'
                        ? 'bg-[#0071e3] text-white shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Sao Lưu CSDL &amp; Bảo Trì</span>
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SUB-TAB 1: PHÂN QUYỀN RBAC & NHÂN VIÊN QUẢN TRỊ          */}
              {/* ========================================================= */}
              {systemActiveSubTab === 'rbac' && (
                <div className="space-y-6">
                  {/* Security Governance Guidelines Card */}
                  <div className="p-5 bg-gradient-to-r from-blue-50/60 via-indigo-50/30 to-purple-50/40 border border-blue-200/80 rounded-3xl space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                      <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
                      <span>Nguyên Tắc Đặc Quyền Tối Thiểu (Principle of Least Privilege) &amp; An Ninh Vận Hành</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-white/80 rounded-2xl border border-blue-100 space-y-1">
                        <div className="font-bold text-[#1d1d1f]">1. Đặc Quyền Tối Thiểu</div>
                        <p className="text-gray-600 text-[11px]">
                          Chỉ cấp đúng các hành động cần thiết. CSKH không xem giá vốn (COGS), Kho không xem doanh thu, Kế toán không sửa giá bán.
                        </p>
                      </div>
                      <div className="p-3 bg-white/80 rounded-2xl border border-blue-100 space-y-1">
                        <div className="font-bold text-[#1d1d1f]">2. Bảo Mật Đăng Nhập 2FA</div>
                        <p className="text-gray-600 text-[11px]">
                          Bắt buộc xác thực 2 bước (TOTP/Google Authenticator), tự động ngắt phiên sau 30 phút không hoạt động, giới hạn IP mạng nội bộ.
                        </p>
                      </div>
                      <div className="p-3 bg-white/80 rounded-2xl border border-blue-100 space-y-1">
                        <div className="font-bold text-[#1d1d1f]">3. Cô Lập Marketplace Multi-Tenant</div>
                        <p className="text-gray-600 text-[11px]">
                          Dữ liệu người bán phân tách tuyệt đối qua Row-Level Security. Người bán A không bao giờ thấy đơn hay khách của Người bán B.
                        </p>
                      </div>
                      <div className="p-3 bg-white/80 rounded-2xl border border-blue-100 space-y-1">
                        <div className="font-bold text-[#1d1d1f]">4. Khóa &amp; Truy Vết Tức Thì</div>
                        <p className="text-gray-600 text-[11px]">
                          Tự động phong tỏa tài khoản sau 5 lần đăng nhập thất bại. Toàn bộ thay đổi phân quyền được lưu vào Audit Trail bất biến.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 6 Role Cards Overview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#0071e3]" />
                        <span>6 Vai Trò Chuẩn Doanh Nghiệp (Enterprise Standard Roles)</span>
                      </h3>
                      <span className="text-xs text-gray-500 font-medium">
                        Cấu hình phân quyền động theo vai trò, không cấp riêng lẻ từng cá nhân
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(roles || []).map((role: any) => {
                        const count = role.usersCount ?? role.userCount ?? 3;
                        const roleCode = role.code ?? role.id ?? 'ROLE';
                        const badgeColor = role.colorBadge || (
                          role.id === 'super_admin' ? 'badge-purple' :
                          role.id === 'store_manager' ? 'badge-blue' :
                          role.id === 'accountant' ? 'badge-emerald' :
                          role.id === 'warehouse_staff' ? 'badge-amber' :
                          role.id === 'support_agent' ? 'badge-pink' : 'badge-green'
                        );
                        return (
                          <div
                            key={role.id || role.code}
                            className="p-5 bg-white border border-gray-200/80 rounded-3xl hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                                    badgeColor === 'badge-purple'
                                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                      : badgeColor === 'badge-blue'
                                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                      : badgeColor === 'badge-emerald'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : badgeColor === 'badge-amber'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : badgeColor === 'badge-pink'
                                      ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                      : 'bg-green-50 text-green-700 border border-green-200'
                                  }`}
                                >
                                  {role.name}
                                </span>
                                <span className="text-xs text-gray-500 font-medium font-mono">
                                  {count} nhân sự
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">{role.description}</p>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                              <span>Mã định danh: <span className="font-mono text-gray-700 font-bold">{roleCode}</span></span>
                              <span className="font-medium text-[#0071e3]">Đặc quyền tối thiểu ✓</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Granular Permission Matrix Table */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-[#0071e3]" />
                          <span>Ma Trận Phân Quyền Chi Tiết (Granular Permissions Matrix)</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Phân chia quyền theo 9 phân hệ cốt lõi: Xem (Read), Tạo (Create), Sửa (Update), Xóa (Delete), Xuất (Export), Duyệt (Approve).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold">
                          ● Đầy Đủ (Full)
                        </span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold">
                          ◐ Có Điều Kiện
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold">
                          ✕ Bị Chặn
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50/75 text-gray-600 font-semibold border-y border-gray-200">
                            <th className="py-3 px-4 font-bold text-[#1d1d1f] min-w-[200px]">Phân Hệ / Tài Nguyên</th>
                            <th className="py-3 px-3 text-center min-w-[110px]">Super Admin</th>
                            <th className="py-3 px-3 text-center min-w-[110px]">Quản Lý</th>
                            <th className="py-3 px-3 text-center min-w-[110px]">Kế Toán</th>
                            <th className="py-3 px-3 text-center min-w-[110px]">Thủ Kho</th>
                            <th className="py-3 px-3 text-center min-w-[110px]">CSKH</th>
                            <th className="py-3 px-3 text-center min-w-[110px]">Marketing</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-[11px]">
                          {(matrix || []).map((row: any, idx: number) => {
                            const superAdminVal = String(row?.superAdmin || 'Toàn Quyền');
                            const managerVal = String(row?.manager || row?.storeManager || 'Xem + Duyệt');
                            const accountantVal = String(row?.accountant || 'Chỉ Xem');
                            const warehouseVal = String(row?.warehouse || 'Không Truy Cập');
                            const supportVal = String(row?.support || row?.cskh || 'Không Truy Cập');
                            const marketingVal = String(row?.marketing || 'Không Truy Cập');
                            return (
                              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-3 px-4 font-bold text-[#1d1d1f]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span>{row?.resource}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-100">
                                    {superAdminVal}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg border border-blue-100">
                                    {managerVal}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className={`inline-block px-2 py-1 font-semibold rounded-lg ${
                                    accountantVal.includes('Bị Chặn') || accountantVal.includes('Không')
                                      ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  }`}>
                                    {accountantVal}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className={`inline-block px-2 py-1 font-semibold rounded-lg ${
                                    warehouseVal.includes('Bị Chặn') || warehouseVal.includes('Không')
                                      ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                                  }`}>
                                    {warehouseVal}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className={`inline-block px-2 py-1 font-semibold rounded-lg ${
                                    supportVal.includes('Bị Chặn') || supportVal.includes('Không')
                                      ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                      : 'bg-pink-50 text-pink-700 border border-pink-100'
                                  }`}>
                                    {supportVal}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className={`inline-block px-2 py-1 font-semibold rounded-lg ${
                                    marketingVal.includes('Bị Chặn') || marketingVal.includes('Không')
                                      ? 'bg-gray-100 text-gray-500'
                                      : 'bg-green-50 text-green-700 border border-green-100'
                                  }`}>
                                    {marketingVal}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Admin Accounts Table */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-[#0071e3]" />
                          <span>Danh Sách Tài Khoản Nhân Viên Quản Trị ({adminUsers.length} tài khoản)</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Theo dõi đăng nhập an toàn, trạng thái 2FA và đặc quyền tài khoản của từng nhân sự
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Phiên đăng nhập: <strong>30 phút</strong></span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50/75 text-gray-600 font-semibold border-y border-gray-200">
                            <th className="py-3 px-4">Nhân Sự</th>
                            <th className="py-3 px-3">Vai Trò RBAC</th>
                            <th className="py-3 px-3 text-center">Bảo Mật 2FA</th>
                            <th className="py-3 px-3 text-center">Giới Hạn IP</th>
                            <th className="py-3 px-3">Đăng Nhập Gần Nhất</th>
                            <th className="py-3 px-3 font-mono">IP Kết Nối</th>
                            <th className="py-3 px-3 text-center">Trạng Thái</th>
                            <th className="py-3 px-4 text-right">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(adminUsers || []).map((user: any) => {
                            const is2fa = user.enforce2fa ?? user.twoFactorEnabled ?? false;
                            const lastLogin = user.lastLoginAt || user.lastActive || 'Vừa xong';
                            const clientIp = user.lastLoginIp || user.ip || '118.70.182.4';
                            return (
                              <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0071e3] font-bold flex items-center justify-center text-xs">
                                      {(user.name || 'A').charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-bold text-[#1d1d1f]">{user.name}</div>
                                      <div className="text-[11px] text-gray-500 font-mono">{user.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold">
                                    {user.role}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  {is2fa ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-bold">
                                      <Check className="w-3 h-3" /> Đã Bật TOTP
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[11px] font-bold">
                                      Chưa Bật
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  {user.ipRestricted ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-semibold">
                                      <Lock className="w-3 h-3" /> Giới Hạn IP
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-[11px]">Không</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-gray-600 text-[11px]">
                                  {lastLogin}
                                </td>
                                <td className="py-3 px-3 font-mono text-[11px] text-gray-700">
                                  {clientIp}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      user.status === 'ACTIVE'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}
                                  >
                                    {user.status === 'ACTIVE' ? 'Đang Hoạt Động' : 'Tạm Khóa'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditUserModal(user)}
                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Đổi Quyền / Khóa</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SUB-TAB 2: NHẬT KÝ HOẠT ĐỘNG (IMMUTABLE AUDIT TRAIL)       */}
              {/* ========================================================= */}
              {systemActiveSubTab === 'audit' && (
                <div className="space-y-6">
                  {/* Append-Only Notice Banner */}
                  <div className="p-5 bg-gradient-to-r from-purple-50/60 via-indigo-50/40 to-blue-50/40 border border-purple-200/80 rounded-3xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-purple-900">
                        <History className="w-4 h-4 text-purple-700" />
                        <span>Cơ Chế Ghi Nhật Ký Bất Biến (Immutable Append-Only Audit Trail)</span>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-xl text-[10px] font-bold">
                        Bảo Toàn Bằng Khóa SHA-256
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Toàn bộ thao tác quản trị được ghi lại tự động với định danh: <strong>Ai, Làm gì, Trên đối tượng nào, Lúc nào, Từ IP nào</strong> và <strong>Giá trị trước/sau khi sửa</strong>. Nhật ký chỉ ghi thêm (append-only), chống sửa xóa tuyệt đối nhằm đáp ứng quy chuẩn kiểm toán doanh nghiệp và bảo mật thông tin khách hàng.
                    </p>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="p-4 bg-white border border-gray-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
                    <div className="flex flex-1 items-center gap-2">
                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={auditSearch}
                          onChange={(e) => setAuditSearch(e.target.value)}
                          placeholder="Tìm theo nhân viên, email, hành động, ID đối tượng, IP..."
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition-colors"
                        />
                      </div>

                      <select
                        value={auditSeverity}
                        onChange={(e) => setAuditSeverity(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] font-semibold"
                      >
                        <option value="ALL">Mức độ: Tất cả</option>
                        <option value="CRITICAL">Nghiêm trọng (CRITICAL)</option>
                        <option value="WARNING">Cảnh báo (WARNING)</option>
                        <option value="INFO">Thông tin (INFO)</option>
                      </select>

                      <select
                        value={auditResourceFilter}
                        onChange={(e) => setAuditResourceFilter(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] font-semibold"
                      >
                        <option value="ALL">Phân hệ: Tất cả</option>
                        <option value="ORDER_MGMT">Đơn hàng (ORDER_MGMT)</option>
                        <option value="RBAC_SECURITY">Bảo mật RBAC (RBAC_SECURITY)</option>
                        <option value="CRM_CUSTOMERS">Khách hàng CRM (CRM_CUSTOMERS)</option>
                        <option value="FINANCE_SETTLEMENT">Tài chính (FINANCE_SETTLEMENT)</option>
                        <option value="SYSTEM_CONFIG">Cấu hình (SYSTEM_CONFIG)</option>
                        <option value="DISASTER_RECOVERY">Sao lưu CSDL (DISASTER_RECOVERY)</option>
                        <option value="SYSTEM_AVAILABILITY">Bảo trì (SYSTEM_AVAILABILITY)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-xs">
                      <span className="text-gray-500">
                        Hiển thị <strong>{filteredAuditLogs.length}</strong> / {auditList.length} bản ghi
                      </span>
                    </div>
                  </div>

                  {/* Audit Logs Table */}
                  <div className="bg-white border border-gray-200/80 rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50/75 text-gray-600 font-semibold border-b border-gray-200">
                            <th className="py-3 px-4 font-mono">Mã Log &amp; Thời Gian</th>
                            <th className="py-3 px-3">Người Thực Hiện</th>
                            <th className="py-3 px-3">Hành Động &amp; Mô Tả</th>
                            <th className="py-3 px-3">Đối Tượng Tác Động</th>
                            <th className="py-3 px-3 font-mono">Client IP</th>
                            <th className="py-3 px-3 text-center">Mức Độ</th>
                            <th className="py-3 px-4 text-right">Chi Tiết Diff</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredAuditLogs.map((log: any) => (
                            <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-mono font-bold text-gray-800 text-[11px]">{log.id}</div>
                                <div className="text-[10px] text-gray-400">
                                  {new Date(log.timestamp).toLocaleString('vi-VN')}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-bold text-[#1d1d1f]">{log.actorName}</div>
                                <div className="text-[10px] text-gray-500 font-mono">{log.actorEmail}</div>
                                <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 bg-gray-100 text-gray-700 rounded font-semibold">
                                  {log.role}
                                </span>
                              </td>
                              <td className="py-3 px-3 max-w-[280px]">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold font-mono text-[11px] text-[#0071e3]">
                                    {log.action}
                                  </span>
                                  {log.isSensitive && (
                                    <span className="px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[9px] font-extrabold animate-pulse">
                                      NHẠY CẢM
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">
                                  {log.description}
                                </p>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-mono text-[11px] font-bold text-gray-700">{log.entityId}</div>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{log.resource}</span>
                              </td>
                              <td className="py-3 px-3 font-mono text-[11px] text-gray-600">
                                {log.ip}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    log.severity === 'CRITICAL'
                                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                      : log.severity === 'WARNING'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}
                                >
                                  {log.severity}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedAuditDiff(log);
                                    setIsAuditDiffModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Xem Diff</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SUB-TAB 3: QUẢN LÝ NỘI DUNG CMS & MEDIA                   */}
              {/* ========================================================= */}
              {systemActiveSubTab === 'cms' && (
                <div className="space-y-6">
                  {/* Blog & News Articles Management */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0071e3]" />
                          <span>Bài Viết Blog / Tin Tức Công Nghệ ({cmsPosts.length} bài)</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Biên tập rich text, tối ưu thẻ SEO tiêu đề/mô tả, phân loại chuyên mục và hẹn giờ phát hành
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenCmsModal()}
                        className="px-4 py-2 bg-[#0071e3] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Soạn Bài Viết Mới</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50/75 text-gray-600 font-semibold border-y border-gray-200">
                            <th className="py-3 px-4">Tiêu Đề Bài Viết</th>
                            <th className="py-3 px-3">Chuyên Mục</th>
                            <th className="py-3 px-3">Tác Giả</th>
                            <th className="py-3 px-3 text-center">Lượt Xem</th>
                            <th className="py-3 px-3">Ngày Đăng</th>
                            <th className="py-3 px-3 text-center">Trạng Thái</th>
                            <th className="py-3 px-4 text-right">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {cmsPosts.map((post: any) => (
                            <tr key={post.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-bold text-[#1d1d1f]">{post.title}</div>
                                <div className="text-[11px] text-gray-400 font-mono">/{post.slug}</div>
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-semibold">
                                  {post.category}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-gray-700 text-xs font-medium">
                                {post.author}
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-gray-800">
                                {post.views?.toLocaleString('vi-VN')}
                              </td>
                              <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                                {post.publishedAt}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    post.status === 'PUBLISHED'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                                >
                                  {post.status === 'PUBLISHED' ? 'Đã Xuất Bản' : 'Bản Nháp'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleOpenCmsModal(post)}
                                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Chỉnh Sửa</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Static Legal Pages Management */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                    <div className="pb-3 border-b border-gray-100">
                      <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-[#0071e3]" />
                        <span>Trang Tĩnh Pháp Lý &amp; Chính Sách Bắt Buộc</span>
                      </h3>
                      <p className="text-xs text-gray-500">
                        Cấu hình các trang Điều khoản dịch vụ, Chính sách đổi trả 30 ngày, Bảo hành Apple VN/A, và Bảo mật
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {staticPages.map((page: any) => (
                        <div
                          key={page.id}
                          className="p-4 bg-gray-50/50 hover:bg-gray-50 border border-gray-200/80 rounded-2xl transition-all space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#1d1d1f]">{page.title}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold">
                                {page.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#0071e3] font-mono">
                              https://techzone.vn{page.slug}
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                            <span>Sửa cuối: {page.lastUpdated}</span>
                            <button
                              type="button"
                              onClick={() => showToast(`Mở trình soạn thảo cho trang: ${page.title}`)}
                              className="text-[#0071e3] font-bold hover:underline"
                            >
                              Sửa nội dung
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQ & Help Center */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                    <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-[#0071e3]" />
                          <span>Trung Tâm Trợ Giúp &amp; Câu Hỏi Thường Gặp (FAQ)</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Bộ câu hỏi giải đáp tự động cho khách hàng về giao hàng 2H, bảo hành chính hãng và hoàn tiền
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold">
                        {faqList.length} câu hỏi
                      </span>
                    </div>

                    <div className="space-y-3">
                      {faqList.map((faq: any, idx: number) => (
                        <div key={faq.id || idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#1d1d1f] flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">Q</span>
                              <span>{faq.question}</span>
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-gray-200/80 text-gray-700 rounded font-semibold">
                              {faq.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 pl-7 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Media Asset Library */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                    <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#0071e3]" />
                          <span>Thư Viện Media &amp; Tài Nguyên CDN ({mediaList.length} tệp)</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Quản lý hình ảnh banner flash sale, icon, logo đối tác với CDN phân phối tốc độ cao
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast('Đang mở hộp thoại tải ảnh lên CDN Cloud Storage...')}
                        className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải Lên Media Mới</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {mediaList.map((item: any, idx: number) => (
                        <div
                          key={item.id || idx}
                          className="p-3 bg-gray-50/60 border border-gray-200/80 rounded-2xl space-y-2 hover:shadow-sm transition-all"
                        >
                          <div className="h-28 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden relative">
                            <span className="text-gray-400 font-bold text-xs uppercase">{item.format}</span>
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-bold text-xs text-[#1d1d1f] truncate">{item.filename}</div>
                            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                              <span>{item.size}</span>
                              <span>{item.dimensions}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(item.url);
                              showToast(`Đã sao chép link CDN: ${item.filename}`);
                            }}
                            className="w-full py-1 bg-white hover:bg-blue-50 text-[#0071e3] border border-gray-200 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Sao chép Link CDN</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SUB-TAB 4: CẤU HÌNH CỬA HÀNG & THANH TOÁN / THUẾ / TIỀN TỆ */}
              {/* ========================================================= */}
              {systemActiveSubTab === 'config' && (
                <div className="space-y-6">
                  {/* Store & Legal Entity Form */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#0071e3]" />
                          <span>Thông Tin Cửa Hàng &amp; Pháp Lý Doanh Nghiệp</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Thông tin pháp lý hiển thị trên chân trang (footer), hóa đơn điện tử VAT và hợp đồng thương mại điện tử
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveStoreConfig}
                        className="px-4 py-2 bg-[#0071e3] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Lưu Cấu Hình Doanh Nghiệp</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Tên Cửa Hàng Thương Mại</label>
                        <input
                          type="text"
                          value={storeConfigForm.storeName}
                          onChange={(e) => setStoreConfigForm({ ...storeConfigForm, storeName: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Tên Pháp Nhân Doanh Nghiệp</label>
                        <input
                          type="text"
                          value={storeConfigForm.legalEntity}
                          onChange={(e) => setStoreConfigForm({ ...storeConfigForm, legalEntity: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Mã Số Thuế (MST)</label>
                        <input
                          type="text"
                          value={storeConfigForm.taxCode}
                          onChange={(e) => setStoreConfigForm({ ...storeConfigForm, taxCode: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Người Đại Diện Pháp Luật</label>
                        <input
                          type="text"
                          value={storeConfigForm.legalRepresentative}
                          onChange={(e) => setStoreConfigForm({ ...storeConfigForm, legalRepresentative: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Tổng Đài CSKH &amp; Khiếu Nại</label>
                        <input
                          type="text"
                          value={storeConfigForm.hotline}
                          onChange={(e) => setStoreConfigForm({ ...storeConfigForm, hotline: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-700">Email Tiếp Nhận Hỗ Trợ</label>
                        <input
                          type="email"
                          value={storeConfigForm.supportEmail}
                          onChange={(e) => setStoreConfigForm({ ...storeConfigForm, supportEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] font-mono"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="font-bold text-gray-700">Địa Chỉ Trụ Sở Doanh Nghiệp</label>
                        <input
                          type="text"
                          value={storeConfigForm.headquarters}
                          onChange={(e) => setStoreConfigForm({ ...storeConfigForm, headquarters: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Gateways & VAT Tax Configuration */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Payment Gateways */}
                    <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                      <div className="pb-3 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#0071e3]" />
                          <span>Cổng Thanh Toán Trực Tuyến Đang Hoạt Động</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Hỗ trợ đa phương thức thanh toán trong nước &amp; quốc tế
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                              VN
                            </div>
                            <div>
                              <div className="font-bold text-xs text-[#1d1d1f]">VNPay QR Cổng Quốc Gia</div>
                              <div className="text-[10px] text-gray-500">Phí giao dịch: 1.1% + 1.500₫ / đơn</div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                            Đang Bật
                          </span>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                              QR
                            </div>
                            <div>
                              <div className="font-bold text-xs text-[#1d1d1f]">VietQR Napas247 Tự Động</div>
                              <div className="text-[10px] text-gray-500">Đối soát webhook thời gian thực 0.5s</div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                            Đang Bật
                          </span>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                              STR
                            </div>
                            <div>
                              <div className="font-bold text-xs text-[#1d1d1f]">Stripe Global Payments</div>
                              <div className="text-[10px] text-gray-500">Thẻ Visa, Mastercard, Apple Pay quốc tế</div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                            Đang Bật
                          </span>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
                              0%
                            </div>
                            <div>
                              <div className="font-bold text-xs text-[#1d1d1f]">Alepay Trả Góp 0% Lãi Suất</div>
                              <div className="text-[10px] text-gray-500">Liên kết 25+ ngân hàng thương mại tại VN</div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                            Đang Bật
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* VAT Tax & Multi-Currency */}
                    <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                      <div className="pb-3 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Percent className="w-4 h-4 text-[#0071e3]" />
                          <span>Thuế VAT &amp; Đa Tiền Tệ (Currencies)</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Chính sách thuế giá trị gia tăng và tỷ giá quy đổi ngoại tệ
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-[#1d1d1f]">
                            <span>Thuế VAT Chuẩn Hóa</span>
                            <span className="text-emerald-700">10% &amp; 8%</span>
                          </div>
                          <p className="text-[11px] text-gray-600">
                            Áp dụng 10% cho thiết bị viễn thông/máy tính và 8% cho nhóm phụ kiện được hỗ trợ nghị định.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-bold text-gray-700">Danh Mục Tiền Tệ Hỗ Trợ:</div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {currencies.map((curr: any) => (
                              <div key={curr.code} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-center">
                                <div className="font-mono font-bold text-gray-900">{curr.code} ({curr.symbol})</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">
                                  Tỷ giá: {curr.exchangeRate.toLocaleString('vi-VN')}₫
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <div className="text-xs font-bold text-gray-700">Đa Ngôn Ngữ (i18n):</div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {languages.map((lang: any) => (
                              <div key={lang.code} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-center">
                                <div className="font-bold text-gray-900">{lang.name}</div>
                                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                                  Đầy đủ: {lang.completeness}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SUB-TAB 5: TÍCH HỢP API, WEBHOOKS & CẢNH BÁO NỘI BỘ        */}
              {/* ========================================================= */}
              {systemActiveSubTab === 'integrations' && (
                <div className="space-y-6">
                  {/* Developer API Keys */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Key className="w-4 h-4 text-[#0071e3]" />
                          <span>Khóa API Cho Lập Trình Viên &amp; Hệ Thống ERP ({apiKeys.length} khóa)</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Kết nối an toàn qua Bearer Token, kiểm soát Rate Limit và phạm vi quyền truy cập
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast('Đã sinh cặp API Key mới với quyền READ_ONLY!')}
                        className="px-3.5 py-1.5 bg-[#0071e3] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tạo API Key Mới</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {apiKeys.map((key: any) => (
                        <div
                          key={key.id}
                          className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#1d1d1f]">{key.name}</span>
                              <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                                {key.status}
                              </span>
                            </div>
                            <div className="font-mono text-xs text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-200 inline-block">
                              {key.keyPrefix}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              Phạm vi: <strong className="text-gray-700">{key.scope}</strong> • Lần gọi cuối: {key.lastUsed}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(key.keyPrefix);
                                showToast(`Đã sao chép tiền tố API Key: ${key.name}`);
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Sao Chép</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => showToast(`Đã thu hồi API Key: ${key.name}`)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Thu Hồi</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Webhook Endpoints */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                    <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Globe className="w-4 h-4 text-[#0071e3]" />
                          <span>Webhook Endpoints Đồng Bộ Sự Kiện</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Bắn thông báo thời gian thực khi có thay đổi đơn hàng, giao hàng hoặc tồn kho
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">
                        Đang Kết Nối 100%
                      </span>
                    </div>

                    <div className="space-y-3">
                      {webhooks.map((wh: any) => (
                        <div
                          key={wh.id}
                          className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#1d1d1f]">{wh.id}</span>
                              <span className="px-2 py-0.2 bg-blue-50 text-[#0071e3] border border-blue-200 rounded text-[10px] font-bold">
                                {wh.event}
                              </span>
                            </div>
                            <div className="font-mono text-xs text-[#0071e3] break-all">
                              {wh.url}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              Tỷ lệ lỗi: <strong className="text-emerald-600">{wh.failureRate}</strong> • Kích hoạt: {wh.lastTriggered}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => showToast(`Gửi sự kiện kiểm tra (Ping Webhook): ${wh.id}`)}
                            className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 shrink-0"
                          >
                            <Send className="w-3 h-3" />
                            <span>Ping Thử Nghiệm</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal Incident & Alert Channels */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                    <div className="pb-3 border-b border-gray-100">
                      <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#0071e3]" />
                        <span>Kênh Thông Báo Cảnh Báo Nội Bộ (Incident &amp; Alert Routing)</span>
                      </h3>
                      <p className="text-xs text-gray-500">
                        Thông báo khẩn cấp khi có đơn hàng lớn, phát hiện bất thường an ninh, hết hàng flash sale hoặc giao dịch thất bại
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between font-bold text-[#1d1d1f]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span>Slack Webhook Kênh #techzone-alerts-prod</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">KẾT NỐI ✓</span>
                        </div>
                        <p className="text-gray-500 text-[11px]">
                          URL: <span className="font-mono text-gray-700">{alertChannels.slackWebhook || 'https://hooks.slack.com/services/...'}</span>
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between font-bold text-[#1d1d1f]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            <span>Zalo OA Doanh Nghiệp (Gửi tin VIP)</span>
                          </span>
                          <span className="text-[10px] text-blue-600 font-bold">ĐANG BẬT ✓</span>
                        </div>
                        <p className="text-gray-500 text-[11px]">
                          Tự động gửi cảnh báo khẩn cấp đến điện thoại của Ban Quản Trị qua Official Account.
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between font-bold text-[#1d1d1f]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                            <span>Telegram Incident On-Call Bot</span>
                          </span>
                          <span className="text-[10px] text-purple-600 font-bold">ĐANG BẬT ✓</span>
                        </div>
                        <p className="text-gray-500 text-[11px]">
                          Trực thảm họa 24/7 cảnh báo spike lưu lượng flash sale và lỗi cổng thanh toán.
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between font-bold text-[#1d1d1f]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span>Email Trực Vận Hành (On-Call)</span>
                          </span>
                          <span className="text-[10px] text-amber-700 font-bold font-mono">2 Người nhận</span>
                        </div>
                        <p className="text-gray-500 text-[11px]">
                          Danh sách: <span className="font-mono text-gray-700">{alertChannels.emailRecipients || 'alerts@techzone.vn'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SUB-TAB 6: SAO LƯU CSDL & CHẾ ĐỘ BẢO TRÌ                  */}
              {/* ========================================================= */}
              {systemActiveSubTab === 'maintenance' && (
                <div className="space-y-6">
                  {/* Maintenance Mode Guard Banner */}
                  <div className={`p-6 border rounded-3xl shadow-sm transition-all ${
                    storeConfigForm.maintenanceMode
                      ? 'bg-rose-50/70 border-rose-300'
                      : 'bg-white border-gray-200/80'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <AlertOctagon className={`w-5 h-5 ${
                            storeConfigForm.maintenanceMode ? 'text-rose-600' : 'text-gray-400'
                          }`} />
                          <h3 className="text-base font-bold text-[#1d1d1f]">
                            Chế Độ Bảo Trì Hệ Thống (Store Maintenance Mode)
                          </h3>
                        </div>
                        <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
                          Khi kích hoạt chế độ này, toàn bộ khách mua hàng truy cập storefront sẽ được chuyển hướng tới trang thông báo bảo trì. Chỉ các tài khoản Super Admin đăng nhập mới có thể thao tác.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleMaintenance}
                        disabled={isTogglingMaintenance}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 ${
                          storeConfigForm.maintenanceMode
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-rose-600 hover:bg-rose-700 text-white'
                        }`}
                      >
                        {isTogglingMaintenance ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : storeConfigForm.maintenanceMode ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        <span>
                          {storeConfigForm.maintenanceMode
                            ? 'TẮT BẢO TRÌ & MỞ CỬA HÀNG'
                            : 'KÍCH HOẠT BẢO TRÌ NGAY'}
                        </span>
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200/60 space-y-1 text-xs">
                      <label className="font-bold text-gray-700">Thông Điệp Hiển Thị Cho Khách Hàng:</label>
                      <input
                        type="text"
                        value={storeConfigForm.maintenanceMessage}
                        onChange={(e) => setStoreConfigForm({ ...storeConfigForm, maintenanceMessage: e.target.value })}
                        placeholder="Nhập thông báo gửi tới khách hàng..."
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                      />
                    </div>
                  </div>

                  {/* Disaster Recovery & Database Backup Snapshots */}
                  <div className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                          <Database className="w-4 h-4 text-[#0071e3]" />
                          <span>Sao Lưu &amp; Phục Hồi Thảm Họa (Disaster Recovery &amp; DB Snapshots)</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Sao lưu tự động vào 03:00 AM hàng ngày lưu trữ tại Google Cloud Storage, mã hóa AES-256
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleTriggerBackup}
                        disabled={isBackingUpDb}
                        className="px-4 py-2 bg-[#0071e3] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        {isBackingUpDb ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>Tạo Bản Sao Lưu Tức Thì</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50/75 text-gray-600 font-semibold border-y border-gray-200">
                            <th className="py-3 px-4 font-mono">Tên Bản Sao Lưu Snapshot</th>
                            <th className="py-3 px-3">Dung Lượng</th>
                            <th className="py-3 px-3">Loại Sao Lưu</th>
                            <th className="py-3 px-3 text-center">Số Bản Ghi</th>
                            <th className="py-3 px-3 text-center">Tính Toàn Vẹn</th>
                            <th className="py-3 px-3">Thời Điểm Tạo</th>
                            <th className="py-3 px-4 text-right">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {backups.map((bak: any) => (
                            <tr key={bak.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-mono font-bold text-gray-800 text-xs">{bak.filename}</div>
                                <div className="text-[10px] text-gray-400 font-mono">ID: {bak.id}</div>
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-gray-700">
                                {bak.size}
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[11px] font-semibold">
                                  {bak.type}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-gray-800">
                                {bak.recordsCount?.toLocaleString('vi-VN')}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                                  <Check className="w-3 h-3" /> Đã Xác Minh
                                </span>
                              </td>
                              <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                                {new Date(bak.createdAt).toLocaleString('vi-VN')}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => showToast(`Bắt đầu tải xuống bản sao lưu: ${bak.filename}`)}
                                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Tải Về</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Bạn có chắc chắn muốn phục hồi CSDL từ bản snapshot ${bak.filename}? Toàn bộ dữ liệu hiện tại sẽ được đồng bộ về thời điểm này.`)) {
                                        showToast(`Đã kích hoạt quy trình phục hồi CSDL từ snapshot: ${bak.filename}`);
                                      }
                                    }}
                                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Phục Hồi</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
};
