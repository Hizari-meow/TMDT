'use client';

import React from 'react';
import {
  Zap,
  X,
  RefreshCw,
  Play,
  Boxes,
  CheckCircle,
  Package,
  Warehouse,
  ShoppingCart,
  Truck,
  CreditCard,
  Users,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

import { useAdminContext } from '@/components/admin/AdminContext';

export interface EnterpriseLifecycleModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  carrier?: string;
  setCarrier?: (carrier: string) => void;
  coupon?: string;
  setCoupon?: (coupon: string) => void;
  isRunning?: boolean;
  result?: any;
  onExecute?: () => Promise<void>;
}

export const EnterpriseLifecycleModal: React.FC<EnterpriseLifecycleModalProps> = (props) => {
  const ctx = useAdminContext();
  const isOpen = props.isOpen !== undefined ? props.isOpen : ctx.isLifecycleModalOpen;
  const onClose = props.onClose || (() => ctx.setIsLifecycleModalOpen(false));
  const carrier = props.carrier !== undefined ? props.carrier : ctx.lifecycleCarrier;
  const setCarrier = props.setCarrier || ctx.setLifecycleCarrier;
  const coupon = props.coupon !== undefined ? props.coupon : ctx.lifecycleCoupon;
  const setCoupon = props.setCoupon || ctx.setLifecycleCoupon;
  const isRunning = props.isRunning !== undefined ? props.isRunning : ctx.lifecycleRunning;
  const result = props.result !== undefined ? props.result : ctx.lifecycleResult;
  const onExecute = props.onExecute || ctx.handleExecuteLifecycle;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-400/30">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Mô Phỏng Đơn Hàng Qua 8 Phân Hệ Liên Kết Doanh Nghiệp</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% PostgreSQL Thật
                </span>
              </h3>
              <p className="text-xs text-blue-200/80">
                Sản phẩm ➔ Kho hàng ➔ Đơn hàng ➔ Vận chuyển ➔ COD &amp; VAT ➔ CRM ➔ Báo cáo ➔ Audit Log
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Controls / Trigger */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="font-bold text-gray-700">Kịch bản (Mục 7):</label>
              <select
                value={ctx.lifecycleScenario || 'E1'}
                onChange={(e) => ctx.setLifecycleScenario(e.target.value)}
                disabled={isRunning}
                className="px-3 py-1.5 bg-white border border-blue-400 rounded-xl font-bold text-blue-900 focus:outline-none focus:border-[#0071e3]"
              >
                <option value="E1">E1: Đơn COD thành công (Toàn trình 8 phân hệ)</option>
                <option value="E3">E3: Quá 15p thanh toán online &amp; Nhả hàng kho</option>
                <option value="E5">E5: Hủy đơn khi đang đóng gói &amp; Nhập lại kho</option>
                <option value="E6">E6: Giao thất bại 2 lần &amp; Hoàn kho, bom hàng</option>
                <option value="E7">E7: Đổi trả một phần &amp; Hóa đơn điều chỉnh NĐ 123</option>
                <option value="E8">E8: Hai người mua món cuối cùng (Concurrency)</option>
                <option value="E10">E10: Flash sale bộ đếm Redis nguyên tử</option>
                <option value="E11">E11: Khách thăng hạng Vàng &amp; Đặc quyền Freeship</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold text-gray-700">Đơn vị vận chuyển:</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                disabled={isRunning}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:border-[#0071e3]"
              >
                <option value="GHN">Giao Hàng Nhanh (GHN)</option>
                <option value="GHTK">Giao Hàng Tiết Kiệm (GHTK)</option>
                <option value="VNPOST">Bưu Điện Việt Nam (VNPost)</option>
                <option value="VIETTEL_POST">Viettel Post</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold text-gray-700">Voucher Khuyến Mãi:</label>
              <select
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                disabled={isRunning}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:border-[#0071e3]"
              >
                <option value="TECHZONE_VIP_2M">TECHZONE_VIP_2M (Giảm 2,000,000₫)</option>
                <option value="FLASH100K">FLASH100K (Giảm 100,000₫)</option>
                <option value="FREESHIP">FREESHIP (Miễn phí ship)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={onExecute}
            disabled={isRunning}
            className="px-5 py-2.5 bg-[#0071e3] hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold rounded-2xl transition-all shadow-md flex items-center gap-2 text-xs cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Đang Thực Thi Giao Dịch Trong CSDL...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Kích Hoạt Quy Trình Trong CSDL</span>
              </>
            )}
          </button>
        </div>

        {/* Modal Body / Lifecycle Visualizer */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!result && !isRunning && (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 text-[#0071e3] flex items-center justify-center">
                <Boxes className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900">Sẵn sàng thực thi chu trình liên kết doanh nghiệp</h4>
                <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
                  Nhấn nút <strong>&quot;Kích Hoạt Quy Trình Trong CSDL&quot;</strong> để khởi tạo một đơn hàng thực tế, tự động giữ hàng kho, xuất kho, phát hành vận đơn, đối soát COD, xuất hóa đơn VAT, tích điểm CRM và ghi vết Audit Log vào PostgreSQL.
                </p>
              </div>
            </div>
          )}

          {isRunning && (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full border-4 border-blue-200 border-t-[#0071e3] animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-800">Đang thực thi các Transaction ACID trên PostgreSQL...</p>
                <p className="text-xs text-gray-500">Khóa tồn kho ➔ Trừ hàng ➔ Tạo vận đơn ➔ Đối soát COD ➔ Nâng hạng CRM ➔ Ghi Audit Log</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950">Giao dịch đã hoàn tất và lưu trữ vĩnh viễn trong CSDL</div>
                    <div className="text-[11px] text-emerald-700">Tất cả 8 phân hệ đã đồng bộ dữ liệu theo mô hình ACID chuẩn doanh nghiệp</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-200/60 text-emerald-900 font-mono">
                  ORDER ID: {result.order?.id?.slice(0, 12)}...
                </span>
              </div>

              {/* 8-Stage Detailed Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1: Product & Marketing */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                      <Package className="w-4 h-4" /> 1. Sản Phẩm &amp; Khuyến Mãi
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 font-mono">
                      products, coupons
                    </span>
                  </div>
                  <div className="text-xs space-y-1 pt-1 border-t border-gray-100">
                    <div className="font-semibold text-gray-800">{result.product?.name}</div>
                    <div className="flex justify-between text-gray-600">
                      <span>Đơn giá niêm yết:</span>
                      <span className="font-mono font-medium">{result.product?.unitPrice?.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Voucher ({result.marketing?.appliedCoupon}):</span>
                      <span className="font-mono font-bold">-{result.marketing?.discountAmount?.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between text-gray-900 font-bold pt-1 border-t border-dashed border-gray-200">
                      <span>Thanh toán thực tế:</span>
                      <span className="font-mono text-[#0071e3]">{result.marketing?.finalAmount?.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>

                {/* Step 2: Warehouse Hold */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2 hover:border-amber-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                      <Warehouse className="w-4 h-4" /> 2. Kho Hàng &amp; Giữ Hàng (Hold)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 font-mono">
                      temporary_holds, stock_ledger
                    </span>
                  </div>
                  <div className="text-xs space-y-1 pt-1 border-t border-gray-100">
                    <div className="flex justify-between text-gray-600">
                      <span>Kho xuất hàng:</span>
                      <span className="font-bold text-gray-800">{result.warehouse?.warehouseCode} - {result.warehouse?.warehouseName}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Mã phiếu giữ chỗ:</span>
                      <span className="font-mono text-gray-700 truncate max-w-[180px]">{result.warehouse?.holdId}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Số lượng giữ / xuất:</span>
                      <span className="font-mono font-bold text-amber-600">{result.warehouse?.stockDeducted} máy</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tồn kho thực tế còn lại:</span>
                      <span className="font-mono font-semibold text-blue-600">{result.warehouse?.remainingOnHand} sản phẩm</span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Order Confirmation */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <ShoppingCart className="w-4 h-4" /> 3. Đơn Hàng &amp; Bảng Phân Vùng
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 font-mono">
                      orders (Range Partitioned)
                    </span>
                  </div>
                  <div className="text-xs space-y-1 pt-1 border-t border-gray-100">
                    <div className="flex justify-between text-gray-600">
                      <span>Trạng thái đơn hàng:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {result.order?.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Mã đơn hàng CSDL:</span>
                      <span className="font-mono text-gray-700 truncate max-w-[180px]">{result.order?.id}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tổng giá trị đơn:</span>
                      <span className="font-mono font-bold text-emerald-700">{result.order?.totalAmount?.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Thời điểm ghi nhận:</span>
                      <span className="font-mono text-gray-500">
                        {result.order?.createdAt ? new Date(result.order.createdAt).toLocaleTimeString('vi-VN') : 'Vừa xong'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 4: Shipping */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2 hover:border-cyan-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-700 flex items-center gap-1.5">
                      <Truck className="w-4 h-4" /> 4. Vận Chuyển &amp; Vận Đơn
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-50 text-cyan-700 font-mono">
                      shipments
                    </span>
                  </div>
                  <div className="text-xs space-y-1 pt-1 border-t border-gray-100">
                    <div className="flex justify-between text-gray-600">
                      <span>Đối tác vận chuyển:</span>
                      <span className="font-bold text-gray-800">{result.logistics?.carrier}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Mã vận đơn bưu tá:</span>
                      <span className="font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                        {result.logistics?.trackingCode}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Trạng thái giao vận:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {result.logistics?.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Thu hộ COD:</span>
                      <span className="font-mono font-bold">{result.logistics?.codAmount?.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>

                {/* Step 5: Finance & VAT Invoice */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2 hover:border-purple-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" /> 5. Đối Soát COD &amp; Hóa Đơn VAT
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 font-mono">
                      finance, e_invoices, cod
                    </span>
                  </div>
                  <div className="text-xs space-y-1 pt-1 border-t border-gray-100">
                    <div className="flex justify-between text-gray-600">
                      <span>Doanh thu đối soát:</span>
                      <span className="font-mono font-bold text-purple-800">{result.finance?.reconciledAmount?.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Số HĐ điện tử VAT:</span>
                      <span className="font-mono font-semibold text-gray-800">{result.finance?.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Mã CQT xác thực:</span>
                      <span className="font-mono font-bold text-purple-900 bg-purple-50 px-1.5 py-0.5 rounded text-[10px]">
                        {result.finance?.cqtCode}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Lô đối soát COD:</span>
                      <span className="font-mono text-gray-700">{result.finance?.codBatch}</span>
                    </div>
                  </div>
                </div>

                {/* Step 6: CRM & Customer Loyalty */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2 hover:border-pink-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-700 flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> 6. Khách Hàng (CRM) &amp; Nâng Hạng
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-50 text-pink-700 font-mono">
                      customers, loyalty_logs
                    </span>
                  </div>
                  <div className="text-xs space-y-1 pt-1 border-t border-gray-100">
                    <div className="flex justify-between text-gray-600">
                      <span>Khách hàng:</span>
                      <span className="font-bold text-gray-800">{result.crm?.customerName}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tổng chi tiêu tích lũy:</span>
                      <span className="font-mono font-bold text-gray-900">{result.crm?.totalSpent?.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between text-gray-600 items-center">
                      <span>Nâng hạng thành viên:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                          {result.crm?.previousTier}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm">
                          {result.crm?.newTier}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Điểm thưởng loyalty:</span>
                      <span className="font-mono font-bold text-pink-600">
                        +{result.crm?.pointsEarned} điểm (Tổng: {result.crm?.totalPoints})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 7 & 8: Audit Trail Full Verification Table */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>7 &amp; 8. Toàn Trình Audit Log Bất Biến ({result.auditLogsCount} Bản Ghi CSDL)</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    PostgreSQL Table: audit_logs
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                        <th className="py-2 px-3">Thời Điểm</th>
                        <th className="py-2 px-3">Hành Động</th>
                        <th className="py-2 px-3">Phân Hệ</th>
                        <th className="py-2 px-3">Nhân Sự Thao Tác</th>
                        <th className="py-2 px-3">Nội Dung Ghi Vết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {result.auditTrail?.map((log: any, idx: number) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2 px-3 text-gray-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-bold text-[10px]">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-gray-600 font-sans">{log.resource}</td>
                          <td className="py-2 px-3 text-gray-800 font-sans font-medium">{log.actorName || 'Admin'}</td>
                          <td className="py-2 px-3 text-gray-700 font-sans">{log.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0 text-xs">
          <div className="text-[11px] text-gray-500">
            Mọi thay đổi đã được phản ánh tức thì vào kho hàng, đơn hàng, hóa đơn VAT và khách hàng.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  );
};
