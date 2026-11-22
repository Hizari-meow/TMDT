'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface FlashSaleCountdownProps {
  endTime?: Date | string;
}

export const FlashSaleCountdown: React.FC<FlashSaleCountdownProps> = ({
  endTime = new Date(Date.now() + 24 * 60 * 60 * 1000),
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; ms: number }>({
    hours: 23,
    minutes: 59,
    seconds: 59,
    ms: 9,
  });

  useEffect(() => {
    const target = new Date(endTime).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const ms = Math.floor((diff % 1000) / 100);

      setTimeLeft({ hours, minutes, seconds, ms });

      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [endTime]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-3 bg-[#f5f5f7] border border-gray-200 px-3.5 py-1.5 rounded-2xl">
      <div className="flex items-center gap-1.5 text-[#6e6e73] font-medium text-xs">
        <Clock className="w-3.5 h-3.5 text-[#86868b]" />
        <span className="hidden sm:inline">Ưu đãi kết thúc sau:</span>
        <span className="sm:hidden">Còn lại:</span>
      </div>

      <div className="flex items-center gap-1 font-mono text-[#1d1d1f] font-semibold text-xs sm:text-sm">
        <div className="bg-white px-2 py-0.5 rounded-lg min-w-[1.8rem] text-center shadow-sm border border-gray-200/60">
          {pad(timeLeft.hours)}
        </div>
        <span className="text-gray-400">:</span>
        <div className="bg-white px-2 py-0.5 rounded-lg min-w-[1.8rem] text-center shadow-sm border border-gray-200/60">
          {pad(timeLeft.minutes)}
        </div>
        <span className="text-gray-400">:</span>
        <div className="bg-white px-2 py-0.5 rounded-lg min-w-[1.8rem] text-center shadow-sm border border-gray-200/60">
          {pad(timeLeft.seconds)}
        </div>
        <span className="text-gray-400 text-xs">.{timeLeft.ms}</span>
      </div>
    </div>
  );
};
