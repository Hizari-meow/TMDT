'use client';

import React from 'react';

import {
  Package,
  Search,
  Filter,
  Clock,
  Edit3,
  Plus,
  ExternalLink,
  Download,
  Upload,
  Sliders,
  X,
  FolderTree,
  Award,
  ListFilter,
  MoveUp,
  MoveDown,
  Server
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const AdminProductsTab: React.FC = () => {
  const {
    productSubTab,
    setProductSubTab,
    inventory,
    categoryTree,
    brands,
    attributeGroups,
    setIsNewAttrModalOpen,
    productSearch,
    setProductSearch,
    productStatusFilter,
    setProductStatusFilter,
    selectedProductIds,
    setSelectedProductIds,
    setIsBatchProductModalOpen,
    batchJob,
    openAddProductModal,
    openEditProductModal,
    handleToggleAttributeFilter,
    handleAddOptionToAttribute,
    handleDownloadTemplateCsv,
    handleCsvFileUpload,
    handleMoveCategory,
    filteredProducts,
    handleExportCSV
  } = useAdminContext();

  return (
          <div className="space-y-6">
            {/* 4.1 Sub-tab navigation bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-semibold">
                {[
                  { id: 'list', label: 'Kệ Hàng & Biến Thể', icon: Package },
                  { id: 'categories', label: 'Cây Danh Mục Đa Cấp', icon: FolderTree },
                  { id: 'brands', label: 'Thương Hiệu (Brands)', icon: Award },
                  { id: 'attributes', label: 'Bộ Thuộc Tính Bộ Lọc', icon: ListFilter },
                  { id: 'batch_jobs', label: 'Hàng Đợi Batch Queue', icon: Clock },
                ].map((st) => {
                  const Icon = st.icon;
                  const isCurrent = productSubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setProductSubTab(st.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                        isCurrent
                          ? 'bg-[#1d1d1f] text-white shadow-xs'
                          : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadTemplateCsv}
                  className="px-3 py-1.5 bg-[#f5f5f7] hover:bg-gray-200 text-[#1d1d1f] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Tải file mẫu CSV để chuẩn bị dữ liệu"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>File CSV Mẫu</span>
                </button>

                <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-[#1d1d1f] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#6e6e73]" />
                  <span>Nhập CSV</span>
                  <input type="file" accept=".csv" onChange={handleCsvFileUpload} className="hidden" />
                </label>

                <button
                  onClick={() => handleExportCSV('Danh_Sach_San_Pham_TechZone', inventory)}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-[#1d1d1f] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#6e6e73]" />
                  <span>Xuất CSV</span>
                </button>

                <button
                  onClick={openAddProductModal}
                  className="px-4 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Sản Phẩm Mới</span>
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: KỆ HÀNG & DANH SÁCH BIẾN THỂ */}
            {productSubTab === 'list' && (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
                    {[
                      { id: 'ALL', label: 'Tất cả trạng thái' },
                      { id: 'ACTIVE', label: 'Đang bán (Active)' },
                      { id: 'DRAFT', label: 'Bản nháp (Draft)' },
                      { id: 'ARCHIVED', label: 'Ngừng kinh doanh (Archived)' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setProductStatusFilter(st.id)}
                        className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                          productStatusFilter === st.id
                            ? 'bg-[#0071e3] text-white shadow-xs'
                            : 'bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f]'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative min-w-[260px]">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Tìm tên sản phẩm, mã SKU..."
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#1d1d1f] placeholder-gray-400 focus:outline-none focus:border-[#0071e3]"
                      />
                    </div>

                    {selectedProductIds.length > 0 && (
                      <button
                        onClick={() => setIsBatchProductModalOpen(true)}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-all"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Sửa Hàng Loạt ({selectedProductIds.length})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Products Table */}
                <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                      <tr>
                        <th className="py-3.5 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={inventory.length > 0 && selectedProductIds.length === inventory.length}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedProductIds(inventory.map((p) => p.id));
                              else setSelectedProductIds([]);
                            }}
                            className="rounded border-gray-300 text-[#0071e3]"
                          />
                        </th>
                        <th className="py-3.5 px-4 font-semibold">Mã SKU / Sản Phẩm &amp; Lịch Đăng</th>
                        <th className="py-3.5 px-4 font-semibold">Tổ Hợp Biến Thể (Màu x Size)</th>
                        <th className="py-3.5 px-4 font-semibold">Giá Bán / Giá Vốn</th>
                        <th className="py-3.5 px-4 font-semibold">Trọng Lượng &amp; Kích Thước</th>
                        <th className="py-3.5 px-4 font-semibold">Tồn Kho</th>
                        <th className="py-3.5 px-4 font-semibold">Trạng Thái</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Chi Tiết &amp; SEO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-[#86868b] text-xs">
                            Không tìm thấy sản phẩm nào phù hợp.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((prod) => {
                          const isSelected = selectedProductIds.includes(prod.id);
                          return (
                            <tr key={prod.id} className={`hover:bg-gray-50/80 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                              <td className="py-3.5 px-4">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedProductIds([...selectedProductIds, prod.id]);
                                    else setSelectedProductIds(selectedProductIds.filter((id) => id !== prod.id));
                                  }}
                                  className="rounded border-gray-300 text-[#0071e3]"
                                />
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-xl bg-[#f5f5f7] border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                    {prod.imageUrl ? (
                                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <Package className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer" onClick={() => openEditProductModal(prod)}>
                                      {prod.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-[#0071e3] font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                        SKU: {prod.sku}
                                      </span>
                                      <span className="text-[10px] text-[#86868b] font-mono">
                                        📅 {prod.publishAt}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  <span className="font-semibold text-[#1d1d1f]">
                                    {prod.variants ? `${prod.variants.length} biến thể` : '1 biến thể chuẩn'}
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {prod.variants?.slice(0, 2).map((v: any) => (
                                      <span key={v.sku} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-gray-100 text-[#6e6e73]">
                                        {v.name} (Tồn: {v.stock})
                                      </span>
                                    ))}
                                    {prod.variants && prod.variants.length > 2 && (
                                      <span className="text-[9px] text-[#86868b]">+{prod.variants.length - 2} khác</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono">
                                <span className="font-bold text-[#1d1d1f]">${Number(prod.price).toFixed(2)}</span>
                                <div className="text-[10px] text-[#86868b]">
                                  Gốc: <span className="line-through">${prod.originalPrice || Math.round(Number(prod.price) * 1.15)}</span> • Vốn: ${prod.costPrice || Math.round(Number(prod.price) * 0.75)}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-[#6e6e73] font-mono">
                                <p className="font-bold text-[#1d1d1f]">{prod.weightGrams || 220}g</p>
                                <p className="text-[10px] text-[#86868b]">
                                  {typeof prod.dimensions === 'string' ? prod.dimensions : '15 x 8 x 2 cm'}
                                </p>
                              </td>
                              <td className="py-3.5 px-4 font-mono">
                                <span className={`font-bold ${prod.stock <= 10 ? 'text-rose-600' : 'text-emerald-700'}`}>
                                  {prod.stock} cái
                                </span>
                                <p className="text-[10px] text-[#86868b]">An toàn: {Math.floor(prod.stock * 0.9)}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                {prod.stock > 0 ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ĐANG BÁN (ACTIVE)
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                    NGỪNG BÁN (ARCHIVED)
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => openEditProductModal(prod)}
                                  className="px-3 py-1.5 bg-[#f5f5f7] hover:bg-gray-200 text-[#1d1d1f] rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Sửa &amp; Biến Thể</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: CÂY DANH MỤC ĐA CẤP (MULTI-LEVEL TREE) */}
            {productSubTab === 'categories' && (
              <div className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-[#0071e3]" />
                      <span>Cấu Trúc Cây Danh Mục Nhiều Cấp (Hierarchical Categories)</span>
                    </h3>
                    <p className="text-xs text-[#6e6e73]">
                      Cấu trúc phân cấp 3 tầng (Root &rarr; Nhóm danh mục &rarr; Danh mục con). Nhấn mũi tên để sắp xếp thứ tự hiển thị.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {categoryTree.map((cat, idx) => (
                    <div key={cat.id} className="p-4 bg-[#f5f5f7] border border-gray-200 rounded-2xl space-y-3 text-xs">
                      <div className="flex items-center justify-between font-bold text-sm text-[#1d1d1f]">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0071e3] flex items-center justify-center text-xs font-mono font-bold">
                            {idx + 1}
                          </span>
                          <span>{cat.name}</span>
                          <span className="text-xs text-[#6e6e73] font-normal font-mono">({cat.productCount} sản phẩm)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveCategory(cat.id, 'UP')}
                            disabled={idx === 0}
                            className="p-1 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 disabled:opacity-30"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveCategory(cat.id, 'DOWN')}
                            disabled={idx === categoryTree.length - 1}
                            className="p-1 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 disabled:opacity-30"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Children Level 2 */}
                      {cat.children && (
                        <div className="pl-6 border-l-2 border-gray-300 space-y-2">
                          {cat.children.map((sub: any) => (
                            <div key={sub.id} className="p-2.5 bg-white rounded-xl border border-gray-200/80 space-y-1">
                              <div className="flex items-center justify-between font-semibold text-xs text-[#1d1d1f]">
                                <span>{sub.name}</span>
                                <span className="font-mono text-[11px] text-[#86868b]">{sub.productCount} SP</span>
                              </div>
                              {/* Children Level 3 */}
                              {sub.children && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {sub.children.map((leaf: any) => (
                                    <span key={leaf.id} className="px-2 py-0.5 bg-blue-50 text-[#0071e3] border border-blue-200 rounded text-[10px] font-medium">
                                      {leaf.name} ({leaf.productCount})
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: QUẢN LÝ THƯƠNG HIỆU (BRANDS) */}
            {productSubTab === 'brands' && (
              <div className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#0071e3]" />
                      <span>Danh Sách Thương Hiệu Ủy Quyền (Brands Directory)</span>
                    </h3>
                    <p className="text-xs text-[#6e6e73]">
                      Thương hiệu chính hãng, logo nhận diện, trang giới thiệu riêng và số lượng SKU liên kết.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brands.map((br) => (
                    <div key={br.id} className="p-5 bg-[#f5f5f7] border border-gray-200 rounded-2xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{br.logo}</span>
                          <div>
                            <p className="font-bold text-sm text-[#1d1d1f]">{br.name}</p>
                            <p className="text-[11px] text-[#6e6e73]">{br.origin}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ỦY QUYỀN CHÍNH THỨC
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6e6e73] leading-relaxed">{br.description}</p>
                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-[#1d1d1f] font-semibold">{br.productCount} sản phẩm trên kệ</span>
                        <a href={br.website} target="_blank" rel="noreferrer" className="text-[#0071e3] font-semibold hover:underline flex items-center gap-1">
                          <span>Trang thương hiệu</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: BỘ THUỘC TÍNH BỘ LỌC (ATTRIBUTES) */}
            {productSubTab === 'attributes' && (
              <div className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                      <ListFilter className="w-4 h-4 text-purple-600" />
                      <span>Bộ Thuộc Tính Bộ Lọc Khách Hàng (Custom Attribute Sets)</span>
                    </h3>
                    <p className="text-xs text-[#6e6e73]">
                      Được gán theo từng loại sản phẩm (Điện tử vs Thời trang) để khách hàng lọc chính xác: Chất liệu, Xuất xứ, Dung lượng, Bảo hành... Bật/Tắt bộ lọc để cập nhật trực tiếp lên Storefront.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNewAttrModalOpen(true)}
                    className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Thuộc Tính Mới</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {attributeGroups.map((group) => (
                    <div key={group.categoryType} className="p-5 bg-[#f5f5f7] border border-gray-200 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <span className="font-bold text-sm text-[#1d1d1f]">{group.categoryType}</span>
                        <span className="text-xs text-[#0071e3] font-semibold">{group.attributes.length} Thuộc tính</span>
                      </div>
                      <div className="space-y-3">
                        {group.attributes.map((attr: any) => (
                          <div key={attr.name} className="p-3.5 bg-white rounded-xl border border-gray-200/80 space-y-2 text-xs shadow-xs">
                            <div className="flex items-center justify-between font-semibold text-[#1d1d1f]">
                              <span className="font-bold text-sm">{attr.name}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleAttributeFilter(group.categoryType, attr.name, attr.isFilter)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                                  attr.isFilter
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200'
                                }`}
                                title={attr.isFilter ? 'Bấm để tắt bộ lọc này khỏi Storefront' : 'Bấm để bật bộ lọc này lên Storefront'}
                              >
                                <span className={`w-2 h-2 rounded-full ${attr.isFilter ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                                <span>{attr.isFilter ? 'BẬT BỘ LỌC' : 'ĐÃ TẮT BỘ LỌC'}</span>
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {attr.options.map((opt: string) => (
                                <span key={opt} className="px-2.5 py-1 bg-[#f5f5f7] text-[#1d1d1f] rounded-lg text-[11px] border border-gray-200 font-medium">
                                  {opt}
                                </span>
                              ))}
                              <input
                                type="text"
                                placeholder="+ Tùy chọn mới (Enter)..."
                                className="px-2.5 py-1 bg-white border border-dashed border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#0071e3] w-36"
                                onKeyDown={async (e) => {
                                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                    const val = e.currentTarget.value.trim();
                                    e.currentTarget.value = '';
                                    await handleAddOptionToAttribute(group.categoryType, attr.name, val);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 5: HÀNG ĐỢI BATCH QUEUE JOBS */}
            {productSubTab === 'batch_jobs' && (
              <div className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#0071e3]" />
                      <span>Tiến Trình Xử Lý Hàng Loạt (BullMQ Background Worker)</span>
                    </h3>
                    <p className="text-xs text-[#6e6e73]">
                      Xử lý ngầm các file CSV lớn và lệnh đổi giá/trạng thái hàng loạt không làm nghẽn Server.
                    </p>
                  </div>
                </div>

                {batchJob ? (
                  <div className="p-5 bg-[#f5f5f7] border border-gray-200 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#1d1d1f]">{batchJob.jobId}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          batchJob.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-[#0071e3] border border-blue-200 animate-pulse'
                        }`}>
                          {batchJob.status}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm text-[#0071e3]">{batchJob.progress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0071e3] transition-all duration-500 rounded-full"
                        style={{ width: `${batchJob.progress}%` }}
                      />
                    </div>

                    {/* Worker Console Output */}
                    <div className="p-3 bg-[#1d1d1f] text-emerald-400 font-mono text-[11px] rounded-xl space-y-1">
                      {batchJob.logs.map((log, i) => (
                        <p key={i}>&gt; {log}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#f5f5f7] rounded-2xl text-xs text-[#86868b] space-y-2">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="font-semibold text-[#1d1d1f]">Hiện tại không có tác vụ nền nào đang chạy</p>
                    <p>Hãy chọn sản phẩm ở tab Kệ Hàng và chọn "Sửa Hàng Loạt" để kích hoạt worker.</p>
                  </div>
                )}
              </div>
            )}
          </div>
  );
};
