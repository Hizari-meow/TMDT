'use client';

import React from 'react';

import {
  Package,
  Truck,
  Zap,
  Search,
  Filter,
  DollarSign,
  BarChart3,
  Boxes,
  Printer,
  Plus,
  RefreshCw,
  Calculator,
  X,
  Check,
  Warehouse,
  Barcode,
  ShieldCheck
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const AdminLogisticsTab: React.FC = () => {
  const {
    setActiveTab,
    warehouses,
    orders,
    carriers,
    setOrderSearch,
    logisticsSubTab,
    setLogisticsSubTab,
    logisticsData,
    setIsNewShipmentModalOpen,
    setIsWarehouseModalOpen,
    setIsExceptionModalOpen,
    setSelectedShipmentForException,
    setIsTrackingModalOpen,
    setSelectedTrackingShipment,
    shipmentFilterStatus,
    setShipmentFilterStatus,
    shipmentSearch,
    setShipmentSearch,
    setWarehouseForm,
    calculatorForm,
    setCalculatorForm,
    calculatorResult,
    isCalculatingRate,
    showToast,
    handleToggleCarrier,
    handleUpdateSmartRouting,
    handleBatchCreateShipments,
    handleUpdateShipmentStatus,
    handlePrintShipmentLabel,
    handleApproveLogisticsCod,
    handleCalculateRateSubmit
  } = useAdminContext();

          const lData = logisticsData || {
            carriers: [],
            smartRouting: { enabled: true, strategy: 'CHEAPEST', fallbackCarrier: 'viettelpost' },
            warehouses: [],
            administrativeMappings: [],
            shippingRules: {
              freeShippingThresholdVnd: 500000,
              maxFreeShippingSubsidyVnd: 40000,
              insuranceRate: 0.005,
              volumetricDivisor: 5000,
              zoneRates: { intraProvinceBase: 22000, intraRegionBase: 30000, interRegionBase: 38000, instant2HBase: 45000 },
            },
            shipments: [],
            codSettlements: [],
            scorecards: [],
            metrics: {
              totalShipmentsActive: 7,
              deliveredRateOverall: '98.3%',
              avgDeliveryTimeIntraCity: '3.8 giờ',
              avgDeliveryTimeInterRegion: '1.8 ngày',
              totalCodPendingSettlementVnd: 416100000,
              logisticsCostSavingsVsStandard: '14.6%',
            },
          };

          const carriersList = lData.carriers || [];
          const shipmentsList = lData.shipments || [];
          const warehousesList = lData.warehouses || [];
          const mappingsList = lData.administrativeMappings || [];
          const codSettlements = lData.codSettlements || [];
          const scorecards = lData.scorecards || [];

          // Filter shipments
          const filteredShipments = shipmentsList.filter((s: any) => {
            const matchStatus = shipmentFilterStatus === 'ALL' || s.status === shipmentFilterStatus;
            const q = shipmentSearch.toLowerCase().trim();
            const matchSearch =
              !q ||
              s.trackingCode?.toLowerCase().includes(q) ||
              s.orderId?.toLowerCase().includes(q) ||
              s.customerName?.toLowerCase().includes(q) ||
              s.customerPhone?.toLowerCase().includes(q) ||
              s.carrierName?.toLowerCase().includes(q);
            return matchStatus && matchSearch;
          });

          return (
            <div className="space-y-6">
              {/* Header & Sub-tab Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#0071e3]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1d1d1f]">4.7. Vận Chuyển &amp; Logistics Enterprise Suite</h3>
                      <p className="text-xs text-[#6e6e73]">
                        Tích hợp API đa hãng, điều phối Smart Routing AI, máy tính cước IATA, theo dõi hành trình &amp; đối soát COD
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsNewShipmentModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Vận Đơn Mới</span>
                  </button>
                  <button
                    onClick={handleBatchCreateShipments}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all"
                  >
                    <Boxes className="w-3.5 h-3.5" />
                    <span>Xuất Kho Hàng Loạt</span>
                  </button>
                </div>
              </div>

              {/* 5 Sub-Tabs Navigation */}
              <div className="flex items-center gap-1 border-b border-gray-200/80 pb-2 text-xs font-semibold overflow-x-auto no-scrollbar">
                {[
                  { id: 'carriers', label: '1. Kết Nối Hãng & Smart Routing AI', icon: Truck },
                  { id: 'calculator', label: '2. Máy Tính Cước IATA & Bảng Giá', icon: Calculator },
                  { id: 'warehouses_mapping', label: '3. Kho Xuất Hàng & Ánh Xạ Mã Tỉnh', icon: Warehouse },
                  { id: 'tracking_exceptions', label: '4. Hành Trình & Xử Lý Sự Cố', icon: Package },
                  { id: 'cod_scorecard', label: '5. Đối Soát COD & Hiệu Suất', icon: BarChart3 },
                ].map((st) => {
                  const Icon = st.icon;
                  const active = logisticsSubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setLogisticsSubTab(st.id as any)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                        active
                          ? 'bg-[#1d1d1f] text-white shadow-xs'
                          : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ============================================================= */}
              {/* SUBTAB 1: KẾT NỐI HÃNG & ĐIỀU PHỐI SMART ROUTING               */}
              {/* ============================================================= */}
              {logisticsSubTab === 'carriers' && (
                <div className="space-y-6">
                  {/* KPI Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                      <div className="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider">Hãng Đang Kết Nối</div>
                      <div className="text-xl font-bold text-[#1d1d1f] mt-1">{carriersList.length} Đối Tác Chiến Lược</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-1">✓ GHN, GHTK, Viettel Post, J&amp;T, Grab, Aha...</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                      <div className="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider">Smart Routing AI</div>
                      <div className="text-xl font-bold text-[#0071e3] mt-1">
                        {lData.smartRouting?.strategy === 'CHEAPEST'
                          ? 'Giá Rẻ Nhất'
                          : lData.smartRouting?.strategy === 'FASTEST'
                          ? 'Nhanh Nhất (Tốc Độ)'
                          : 'Tỷ Lệ Thành Công Cao'}
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium mt-1">Tự động gán hãng khi duyệt đơn</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                      <div className="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider">Tỷ Lệ Giao Thành Công</div>
                      <div className="text-xl font-bold text-emerald-600 mt-1">{lData.metrics?.deliveredRateOverall || '98.3%'}</div>
                      <div className="text-[11px] text-gray-500 font-medium mt-1">Tỷ lệ hoàn (RTO): 1.4% toàn sàn</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                      <div className="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider">Tiết Kiệm Chi Phí Ship</div>
                      <div className="text-xl font-bold text-indigo-600 mt-1">-{lData.metrics?.logisticsCostSavingsVsStandard || '14.6%'}</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-1">Tối ưu cước theo thuật toán vùng</div>
                    </div>
                  </div>

                  {/* Smart Routing AI Policy Control */}
                  <div className="bg-white p-5 rounded-3xl border border-blue-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#0071e3]" />
                        <h4 className="text-sm font-bold text-[#1d1d1f]">Cấu Hình Thuật Toán Điều Phối Hãng Tự Động (Smart Routing AI)</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0071e3] border border-blue-200">
                        ACTIVE AUTOMATION
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'CHEAPEST',
                          title: 'Tối Ưu Chi Phí (Cheapest)',
                          desc: 'Tự động chọn hãng có cước rẻ nhất toàn trình sau khi so khớp cân nặng thực vs thể tích IATA.',
                          icon: DollarSign,
                        },
                        {
                          id: 'FASTEST',
                          title: 'Tối Ưu Tốc Độ (Fastest)',
                          desc: 'Ưu tiên các hãng có thời gian cam kết giao ngắn nhất (Hỏa tốc 2H, Bay liên miền 24H).',
                          icon: Zap,
                        },
                        {
                          id: 'HIGHEST_SUCCESS_RATE',
                          title: 'Tỷ Lệ Thành Công (High CSAT)',
                          desc: 'Điều phối cho hãng có tỷ lệ phát hàng thành công cao nhất theo khu vực địa lý cụ thể.',
                          icon: ShieldCheck,
                        },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = lData.smartRouting?.strategy === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleUpdateSmartRouting(item.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50/50 border-[#0071e3] ring-2 ring-blue-500/20'
                                : 'bg-[#f5f5f7] border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#0071e3]' : 'text-gray-500'}`} />
                                <span className={`text-xs font-bold ${isSelected ? 'text-[#0071e3]' : 'text-[#1d1d1f]'}`}>
                                  {item.title}
                                </span>
                              </div>
                              <input type="radio" checked={isSelected} readOnly className="accent-[#0071e3]" />
                            </div>
                            <p className="text-[11px] text-[#6e6e73] mt-2 leading-relaxed">{item.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-[#6e6e73] gap-2 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <span>Hãng dự phòng quá tải: <strong className="text-[#1d1d1f]">Viettel Post (100% huyện đảo)</strong></span>
                        <span>Ưu tiên hỏa tốc nội thành: <strong className="text-[#1d1d1f]">GrabExpress / Ahamove 2H</strong></span>
                      </div>
                      <span className="text-emerald-600 font-semibold">✓ Hệ thống tự động so khớp giá thời gian thực mỗi 15 phút</span>
                    </div>
                  </div>

                  {/* Connected Carriers Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {carriersList.map((carrier: any) => {
                      const isConnected = carrier.status === 'CONNECTED';
                      return (
                        <div
                          key={carrier.id}
                          className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
                        >
                          <div>
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl">{carrier.logo}</span>
                                <div>
                                  <h4 className="text-xs font-bold text-[#1d1d1f]">{carrier.name}</h4>
                                  <span className="text-[10px] font-mono text-gray-500">{carrier.code}</span>
                                </div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {isConnected ? 'ĐÃ KẾT NỐI' : 'TẠM DỪNG'}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#6e6e73] mt-3 line-clamp-2">{carrier.description}</p>

                            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
                              <div>
                                <div className="text-[10px] text-gray-500">Độ trễ API</div>
                                <div className="text-xs font-bold text-gray-800 font-mono mt-0.5">{carrier.apiLatency}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-gray-500">Tỷ lệ giao</div>
                                <div className="text-xs font-bold text-emerald-600 mt-0.5">{carrier.successRate}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-gray-500">Thời gian TB</div>
                                <div className="text-xs font-bold text-blue-600 mt-0.5">{carrier.avgDeliveryHours}h</div>
                              </div>
                            </div>

                            <div className="mt-3 bg-[#f5f5f7] p-2 rounded-xl text-[10px] font-mono text-gray-600 flex items-center justify-between">
                              <span>Ví trả trước / Công nợ:</span>
                              <strong className="text-[#1d1d1f] font-bold font-mono">
                                {(carrier.accountBalance || 0).toLocaleString()} VNĐ
                              </strong>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-3">
                              {(carrier.features || []).map((feat: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-gray-100 text-[9px] text-gray-600 font-medium">
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-mono truncate max-w-[140px]">
                              {carrier.apiToken ? carrier.apiToken.slice(0, 10) + '***' : 'Chưa nhập Token'}
                            </span>
                            <button
                              onClick={() => handleToggleCarrier(carrier.id, carrier.status)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isConnected
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {isConnected ? 'Ngắt Kết Nối' : 'Kích Hoạt API'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* SUBTAB 2: MÁY TÍNH CƯỚC IATA & CẤU HÌNH PHÍ SHIP               */}
              {/* ============================================================= */}
              {logisticsSubTab === 'calculator' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Calculator Input Form */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                        <Calculator className="w-5 h-5 text-[#0071e3]" />
                        <div>
                          <h4 className="text-sm font-bold text-[#1d1d1f]">Máy Tính Cước Chuẩn Logistics (IATA)</h4>
                          <p className="text-[11px] text-[#6e6e73]">Tự động quy đổi cân nặng thể tích (Dài x Rộng x Cao)/5000</p>
                        </div>
                      </div>

                      <form onSubmit={handleCalculateRateSubmit} className="space-y-3.5 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[#1d1d1f] font-semibold block mb-1">Kho Gửi (Điểm Đi)</label>
                            <select
                              value={calculatorForm.fromProvince}
                              onChange={(e) => setCalculatorForm({ ...calculatorForm, fromProvince: e.target.value })}
                              className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                            >
                              <option value="Hà Nội">Hà Nội (Kho Thái Hà)</option>
                              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (Kho Võ Văn Tần)</option>
                              <option value="Đà Nẵng">Đà Nẵng (Kho Nguyễn Văn Linh)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[#1d1d1f] font-semibold block mb-1">Tỉnh/Thành Nhận (Điểm Đến)</label>
                            <select
                              value={calculatorForm.toProvince}
                              onChange={(e) => setCalculatorForm({ ...calculatorForm, toProvince: e.target.value })}
                              className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                            >
                              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                              <option value="Hà Nội">Hà Nội</option>
                              <option value="Đà Nẵng">Đà Nẵng</option>
                              <option value="Hải Phòng">Hải Phòng</option>
                              <option value="Cần Thơ">Cần Thơ</option>
                              <option value="Bình Định">Bình Định</option>
                              <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[#1d1d1f] font-semibold block mb-1">Cân Nặng Thực Tế (Grams)</label>
                          <input
                            type="number"
                            min="10"
                            required
                            value={calculatorForm.weightGrams}
                            onChange={(e) => setCalculatorForm({ ...calculatorForm, weightGrams: Number(e.target.value) })}
                            className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                            placeholder="Ví dụ: 450"
                          />
                        </div>

                        <div>
                          <label className="text-[#1d1d1f] font-semibold block mb-1">Kích Thước Kiện Hàng (Dài x Rộng x Cao cm)</label>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              placeholder="Dài (cm)"
                              value={calculatorForm.lengthCm}
                              onChange={(e) => setCalculatorForm({ ...calculatorForm, lengthCm: Number(e.target.value) })}
                              className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-center text-[#1d1d1f]"
                            />
                            <input
                              type="number"
                              placeholder="Rộng (cm)"
                              value={calculatorForm.widthCm}
                              onChange={(e) => setCalculatorForm({ ...calculatorForm, widthCm: Number(e.target.value) })}
                              className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-center text-[#1d1d1f]"
                            />
                            <input
                              type="number"
                              placeholder="Cao (cm)"
                              value={calculatorForm.heightCm}
                              onChange={(e) => setCalculatorForm({ ...calculatorForm, heightCm: Number(e.target.value) })}
                              className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-center text-[#1d1d1f]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[#1d1d1f] font-semibold block mb-1">Trị Giá Khai Báo (VND)</label>
                            <input
                              type="number"
                              value={calculatorForm.orderValueVnd}
                              onChange={(e) => setCalculatorForm({ ...calculatorForm, orderValueVnd: Number(e.target.value) })}
                              className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                              placeholder="Giá trị tính bảo hiểm"
                            />
                          </div>
                          <div>
                            <label className="text-[#1d1d1f] font-semibold block mb-1">Tiền Thu Hộ COD ($ / VND)</label>
                            <input
                              type="number"
                              value={calculatorForm.codAmount}
                              onChange={(e) => setCalculatorForm({ ...calculatorForm, codAmount: Number(e.target.value) })}
                              className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                              placeholder="Số tiền shipper thu"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isCalculatingRate}
                          className="w-full py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isCalculatingRate ? 'animate-spin' : ''}`} />
                          <span>{isCalculatingRate ? 'Đang truy vấn bảng cước...' : 'Tra Cứu Báo Giá Tức Thì'}</span>
                        </button>
                      </form>
                    </div>

                    {/* Quotation Results */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                          <h4 className="text-sm font-bold text-[#1d1d1f]">Báo Giá 7 Hãng Vận Chuyển Theo Thời Gian Thực</h4>
                          <span className="text-[11px] text-gray-500">IATA Divisor: 5,000</span>
                        </div>

                        {calculatorResult ? (
                          <div className="space-y-3 mt-3">
                            {/* Volumetric Weight Formula banner */}
                            <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
                              <div>
                                <span className="font-bold text-[#0071e3] block">{calculatorResult.appliedRule}</span>
                                <span className="text-[11px] text-gray-600">
                                  Cân thực: <strong>{calculatorResult.actualGrams}g</strong> | Cân thể tích: <strong>{calculatorResult.volumetricGrams}g</strong> → Tính cước: <strong className="text-blue-700">{calculatorResult.chargeableGrams}g</strong>
                                </span>
                              </div>
                              {calculatorResult.isFreeShipEligible && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  ĐỦ ĐIỀU KIỆN FREESHIP (-{(calculatorResult.subsidyAmount).toLocaleString()}đ)
                                </span>
                              )}
                            </div>

                            {/* Carrier quotes list */}
                            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                              {calculatorResult.quotes?.map((q: any) => {
                                const isRecommended = q.carrierId === calculatorResult.recommendedCarrierId;
                                return (
                                  <div
                                    key={q.carrierId}
                                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                                      isRecommended
                                        ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-400'
                                        : q.disabled
                                        ? 'bg-gray-50 border-gray-200 opacity-50'
                                        : 'bg-white border-gray-200 hover:border-blue-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl">{q.logo}</span>
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-bold text-[#1d1d1f]">{q.carrier}</span>
                                          {isRecommended && (
                                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                              ★ AI KHUYÊN DÙNG
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[11px] text-gray-500 mt-0.5">
                                          Cam kết giao: <strong>{q.estimatedDelivery}</strong> • {q.tag}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      {q.disabled ? (
                                        <span className="text-xs text-rose-500 font-semibold">Không hỗ trợ</span>
                                      ) : (
                                        <div>
                                          <div className="text-sm font-bold text-[#1d1d1f] font-mono">
                                            {q.shippingFee.toLocaleString()} VNĐ
                                          </div>
                                          {q.subsidyDiscount > 0 && (
                                            <span className="line-through text-[10px] text-gray-400 font-mono block">
                                              {q.originalFee.toLocaleString()} VNĐ
                                            </span>
                                          )}
                                          {q.insuranceFee > 0 && (
                                            <span className="text-[10px] text-amber-700 block font-medium">
                                              +BH: {q.insuranceFee.toLocaleString()}đ
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 text-center text-[#6e6e73]">
                            <Truck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs">Bấm <strong>"Tra Cứu Báo Giá Tức Thì"</strong> để so sánh cước vận chuyển chuẩn IATA</p>
                          </div>
                        )}
                      </div>

                      {/* Rules Config Quick View */}
                      <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div className="bg-[#f5f5f7] p-2 rounded-xl">
                          <span className="text-gray-500 block">Miễn phí ship từ</span>
                          <strong className="text-[#1d1d1f]">500,000 VNĐ</strong>
                        </div>
                        <div className="bg-[#f5f5f7] p-2 rounded-xl">
                          <span className="text-gray-500 block">Hỗ trợ tối đa</span>
                          <strong className="text-emerald-600">40,000 VNĐ/đơn</strong>
                        </div>
                        <div className="bg-[#f5f5f7] p-2 rounded-xl">
                          <span className="text-gray-500 block">Phí bảo hiểm</span>
                          <strong className="text-[#0071e3]">0.5% (đơn &gt; 1tr)</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* SUBTAB 3: KHO XUẤT HÀNG & ÁNH XẠ MÃ TỈNH (MAPPING ENGINE)      */}
              {/* ============================================================= */}
              {logisticsSubTab === 'warehouses_mapping' && (
                <div className="space-y-6">
                  {/* Warehouses list */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">Danh Sách Kho Lấy Hàng Xuất Kho (Pick-up Hubs)</h4>
                        <p className="text-xs text-[#6e6e73]">Địa chỉ kho xuất hàng đồng bộ trực tiếp với hệ thống bưu cục các hãng</p>
                      </div>
                      <button
                        onClick={() => {
                          setWarehouseForm({
                            id: '',
                            name: '',
                            address: '',
                            province: 'Hà Nội',
                            district: '',
                            ward: '',
                            contactName: '',
                            contactPhone: '',
                            isDefault: false,
                            areaSqMeters: 500,
                          });
                          setIsWarehouseModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Kho Mới</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {warehousesList.map((wh: any) => (
                        <div
                          key={wh.id}
                          className="bg-[#f5f5f7] p-4 rounded-2xl border border-gray-200/80 space-y-3 relative hover:border-blue-300 transition-all"
                        >
                          {wh.isDefault && (
                            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0071e3] text-white">
                              KHO MẶC ĐỊNH
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <Warehouse className="w-4 h-4 text-[#0071e3]" />
                            <h5 className="text-xs font-bold text-[#1d1d1f]">{wh.name}</h5>
                          </div>
                          <div className="text-[11px] text-[#6e6e73] space-y-1">
                            <div><strong>Địa chỉ:</strong> {wh.address}</div>
                            <div><strong>Liên hệ:</strong> {wh.contactName} ({wh.contactPhone})</div>
                            <div><strong>Diện tích sàn:</strong> {wh.areaSqMeters} m²</div>
                          </div>
                          <div className="pt-2 border-t border-gray-200 text-[10px] text-gray-500 font-mono space-y-0.5">
                            <div>GHN Shop ID: <strong className="text-gray-800">{wh.ghnShopId || 'GHN_SHOP_01'}</strong></div>
                            <div>GHTK Shop ID: <strong className="text-gray-800">{wh.ghtkShopId || 'GHTK_S201'}</strong></div>
                            <div>VTP Account: <strong className="text-gray-800">{wh.vtpPickupId || 'VTP_ACC_081'}</strong></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Administrative Mapping Engine */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">Bảng Ánh Xạ Địa Giới Hành Chính Chuẩn Sang Bộ Mã Từng Hãng</h4>
                        <p className="text-xs text-[#6e6e73]">
                          Khắc phục xung đột bộ mã: Mã Tổng Cục Thống Kê (GSO) ↔ Mã GHN ↔ Mã GHTK ↔ Mã Viettel Post ↔ J&amp;T
                        </p>
                      </div>
                      <button
                        onClick={() => showToast('Đã đối soát và đồng bộ 10,599 mã Xã/Phường với Cục Bưu Điện thành công!')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Đồng Bộ 100% Bộ Mã</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-[#6e6e73] bg-[#f5f5f7]">
                            <th className="py-2.5 px-3 font-semibold">Tỉnh / Thành Phố</th>
                            <th className="py-2.5 px-3 font-semibold">Mã GSO (Chuẩn QG)</th>
                            <th className="py-2.5 px-3 font-semibold">Mã GHN (ProvinceID)</th>
                            <th className="py-2.5 px-3 font-semibold">Mã GHTK (Tên Chuẩn)</th>
                            <th className="py-2.5 px-3 font-semibold">Mã Viettel Post</th>
                            <th className="py-2.5 px-3 font-semibold">Mã J&amp;T</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Trạng Thái Mapping</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {mappingsList.map((mapItem: any) => (
                            <tr key={mapItem.gsoCode} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-3 font-bold text-[#1d1d1f]">
                                {mapItem.provinceName}
                                <span className="block text-[10px] text-gray-500 font-normal">
                                  {mapItem.districtsCount} Quận/Huyện • {mapItem.wardsCount} Xã/Phường
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-gray-700">{mapItem.gsoCode}</td>
                              <td className="py-3 px-3 font-mono text-blue-600 font-semibold">{mapItem.ghnProvinceId}</td>
                              <td className="py-3 px-3 font-mono text-emerald-700">{mapItem.ghtkName}</td>
                              <td className="py-3 px-3 font-mono text-purple-700 font-semibold">{mapItem.vtpProvinceId}</td>
                              <td className="py-3 px-3 font-mono text-rose-600">{mapItem.jtCode}</td>
                              <td className="py-3 px-3 text-center">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  {mapItem.syncStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* SUBTAB 4: HÀNH TRÌNH VẬN ĐƠN & XỬ LÝ SỰ CỐ (EXCEPTIONS)        */}
              {/* ============================================================= */}
              {logisticsSubTab === 'tracking_exceptions' && (
                <div className="space-y-6">
                  {/* Search, Filter & Quick Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-gray-200/80 shadow-xs">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={shipmentSearch}
                          onChange={(e) => setShipmentSearch(e.target.value)}
                          placeholder="Tìm mã vận đơn, khách hàng, SĐT, đơn hàng..."
                          className="w-full pl-9 pr-3 py-2 bg-[#f5f5f7] border border-gray-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-hidden focus:border-[#0071e3]"
                        />
                      </div>

                      <select
                        value={shipmentFilterStatus}
                        onChange={(e) => setShipmentFilterStatus(e.target.value)}
                        className="bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1d1d1f]"
                      >
                        <option value="ALL">Tất Cả Trạng Thái ({shipmentsList.length})</option>
                        <option value="PICKED_UP">Đã Lấy Hàng</option>
                        <option value="IN_SORTING_HUB">Nhập Kho Trung Chuyển</option>
                        <option value="OUT_FOR_DELIVERY">Đang Phát Hàng (Shipper)</option>
                        <option value="DELIVERED">Giao Thành Công</option>
                        <option value="DELIVERY_FAILED">Giao Thất Bại (Cần Xử Lý)</option>
                        <option value="RETURNED">Đã Chuyển Hoàn (RTO)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 font-medium">Giả lập Webhook Carrier:</span>
                      <button
                        onClick={() => {
                          const target = filteredShipments.find((s: any) => s.status !== 'DELIVERED' && s.status !== 'RETURNED') || filteredShipments[0];
                          if (target) {
                            handleUpdateShipmentStatus(target.trackingCode || target.id, 'DELIVERED', 'Bưu tá xác nhận khách đã nhận bưu phẩm và ký biên bản');
                          } else {
                            showToast('Không có đơn hàng nào đang giao để test');
                          }
                        }}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-[11px] font-bold transition-all shadow-2xs"
                        title="Giả lập đối tác vận chuyển gửi Webhook giao thành công"
                      >
                        ⚡ Test Webhook Giao Thành Công
                      </button>
                      <button
                        onClick={() => {
                          const target = filteredShipments.find((s: any) => s.status !== 'DELIVERY_FAILED') || filteredShipments[0];
                          if (target) {
                            handleUpdateShipmentStatus(target.trackingCode || target.id, 'DELIVERY_FAILED', 'Khách không nghe máy khi shipper gọi 2 lần');
                          } else {
                            showToast('Không có đơn hàng để test');
                          }
                        }}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-[11px] font-bold transition-all shadow-2xs"
                        title="Giả lập đối tác vận chuyển gửi Webhook báo giao thất bại"
                      >
                        ⚠️ Test Webhook Báo Thất Bại
                      </button>
                    </div>
                  </div>

                  {/* Shipments Table */}
                  <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-[#6e6e73] bg-[#f5f5f7]">
                            <th className="py-2.5 px-3 font-semibold">Mã Vận Đơn</th>
                            <th className="py-2.5 px-3 font-semibold">Đơn Hàng (OMS)</th>
                            <th className="py-2.5 px-3 font-semibold">Người Nhận &amp; Địa Chỉ</th>
                            <th className="py-2.5 px-3 font-semibold">Hãng &amp; Kho Xuất</th>
                            <th className="py-2.5 px-3 font-semibold">Shipper Phụ Trách</th>
                            <th className="py-2.5 px-3 font-semibold">Cân Nặng IATA</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Tiền COD</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Trạng Thái</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredShipments.map((shipment: any) => {
                            const isFailed = shipment.status === 'DELIVERY_FAILED';
                            return (
                              <tr key={shipment.id} className={`transition-colors ${isFailed ? 'bg-rose-50/30' : 'hover:bg-gray-50/80'}`}>
                                <td className="py-3 px-3">
                                  <button
                                    onClick={() => {
                                      setSelectedTrackingShipment(shipment);
                                      setIsTrackingModalOpen(true);
                                    }}
                                    className="font-mono font-bold text-[#0071e3] hover:underline flex items-center gap-1 text-left"
                                    title="Xem chi tiết hành trình shipper"
                                  >
                                    <Barcode className="w-3.5 h-3.5" />
                                    <span>{shipment.trackingCode}</span>
                                  </button>
                                  <span className="text-[10px] text-gray-500 font-mono">{shipment.id}</span>
                                </td>
                                <td className="py-3 px-3">
                                  <button
                                    onClick={() => {
                                      setActiveTab('orders');
                                      setOrderSearch(shipment.orderId?.replace('#', ''));
                                    }}
                                    className="font-mono font-semibold text-[#0071e3] hover:underline"
                                    title="Chuyển sang 4.3 xem chi tiết đơn hàng này"
                                  >
                                    {shipment.orderId}
                                  </button>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="font-bold text-[#1d1d1f]">{shipment.customerName}</div>
                                  <div className="text-[10px] text-gray-500 font-mono">{shipment.customerPhone}</div>
                                  <div className="text-[11px] text-gray-600 line-clamp-1 max-w-[200px]" title={shipment.deliveryAddress}>
                                    {shipment.deliveryAddress}
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="font-semibold text-gray-800">{shipment.carrierName}</div>
                                  <div className="text-[10px] text-gray-500 line-clamp-1 max-w-[150px]" title={shipment.warehouseName}>
                                    {shipment.warehouseName}
                                  </div>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-medium">
                                    {shipment.shippingMethod}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  {shipment.shipperInfo ? (
                                    <div className="space-y-0.5">
                                      <div className="font-bold text-[#1d1d1f] flex items-center gap-1">
                                        <Truck className="w-3 h-3 text-[#0071e3]" />
                                        <span>{shipment.shipperInfo.name}</span>
                                      </div>
                                      <a
                                        href={`tel:${shipment.shipperInfo.phone?.replace(/\s+/g, '')}`}
                                        className="text-[10px] text-blue-600 hover:underline font-mono block"
                                      >
                                        📞 {shipment.shipperInfo.phone}
                                      </a>
                                      {shipment.shipperInfo.licensePlate && (
                                        <span className="text-[9px] text-gray-500 font-mono bg-gray-100 px-1 py-0.2 rounded">
                                          {shipment.shipperInfo.licensePlate}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                                      Chờ điều phối kho
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3 font-mono">
                                  <div className="font-bold">{shipment.chargeableGrams}g</div>
                                  <span className="text-[10px] text-gray-500">
                                    Thực {shipment.weightGrams}g / V.{shipment.volumetricGrams}g
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right font-mono font-bold text-[#1d1d1f]">
                                  {shipment.codAmount > 0 ? '$' + Number(shipment.codAmount).toLocaleString() : '0 (Đã TT)'}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      shipment.status === 'DELIVERED'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : shipment.status === 'OUT_FOR_DELIVERY'
                                        ? 'bg-blue-100 text-blue-800'
                                        : shipment.status === 'IN_SORTING_HUB'
                                        ? 'bg-purple-100 text-purple-800'
                                        : shipment.status === 'DELIVERY_FAILED'
                                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                                        : shipment.status === 'RETURNED'
                                        ? 'bg-amber-100 text-amber-800'
                                        : shipment.status === 'PICKED_UP'
                                        ? 'bg-sky-100 text-sky-800'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {shipment.status === 'DELIVERED'
                                      ? 'ĐÃ GIAO'
                                      : shipment.status === 'OUT_FOR_DELIVERY'
                                      ? 'ĐANG PHÁT'
                                      : shipment.status === 'PICKED_UP'
                                      ? 'CHỜ SHIPPER'
                                      : shipment.status === 'IN_SORTING_HUB'
                                      ? 'TRUNG CHUYỂN'
                                      : shipment.status === 'DELIVERY_FAILED'
                                      ? 'GIAO THẤT BẠI'
                                      : shipment.status === 'RETURNED'
                                      ? 'ĐÃ HOÀN VỀ'
                                      : 'ĐÃ TIẾP NHẬN'}
                                  </span>
                                  {shipment.failedAttempts > 0 && (
                                    <span className="block text-[9px] text-rose-600 font-bold mt-0.5">
                                      Lần {shipment.failedAttempts}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedTrackingShipment(shipment);
                                        setIsTrackingModalOpen(true);
                                      }}
                                      className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs"
                                      title="Xem chi tiết hành trình shipper"
                                    >
                                      <Truck className="w-3 h-3 text-[#0071e3]" />
                                      <span>Hành Trình</span>
                                    </button>

                                    <button
                                      onClick={() => handlePrintShipmentLabel(shipment.id)}
                                      className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs"
                                      title="In tem nhiệt bưu phẩm khổ A6/A7"
                                    >
                                      <Printer className="w-3 h-3 text-[#0071e3]" />
                                      <span>In Tem</span>
                                    </button>

                                    {isFailed && (
                                      <button
                                        onClick={() => {
                                          setSelectedShipmentForException(shipment);
                                          setIsExceptionModalOpen(true);
                                        }}
                                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs"
                                      >
                                        Xử Lý Sự Cố
                                      </button>
                                    )}
                                  </div>
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

              {/* ============================================================= */}
              {/* SUBTAB 5: ĐỐI SOÁT COD & HIỆU SUẤT HÃNG (SCORECARD)             */}
              {/* ============================================================= */}
              {logisticsSubTab === 'cod_scorecard' && (
                <div className="space-y-6">
                  {/* COD Settlement Overview Banner */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">Đối Soát Tiền Thu Hộ COD Với Hãng Vận Chuyển</h4>
                        <p className="text-xs text-[#6e6e73]">
                          Đối chiếu từng đơn hàng COD, tự động trừ cước ship, trừ phí dịch vụ thu hộ và chuyển về tài khoản TechZone
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-gray-500">Chờ chuyển khoản tất toán:</span>
                        <div className="text-base font-bold text-[#0071e3] font-mono">
                          {(lData.metrics?.totalCodPendingSettlementVnd || 416100000).toLocaleString()} VNĐ
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-[#6e6e73] bg-[#f5f5f7]">
                            <th className="py-2.5 px-3 font-semibold">Mã Kỳ Đối Soát</th>
                            <th className="py-2.5 px-3 font-semibold">Hãng Vận Chuyển</th>
                            <th className="py-2.5 px-3 font-semibold">Chu Kỳ</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Số Vận Đơn</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Tổng COD Thu Hộ</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Cước Khấu Trừ</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Thực Nhận (VND)</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Trạng Thái</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {codSettlements.map((cod: any) => {
                            const isPending = cod.status === 'PENDING_APPROVAL';
                            return (
                              <tr key={cod.batchId} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-3 px-3 font-mono font-bold text-gray-800">{cod.batchId}</td>
                                <td className="py-3 px-3 font-semibold text-[#1d1d1f]">{cod.carrierName}</td>
                                <td className="py-3 px-3 text-gray-600">{cod.cycle}</td>
                                <td className="py-3 px-3 text-center font-bold text-blue-600">{cod.totalShipments} đơn</td>
                                <td className="py-3 px-3 text-right font-mono font-bold text-gray-800">
                                  {cod.totalCodCollected.toLocaleString()}đ
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-rose-600">
                                  -{cod.shippingFeeDeducted.toLocaleString()}đ
                                </td>
                                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                                  {cod.netSettlementAmount.toLocaleString()}đ
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {isPending ? 'CHỜ TẤT TOÁN' : 'ĐÃ TẤT TOÁN'}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  {isPending ? (
                                    <button
                                      onClick={() => handleApproveLogisticsCod(cod.batchId)}
                                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs"
                                    >
                                      Duyệt Tất Toán
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-gray-400 font-mono">Đã ghi nhận sổ cái</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Carrier Performance Scorecard & Analytics */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1d1d1f]">Báo Cáo Hiệu Suất Vận Chuyển (Carrier Scorecard &amp; SLA)</h4>
                        <p className="text-xs text-[#6e6e73]">
                          Đo lường thời gian giao trung bình, tỷ lệ giao thành công và tỷ lệ bồi thường mất mát
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">Đánh giá theo 30 ngày gần nhất</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {scorecards.map((sc: any) => (
                        <div
                          key={sc.carrierId}
                          className="bg-[#f5f5f7] p-4 rounded-2xl border border-gray-200/80 space-y-3 hover:border-blue-300 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-[#1d1d1f]">{sc.name}</h5>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              ★ {sc.customerSatisfaction} / 5.0
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between text-gray-600">
                              <span>Tỷ lệ giao thành công:</span>
                              <strong className="text-emerald-600">{sc.successRate}%</strong>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Thời gian giao trung bình:</span>
                              <strong className="text-blue-600">{sc.avgDeliveryHours} giờ</strong>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Tỷ lệ đúng hẹn SLA:</span>
                              <strong className="text-purple-600">{sc.onTimeDeliveryRate}%</strong>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Tỷ lệ chuyển hoàn (RTO):</span>
                              <strong className="text-rose-600">{sc.returnRate}%</strong>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Tỷ lệ đền bù hư hỏng:</span>
                              <strong className="text-gray-800">{sc.lostDamagedRate}%</strong>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-200 text-[10px] text-[#0071e3] font-bold">
                            💡 {sc.aiRecommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
};
