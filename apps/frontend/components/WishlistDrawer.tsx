'use client';

import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, X, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const { items, removeItem, clearWishlist, isWishlistOpen, setIsWishlistOpen } = useWishlist();
  const { addItem } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col text-[#1d1d1f]">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#1d1d1f]">
                  Danh Sách Quan Tâm ({items.length})
                </h2>
                <p className="text-xs text-[#6e6e73]">Các sản phẩm bạn đã lưu</p>
              </div>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-gray-400 hover:text-[#1d1d1f] rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-[#f5f5f7]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3 text-[#6e6e73]">
                <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <Heart className="w-7 h-7 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[#1d1d1f]">Chưa có sản phẩm nào</h3>
                  <p className="text-xs text-[#86868b] max-w-xs leading-relaxed">
                    Nhấn vào biểu tượng trái tim trên bất kỳ thiết bị nào để lưu vào danh sách quan tâm của bạn.
                  </p>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="mt-2 px-5 py-2 rounded-full bg-[#1d1d1f] text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Khám phá sản phẩm
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="p-3.5 bg-white border border-gray-200 rounded-2xl flex items-center gap-3.5 group hover:border-gray-300 shadow-sm transition-all"
                >
                  {/* Image */}
                  <div className="w-16 h-16 bg-[#f5f5f7] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-1">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No img</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] text-[#86868b] uppercase tracking-wider block truncate">
                      {item.categoryName || 'Apple'}
                    </span>
                    <h4 className="text-xs font-semibold text-[#1d1d1f] truncate">{item.name}</h4>
                    <p className="text-xs font-bold text-red-600 font-mono">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => {
                        addItem({
                          productId: item.productId,
                          name: item.name,
                          price: item.price,
                          imageUrl: item.imageUrl,
                          categoryName: item.categoryName,
                          quantity: 1,
                        });
                        removeItem(item.productId);
                      }}
                      className="px-3 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[11px] font-medium rounded-full transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Thêm</span>
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-[#86868b] hover:text-rose-600 text-center text-[10px] transition-colors"
                      title="Xóa khỏi yêu thích"
                    >
                      Bỏ lưu
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between shadow-lg">
              <button
                onClick={clearWishlist}
                className="text-xs text-[#86868b] hover:text-rose-600 transition-colors font-medium"
              >
                Xóa tất cả ({items.length})
              </button>
              <button
                onClick={() => {
                  items.forEach((item) => {
                    addItem({
                      productId: item.productId,
                      name: item.name,
                      price: item.price,
                      imageUrl: item.imageUrl,
                      categoryName: item.categoryName,
                      quantity: 1,
                    });
                  });
                  clearWishlist();
                  setIsWishlistOpen(false);
                }}
                className="px-5 py-2.5 bg-[#1d1d1f] text-white text-xs font-semibold rounded-full hover:bg-black transition-all active:scale-[0.98] shadow-sm"
              >
                Chuyển tất cả vào giỏ hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
