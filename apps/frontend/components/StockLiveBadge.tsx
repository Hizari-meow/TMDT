'use client';

import React from 'react';
import { cn } from '../lib/utils';
import { Zap, AlertCircle } from 'lucide-react';

interface StockLiveBadgeProps {
  stock: number;
  isLoading?: boolean;
}

export const StockLiveBadge: React.FC<StockLiveBadgeProps> = ({ stock, isLoading = false }) => {
  const isSoldOut = stock <= 0;
  const isLowStock = stock > 0 && stock <= 20;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide transition-all duration-300 border shadow-sm',
        isSoldOut
          ? 'bg-rose-50 text-rose-600 border-rose-200'
          : isLowStock
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      )}
    >
      <span className="relative flex h-2 w-2">
        {!isSoldOut && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              isLowStock ? 'bg-amber-400' : 'bg-emerald-400',
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full h-2 w-2',
            isSoldOut ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500',
          )}
        />
      </span>

      {isLoading ? (
        <span className="text-zinc-400">Đang đồng bộ kho...</span>
      ) : isSoldOut ? (
        <span className="flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5" /> Tạm hết hàng
        </span>
      ) : (
        <span className="flex items-center gap-1 font-medium">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Còn {stock} sản phẩm</span>
        </span>
      )}
    </div>
  );
};
