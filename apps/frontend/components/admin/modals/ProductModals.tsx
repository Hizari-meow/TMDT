'use client';

import React from 'react';

import {
  Package,
  Trash2,
  FileText,
  Layers,
  Globe,
  Sparkles,
  X,
  ListFilter,
  Image as ImageIcon
} from 'lucide-react';
import { useAdminContext } from '@/components/admin/AdminContext';

export const ProductModals: React.FC = () => {
  const {
    dbCategories,
    isNewAttrModalOpen,
    setIsNewAttrModalOpen,
    newAttrForm,
    setNewAttrForm,
    selectedProductIds,
    isProductModalOpen,
    setIsProductModalOpen,
    isEditMode,
    activeModalTab,
    setActiveModalTab,
    isBatchProductModalOpen,
    setIsBatchProductModalOpen,
    isCsvImportModalOpen,
    setIsCsvImportModalOpen,
    productForm,
    setProductForm,
    batchProductForm,
    setBatchProductForm,
    csvValidationResult,
    fetchData,
    showToast,
    handleGenerateVariantMatrix,
    handleSaveProduct,
    handleSoftDelete,
    handleCreateAttribute,
    handleExecuteBatchUpdate
  } = useAdminContext();

  return (
    <>
            {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl z-10 text-[#1d1d1f] my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#0071e3]" />
                <h3 className="text-base font-bold text-[#1d1d1f]">
                  {isEditMode ? `Chỉnh Sửa Sản Phẩm: ${productForm.name}` : 'Thêm Sản Phẩm Mới & Tạo Biến Thể'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleSoftDelete(productForm.id, productForm.name)}
                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Mềm (Soft Delete)</span>
                  </button>
                )}
                <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-black p-1">
                  ✕
                </button>
              </div>
            </div>

            {/* 5 Modal Tabs Selector */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-2 text-xs font-semibold overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'basic', label: '1. Thông Tin Cơ Bản & Trạng Thái', icon: FileText },
                { id: 'variants', label: '2. Ma Trận Biến Thể (Màu x Size)', icon: Layers },
                { id: 'attributes', label: '3. Danh Mục, Thương Hiệu & Thuộc Tính', icon: ListFilter },
                { id: 'media', label: '4. Hình Ảnh & Tối Ưu CDN', icon: ImageIcon },
                { id: 'seo', label: '5. SEO Schema.org & SERP', icon: Globe },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeModalTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveModalTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                      active ? 'bg-[#0071e3] text-white shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Content - Scrollable */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              {/* TAB 1: THÔNG TIN CƠ BẢN */}
              {activeModalTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Tên sản phẩm chính thức</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1d1d1f]"
                      />
                    </div>
                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Mã SKU chính (Product Master SKU)</label>
                      <input
                        type="text"
                        required
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3.5 py-2 font-mono text-[#1d1d1f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#1d1d1f] block mb-1 font-semibold">Mô tả ngắn (Short description)</label>
                    <input
                      type="text"
                      value={productForm.shortDescription}
                      onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1d1d1f]"
                    />
                  </div>

                  <div>
                    <label className="text-[#1d1d1f] block mb-1 font-semibold">Mô tả chi tiết (Long rich description)</label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1d1d1f]"
                    />
                  </div>

                  {/* Giá bán, giá gốc, giá vốn */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Giá bán chính thức ($)</label>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-mono text-[#1d1d1f]"
                      />
                    </div>
                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Giá niêm yết gốc ($)</label>
                      <input
                        type="number"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-mono text-[#1d1d1f]"
                      />
                    </div>
                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Giá vốn nhập hàng - COGS ($)</label>
                      <input
                        type="number"
                        value={productForm.costPrice}
                        onChange={(e) => setProductForm({ ...productForm, costPrice: Number(e.target.value) })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-mono text-[#1d1d1f]"
                      />
                    </div>
                  </div>

                  {/* Vận chuyển & Kích thước kiện hàng */}
                  <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-gray-200/80 space-y-3">
                    <span className="font-bold text-[#1d1d1f] block">Thông Số Kiện Hàng Tính Cước Vận Chuyển</span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[#6e6e73] block mb-1">Trọng lượng (grams)</label>
                        <input
                          type="number"
                          value={productForm.weightGrams}
                          onChange={(e) => setProductForm({ ...productForm, weightGrams: Number(e.target.value) })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-mono text-[#1d1d1f]"
                        />
                      </div>
                      <div>
                        <label className="text-[#6e6e73] block mb-1">Dài (cm)</label>
                        <input
                          type="number"
                          value={productForm.dimensions.length}
                          onChange={(e) => setProductForm({ ...productForm, dimensions: { ...productForm.dimensions, length: Number(e.target.value) } })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-mono text-[#1d1d1f]"
                        />
                      </div>
                      <div>
                        <label className="text-[#6e6e73] block mb-1">Rộng (cm)</label>
                        <input
                          type="number"
                          value={productForm.dimensions.width}
                          onChange={(e) => setProductForm({ ...productForm, dimensions: { ...productForm.dimensions, width: Number(e.target.value) } })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-mono text-[#1d1d1f]"
                        />
                      </div>
                      <div>
                        <label className="text-[#6e6e73] block mb-1">Cao (cm)</label>
                        <input
                          type="number"
                          value={productForm.dimensions.height}
                          onChange={(e) => setProductForm({ ...productForm, dimensions: { ...productForm.dimensions, height: Number(e.target.value) } })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-mono text-[#1d1d1f]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trạng thái 4 loại & Hẹn giờ đăng bán */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Trạng thái bán hàng</label>
                      <select
                        value={productForm.status}
                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value as any })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-medium"
                      >
                        <option value="ACTIVE">Đang bán (Hiển thị trực tiếp cho khách mua)</option>
                        <option value="DRAFT">Bản nháp (Lưu trữ nội bộ chưa công khai)</option>
                        <option value="HIDDEN">Ẩn (Không xuất hiện trên kệ tìm kiếm)</option>
                        <option value="ARCHIVED">Ngừng kinh doanh (Xóa mềm - lưu vết đơn cũ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Lịch hẹn giờ đăng bán (Publish Schedule)</label>
                      <input
                        type="datetime-local"
                        value={productForm.publishAt}
                        onChange={(e) => setProductForm({ ...productForm, publishAt: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MA TRẬN BIẾN THỂ (MÀU X SIZE / DUNG LƯỢNG) */}
              {activeModalTab === 'variants' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
                    <span className="font-bold text-[#0071e3] block">Bộ Sinh Tổ Hợp Ma Trận Biến Thể Tự Động</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[#1d1d1f] block mb-1 font-semibold">Nhóm thuộc tính 1 (Ví dụ: Màu sắc)</label>
                        <input
                          type="text"
                          value={productForm.variantOption1Values}
                          onChange={(e) => setProductForm({ ...productForm, variantOption1Values: e.target.value })}
                          placeholder="Đỏ, Xanh, Đen, Titan Tự Nhiên..."
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f]"
                        />
                      </div>
                      <div>
                        <label className="text-[#1d1d1f] block mb-1 font-semibold">Nhóm thuộc tính 2 (Ví dụ: Size / Dung lượng)</label>
                        <input
                          type="text"
                          value={productForm.variantOption2Values}
                          onChange={(e) => setProductForm({ ...productForm, variantOption2Values: e.target.value })}
                          placeholder="S, M, L hoặc 128GB, 256GB, 512GB..."
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f]"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateVariantMatrix}
                      className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sinh Ma Trận Tổ Hợp Tự Động</span>
                    </button>
                  </div>

                  {/* Bảng chi tiết từng biến thể */}
                  <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200">
                        <tr>
                          <th className="py-2.5 px-3">Tên Biến Thể</th>
                          <th className="py-2.5 px-3">Mã SKU Riêng</th>
                          <th className="py-2.5 px-3">Giá Bán ($)</th>
                          <th className="py-2.5 px-3">Giá Vốn ($)</th>
                          <th className="py-2.5 px-3">Tồn Kho</th>
                          <th className="py-2.5 px-3 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {productForm.variants.map((v, i) => (
                          <tr key={v.id || i} className="hover:bg-gray-50/80">
                            <td className="py-2 px-3 font-semibold text-[#1d1d1f]">{v.name}</td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={v.sku}
                                onChange={(e) => {
                                  const updated = [...productForm.variants];
                                  updated[i].sku = e.target.value;
                                  setProductForm({ ...productForm, variants: updated });
                                }}
                                className="bg-white border border-gray-200 rounded-lg px-2 py-1 font-mono text-[11px] w-36"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                value={v.price}
                                onChange={(e) => {
                                  const updated = [...productForm.variants];
                                  updated[i].price = Number(e.target.value);
                                  setProductForm({ ...productForm, variants: updated });
                                }}
                                className="bg-white border border-gray-200 rounded-lg px-2 py-1 font-mono text-[11px] w-20"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                value={v.costPrice}
                                onChange={(e) => {
                                  const updated = [...productForm.variants];
                                  updated[i].costPrice = Number(e.target.value);
                                  setProductForm({ ...productForm, variants: updated });
                                }}
                                className="bg-white border border-gray-200 rounded-lg px-2 py-1 font-mono text-[11px] w-20"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                value={v.stock}
                                onChange={(e) => {
                                  const updated = [...productForm.variants];
                                  updated[i].stock = Number(e.target.value);
                                  setProductForm({ ...productForm, variants: updated });
                                }}
                                className="bg-white border border-gray-200 rounded-lg px-2 py-1 font-mono text-[11px] w-16"
                              />
                            </td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = productForm.variants.filter((_, idx) => idx !== i);
                                  setProductForm({ ...productForm, variants: updated });
                                }}
                                className="text-rose-600 hover:text-rose-800 p-1"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: DANH MỤC, THƯƠNG HIỆU & THUỘC TÍNH */}
              {activeModalTab === 'attributes' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Chọn Danh Mục</label>
                      <select
                        value={productForm.categoryId}
                        onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f] font-medium"
                      >
                        {dbCategories.length === 0 ? (
                          <option value="">Đang tải danh mục...</option>
                        ) : (
                          dbCategories.map((c: any) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.slug})
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Chọn Thương Hiệu</label>
                      <select
                        value={productForm.brandName}
                        onChange={(e) => setProductForm({ ...productForm, brandName: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                      >
                        <option value="Apple Inc.">Apple Inc. (Ủy quyền chính thức)</option>
                        <option value="Sony Corporation">Sony Corporation</option>
                        <option value="Marshall Headphones">Marshall Headphones</option>
                        <option value="Belkin International">Belkin International</option>
                      </select>
                    </div>
                  </div>

                  {/* Attributes Table */}
                  <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-gray-200/80 space-y-3">
                    <span className="font-bold text-[#1d1d1f] block">Gán Bộ Thuộc Tính Dùng Tạo Bộ Lọc Bên Khách Mua</span>
                    <div className="space-y-2">
                      {productForm.attributes.map((attr, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={attr.name}
                            onChange={(e) => {
                              const updated = [...productForm.attributes];
                              updated[idx].name = e.target.value;
                              setProductForm({ ...productForm, attributes: updated });
                            }}
                            className="w-1/3 bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-semibold text-[#1d1d1f]"
                          />
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) => {
                              const updated = [...productForm.attributes];
                              updated[idx].value = e.target.value;
                              setProductForm({ ...productForm, attributes: updated });
                            }}
                            className="w-2/3 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[#1d1d1f]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: HÌNH ẢNH & TỐI ƯU CDN WEBP */}
              {activeModalTab === 'media' && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-800">Hệ Thống Tự Động Nén &amp; Chuyển Định Dạng WebP</p>
                      <p className="text-[11px] text-emerald-700">Tự động sinh 3 kích cỡ: Thumbnail (150x150), Medium (600x600), Large (1200x1200) lưu trên S3/Cloudflare CDN.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">
                      CDN ACTIVE
                    </span>
                  </div>

                  <div className="space-y-3">
                    {productForm.media.map((img, i) => (
                      <div key={i} className="p-3 bg-[#f5f5f7] rounded-xl border border-gray-200 flex items-center gap-3">
                        <img src={img.url} alt={img.alt} className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0" />
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={img.url}
                            onChange={(e) => {
                              const updated = [...productForm.media];
                              updated[i].url = e.target.value;
                              setProductForm({ ...productForm, media: updated });
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-[11px]"
                          />
                          <input
                            type="text"
                            placeholder="Thẻ Alt cho ảnh (SEO & Accessibility)..."
                            value={img.alt}
                            onChange={(e) => {
                              const updated = [...productForm.media];
                              updated[i].alt = e.target.value;
                              setProductForm({ ...productForm, media: updated });
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-[11px]"
                          />
                        </div>
                        <div className="text-right shrink-0">
                          {img.isCover ? (
                            <span className="px-2 py-1 bg-[#0071e3] text-white rounded text-[10px] font-bold">
                              ẢNH BÌA
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = productForm.media.map((m, idx) => ({ ...m, isCover: idx === i }));
                                setProductForm({ ...productForm, media: updated });
                              }}
                              className="px-2 py-1 bg-white hover:bg-gray-100 text-[#1d1d1f] border border-gray-200 rounded text-[10px] font-semibold"
                            >
                              Đặt Làm Bìa
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SEO CHUYÊN SÂU & SERP PREVIEW */}
              {activeModalTab === 'seo' && (
                <div className="space-y-4">
                  {/* Google SERP Preview */}
                  <div className="p-4 bg-white border border-gray-300 rounded-2xl shadow-xs space-y-1">
                    <span className="text-[10px] text-[#6e6e73] font-bold uppercase tracking-wider block">Xem Trước Kết Quả Tìm Kiếm Google (SERP Preview)</span>
                    <p className="text-[#1a0dab] hover:underline font-semibold text-sm cursor-pointer truncate">
                      {productForm.seoTitle || productForm.name}
                    </p>
                    <p className="text-[#006621] text-[11px] font-mono truncate">
                      https://techzone.vn/products/{productForm.slug}
                    </p>
                    <p className="text-[#545454] text-xs line-clamp-2 leading-relaxed">
                      {productForm.seoDescription}
                    </p>
                  </div>

                  <div>
                    <label className="text-[#1d1d1f] block mb-1 font-semibold">Thẻ Tiêu Đề (Meta Title)</label>
                    <input
                      type="text"
                      value={productForm.seoTitle}
                      onChange={(e) => setProductForm({ ...productForm, seoTitle: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1d1d1f]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#1d1d1f] font-semibold">Thẻ Mô Tả (Meta Description)</label>
                      <span className="text-[11px] font-mono text-[#86868b]">{productForm.seoDescription.length}/160 ký tự</span>
                    </div>
                    <textarea
                      rows={2}
                      value={productForm.seoDescription}
                      onChange={(e) => setProductForm({ ...productForm, seoDescription: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1d1d1f]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Đường dẫn thân thiện (Slug)</label>
                      <input
                        type="text"
                        value={productForm.slug}
                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3.5 py-2 font-mono text-[#1d1d1f]"
                      />
                    </div>
                    <div>
                      <label className="text-[#1d1d1f] block mb-1 font-semibold">Canonical URL</label>
                      <input
                        type="text"
                        value={productForm.canonicalUrl}
                        onChange={(e) => setProductForm({ ...productForm, canonicalUrl: e.target.value })}
                        className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3.5 py-2 font-mono text-[#1d1d1f]"
                      />
                    </div>
                  </div>

                  {/* Schema.org JSON-LD preview */}
                  <div className="p-3 bg-[#1d1d1f] text-emerald-400 rounded-xl font-mono text-[10px] space-y-1">
                    <span className="text-gray-400 block">// Dữ liệu có cấu trúc Schema.org Product (JSON-LD)</span>
                    <pre className="overflow-x-auto">
{JSON.stringify(
  {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productForm.name,
    sku: productForm.sku,
    image: [productForm.media[0]?.url],
    description: productForm.description,
    brand: { '@type': 'Brand', name: productForm.brandName },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: productForm.price,
      availability: productForm.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  },
  null,
  2
)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  {isEditMode ? 'Lưu Thay Đổi Sản Phẩm' : 'Đăng Sản Phẩm & Kích Hoạt Kệ Hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.1. MODAL: CẬP NHẬT HÀNG LOẠT (BATCH UPDATE FORM)                   */}
      {/* =================================================================== */}

      {isBatchProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsBatchProductModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xl z-10 text-[#1d1d1f]">
            <h3 className="text-base font-bold text-[#1d1d1f]">
              Cập Nhật Hàng Loạt ({selectedProductIds.length} sản phẩm)
            </h3>

            <form onSubmit={handleExecuteBatchUpdate} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#1d1d1f] block mb-1 font-semibold">Hành động áp dụng</label>
                <select
                  value={batchProductForm.action}
                  onChange={(e) => setBatchProductForm({ ...batchProductForm, action: e.target.value as any })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                >
                  <option value="CHANGE_PRICE">Điều chỉnh giá bán ($)</option>
                  <option value="SET_STOCK">Gán lại số lượng tồn kho</option>
                  <option value="ARCHIVE">Ngừng kinh doanh / Xóa mềm</option>
                </select>
              </div>

              {batchProductForm.action !== 'ARCHIVE' && (
                <div>
                  <label className="text-[#1d1d1f] block mb-1 font-semibold">Giá trị mới áp dụng</label>
                  <input
                    type="number"
                    required
                    value={batchProductForm.value}
                    onChange={(e) => setBatchProductForm({ ...batchProductForm, value: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 font-mono text-[#1d1d1f]"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBatchProductModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs"
                >
                  Đẩy Vào Background Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4.1. MODAL: BÁO CÁO LỖI TỪNG DÒNG FILE CSV (CSV VALIDATION REPORT)   */}
      {/* =================================================================== */}

      {isCsvImportModalOpen && csvValidationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCsvImportModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-2xl z-10 text-[#1d1d1f] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0071e3]" />
                <h3 className="font-bold text-sm">Báo Cáo Kiểm Tra Lỗi Dòng: {csvValidationResult.filename}</h3>
              </div>
              <button onClick={() => setIsCsvImportModalOpen(false)} className="text-gray-400 hover:text-black">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs shrink-0">
              <div className="p-3 bg-[#f5f5f7] rounded-xl space-y-1">
                <span className="text-[#6e6e73]">Tổng số dòng đọc được:</span>
                <p className="text-lg font-bold font-mono text-[#1d1d1f]">{csvValidationResult.totalRows} dòng</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-emerald-700">Dòng hợp lệ sẵn sàng import:</span>
                <p className="text-lg font-bold font-mono text-emerald-700">{csvValidationResult.validRows} dòng</p>
              </div>
            </div>

            {/* Chi tiết từng dòng */}
            <div className="border border-gray-200 rounded-2xl overflow-y-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f5f5f7] text-[#6e6e73] border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Dòng</th>
                    <th className="py-2 px-3">Mã SKU</th>
                    <th className="py-2 px-3">Trạng Thái</th>
                    <th className="py-2 px-3">Nội Dung Kiểm Tra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  {csvValidationResult.detailedReport?.map((row, idx) => (
                    <tr key={idx} className={row.status === 'ERROR' ? 'bg-rose-50/50' : ''}>
                      <td className="py-2 px-3 font-bold">{row.line}</td>
                      <td className="py-2 px-3">{row.sku}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.status === 'VALID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : row.status === 'WARNING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-sans text-xs text-[#1d1d1f]">{row.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsCsvImportModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] rounded-xl text-xs font-semibold"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                disabled={csvValidationResult.validRows === 0}
                onClick={() => {
                  showToast(`Đã import thành công ${csvValidationResult.validRows} sản phẩm vào database!`);
                  setIsCsvImportModalOpen(false);
                  fetchData();
                }}
                className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
              >
                Xác Nhận Lưu Vào Kệ Hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 6: Tạo Phiếu Kho & Ghi Sổ Cái                                 */}
      {/* =================================================================== */}

      {isNewAttrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-[#1d1d1f]">Thêm Thuộc Tính Bộ Lọc Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewAttrModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAttribute} className="space-y-4 text-xs">
              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Loại Ngành Hàng Sản Phẩm</label>
                <select
                  value={newAttrForm.categoryType}
                  onChange={(e) => setNewAttrForm({ ...newAttrForm, categoryType: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                >
                  <option value="Thiết Bị Điện Tử & Di Động">Thiết Bị Điện Tử & Di Động</option>
                  <option value="Thời Trang & Phụ Kiện Thể Thao">Thời Trang & Phụ Kiện Thể Thao</option>
                </select>
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Tên Thuộc Tính (Ví dụ: Chất liệu, Xuất xứ, Dung lượng, Bảo hành)</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên thuộc tính..."
                  value={newAttrForm.name}
                  onChange={(e) => setNewAttrForm({ ...newAttrForm, name: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="text-[#1d1d1f] font-semibold block mb-1">Các Tùy Chọn (Phân cách bằng dấu phẩy)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ví dụ: Cotton 100%, Spandex, Vải Dệt, Polyester..."
                  value={newAttrForm.options}
                  onChange={(e) => setNewAttrForm({ ...newAttrForm, options: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-2 text-[#1d1d1f]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="attrIsFilterCheck"
                  checked={newAttrForm.isFilter}
                  onChange={(e) => setNewAttrForm({ ...newAttrForm, isFilter: e.target.checked })}
                  className="rounded border-gray-300 text-[#0071e3]"
                />
                <label htmlFor="attrIsFilterCheck" className="text-[#1d1d1f] font-medium cursor-pointer">
                  Kích hoạt làm bộ lọc trực tiếp trên Storefront cho khách mua hàng
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewAttrModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold rounded-xl shadow-xs"
                >
                  Lưu Thuộc Tính
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL HỒ SƠ KHÁCH HÀNG 360° (CRM 4.4)                               */}
      {/* =================================================================== */}


    </>
  );
};
