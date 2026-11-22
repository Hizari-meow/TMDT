'use client';

import React from 'react';
import { X, Check, Star, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  onRemoveProduct: (productId: string) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
}) => {
  const { addItem } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 space-y-6 max-h-[90vh] flex flex-col text-[#1d1d1f]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-gray-100 text-[#1d1d1f] border border-gray-200 font-semibold tracking-wider">
              So Sánh Thiết Bị
            </span>
            <h3 className="text-lg font-bold text-[#1d1d1f] mt-1.5">
              Bảng So Sánh Thông Số ({products.length}/4)
            </h3>
            <p className="text-xs text-[#6e6e73]">
              Đối chiếu chi tiết cấu hình, màn hình, camera, thời lượng pin và mức giá thực tế.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#1d1d1f] rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-x-auto">
          {products.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-sm font-semibold text-[#1d1d1f]">Chưa có sản phẩm nào trong danh sách so sánh</p>
              <p className="text-xs text-[#86868b]">
                Hãy nhấn nút "So sánh" trên các sản phẩm để đối chiếu thông số cạnh nhau.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-4 w-40 text-[#86868b] uppercase tracking-wider text-[10px] font-mono border-b border-gray-100">
                    Tiêu chí
                  </th>
                  {products.map((p) => (
                    <th key={p.id} className="py-4 px-4 min-w-[220px] border-b border-gray-100 align-top">
                      <div className="space-y-3">
                        <div className="w-full aspect-square max-w-[120px] mx-auto bg-[#f5f5f7] rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1d1d1f] line-clamp-1">{p.name}</p>
                          <p className="text-sm font-bold text-red-600 tracking-tight mt-1 font-mono">
                            ${Number(p.price).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              addItem({
                                productId: p.id,
                                name: p.name,
                                price: Number(p.price),
                                imageUrl: p.imageUrl,
                                categoryName: p.category?.name,
                                quantity: 1,
                              });
                            }}
                            className="flex-1 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full font-medium text-[11px] flex items-center justify-center gap-1 transition-all shadow-sm"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Mua ngay</span>
                          </button>
                          <button
                            onClick={() => onRemoveProduct(p.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-gray-100 rounded-full transition-colors"
                            title="Xóa khỏi so sánh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#6e6e73]">Đánh giá sao</td>
                  {products.map((p) => (
                    <td key={p.id} className="py-3 px-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>4.9 / 5.0</span>
                        <span className="text-[#86868b] font-normal text-[11px]">(1.2k+ lượt mua)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#6e6e73]">Chất liệu &amp; Gia công</td>
                  {products.map((p) => {
                    const attr = p.attributes?.find((a: any) => a.name.toLowerCase().includes('chất liệu'))?.value;
                    return (
                      <td key={p.id} className="py-3 px-4 text-[#1d1d1f] font-medium">
                        {attr || (p.name.includes('iPhone') || p.name.includes('Watch') ? 'Titanium Hàng Không Cấp 5' : 'Hợp kim cao cấp')}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#6e6e73]">Xuất xứ sản xuất</td>
                  {products.map((p) => {
                    const attr = p.attributes?.find((a: any) => a.name.toLowerCase().includes('xuất xứ'))?.value;
                    return (
                      <td key={p.id} className="py-3 px-4 text-[#1d1d1f]">
                        {attr || (p.categoryType?.includes('Thời Trang') ? 'Việt Nam' : 'Mỹ / AASP')}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#6e6e73]">Dung lượng / Kích cỡ</td>
                  {products.map((p) => {
                    const attr = p.attributes?.find((a: any) => a.name.toLowerCase().includes('dung lượng') || a.name.toLowerCase().includes('kích cỡ'))?.value;
                    return (
                      <td key={p.id} className="py-3 px-4 text-[#1d1d1f] font-mono font-medium">
                        {attr || (p.variants?.[0]?.size || 'Tiêu chuẩn')}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#6e6e73]">Vi xử lý / Công nghệ</td>
                  {products.map((p) => {
                    const attr = p.attributes?.find((a: any) => a.name.toLowerCase().includes('chíp'))?.value;
                    return (
                      <td key={p.id} className="py-3 px-4 text-[#1d1d1f]">
                        {attr || (p.name.includes('MacBook') ? 'Apple M3 Max' : p.name.includes('iPhone') ? 'Apple A18 Pro' : 'Công nghệ độc quyền')}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#6e6e73]">Chế độ bảo hành</td>
                  {products.map((p) => {
                    const attr = p.attributes?.find((a: any) => a.name.toLowerCase().includes('bảo hành'))?.value;
                    return (
                      <td key={p.id} className="py-3 px-4 text-[#1d1d1f] font-medium text-emerald-700">
                        {attr || '12 Tháng Chính Hãng 1 Đổi 1'}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#6e6e73]">Tồn kho hiện có</td>
                  {products.map((p) => (
                    <td key={p.id} className="py-3 px-4 font-mono font-bold text-emerald-600">
                      Còn {p.stock} sản phẩm chính hãng VN/A
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
