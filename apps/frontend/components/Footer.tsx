'use client';

import React from 'react';
import Link from 'next/link';
import {
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  PhoneCall,
  MapPin,
  Mail,
  ExternalLink,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#16181b] text-gray-300 pt-16 pb-12 mt-16 border-t border-gray-800">
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 space-y-12">
        {/* Top Feature Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-[#0071e3]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-white">100% Chính Hãng</h5>
              <p className="text-[11px] text-gray-400">Ủy quyền Apple &amp; Thể thao</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-white">Giao Hỏa Tốc 2H</h5>
              <p className="text-[11px] text-gray-400">Miễn phí toàn quốc từ $50</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-white">Đổi Trả 30 Ngày</h5>
              <p className="text-[11px] text-gray-400">1 đổi 1 tận nơi nếu lỗi NSX</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-white">Trả Góp 0% Lãi Suất</h5>
              <p className="text-[11px] text-gray-400">Hỗ trợ Apple Pay &amp; Thẻ tín dụng</p>
            </div>
          </div>
        </div>

        {/* Main 4-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-xl bg-[#0071e3] text-white flex items-center justify-center font-black shadow-md">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight">TECHZONE</span>
                <span className="text-[10px] text-gray-400 block leading-none">
                  Apple Authorised Reseller
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Hệ thống bán lẻ &amp; thương mại điện tử chuyên phân phối thiết bị công nghệ Apple chính hãng và
              dòng sản phẩm thời trang thể thao cao cấp. Trải nghiệm mua sắm bảo mật, tốc độ cao với kiến trúc
              xử lý đơn hàng đồng thời đạt chuẩn quốc tế.
            </p>
            <div className="text-xs text-gray-400 space-y-1.5 pt-1">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0071e3] mt-0.5 flex-shrink-0" />
                <span>Trụ sở chính: 240 Nguyễn Thị Minh Khai, Q.3, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Tổng đài miễn phí: 1800 6868 (8:00 - 22:00)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Hộp thư CSKH: cskh@techzone.vn</span>
              </p>
            </div>
          </div>

          {/* Col 2: Customer Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Chính Sách &amp; Quy Định
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Chính sách bảo hành 12 tháng Apple AASP
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Chính sách giao hàng hỏa tốc 2 giờ nội thành
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Quy định đổi trả 30 ngày &amp; hoàn tiền minh bạch
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Chính sách bảo mật thông tin chuẩn PCI DSS
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Hướng dẫn tra cứu tiến trình đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Showroom Experience Stores */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Hệ Thống Showroom Trải Nghiệm
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="font-semibold text-white block">Flagship Store TP.HCM</span>
                <span className="text-[11px] text-gray-400">240 Nguyễn Thị Minh Khai, P. Võ Thị Sáu, Q.3</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="font-semibold text-white block">Showroom Flagship Hà Nội</span>
                <span className="text-[11px] text-gray-400">128 Thái Hà, P. Trung Liệt, Q. Đống Đa</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="font-semibold text-white block">Showroom Miền Trung - Đà Nẵng</span>
                <span className="text-[11px] text-gray-400">56 Nguyễn Văn Linh, Q. Hải Châu</span>
              </div>
            </div>
          </div>

          {/* Col 4: Payments & Trust Credentials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Phương Thức Thanh Toán
            </h4>
            <p className="text-xs text-gray-400">
              Hỗ trợ đa dạng phương thức thanh toán an toàn, bảo mật tiêu chuẩn quốc tế.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-white/10 font-bold text-white">Apple Pay</div>
              <div className="p-2 rounded-xl bg-white/10 font-bold text-white">Visa/Master</div>
              <div className="p-2 rounded-xl bg-white/10 font-bold text-white">VNPay QR</div>
              <div className="p-2 rounded-xl bg-white/10 font-bold text-white">MoMo</div>
              <div className="p-2 rounded-xl bg-white/10 font-bold text-white">Trả Góp 0%</div>
              <div className="p-2 rounded-xl bg-white/10 font-bold text-white">COD Nhận Hàng</div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full font-semibold border border-emerald-800/80 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chứng nhận Đã Đăng Ký Bộ Công Thương</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Credentials */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 TechZone Enterprise E-Commerce Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/admin" className="hover:text-white transition-colors">
              Kênh Quản Trị Hệ Thống
            </Link>
            <span>•</span>
            <Link href="/orders" className="hover:text-white transition-colors">
              Đơn Hàng Của Tôi
            </Link>
            <span>•</span>
            <Link href="/profile" className="hover:text-white transition-colors">
              Hồ Sơ Khách Hàng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
