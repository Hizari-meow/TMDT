'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

const FAQ_SUGGESTIONS = [
  'Thời gian giao hàng hỏa tốc 2H?',
  'Chính sách đổi trả 30 ngày & Apple Care?',
  'Hệ thống giữ hàng Flash Sale bảo mật thế nào?',
  'Kiểm tra tình trạng đơn hàng của tôi',
];

export const SupportChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      text: 'Xin chào! Bạn đang kết nối với Chuyên viên Hỗ trợ TechZone. Chúng tôi có thể hỗ trợ bạn thông tin gì về sản phẩm hôm nay?',
      timestamp: 'Vừa xong',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Vừa xong',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'Cảm ơn bạn đã liên hệ! Đội ngũ tư vấn TechZone sẽ phản hồi chi tiết ngay.';
      const lower = text.toLowerCase();

      if (lower.includes('giao hàng') || lower.includes('2h') || lower.includes('hỏa tốc')) {
        reply = 'Dịch vụ Giao Hỏa Tốc 2H áp dụng cho tất cả đơn hàng nội thành Hà Nội & TP. HCM. Đơn hàng đặt trước 18h được giao ngay trong ngày.';
      } else if (lower.includes('đổi trả') || lower.includes('bảo hành') || lower.includes('apple')) {
        reply = 'TechZone cam kết 100% sản phẩm Apple chính hãng VN/A: Bảo hành 12 tháng tại các trung tâm ủy quyền Apple AASP toàn quốc, hỗ trợ 1 đổi 1 trong 30 ngày nếu có lỗi từ nhà sản xuất.';
      } else if (lower.includes('flash sale') || lower.includes('săn') || lower.includes('nghẽn')) {
        reply = 'Hệ thống TechZone áp dụng kiến trúc phân tán với Action Token 30s và Redis Atomic Lua Lock, đảm bảo giao dịch giữ chỗ siêu tốc dưới 50ms mà không nghẽn mạng.';
      } else if (lower.includes('đơn hàng') || lower.includes('kiểm tra') || lower.includes('tra cứu')) {
        reply = 'Bạn có thể chọn mục "Đơn hàng" trên thanh điều hướng để xem chi tiết tiến trình xử lý đơn hàng theo thời gian thực.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `agt-${Date.now()}`,
          sender: 'agent',
          text: reply,
          timestamp: 'Vừa xong',
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Apple-style Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-[#1d1d1f] shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
        title="Trò chuyện với Chuyên viên CSKH"
      >
        <span className="relative flex">
          <MessageSquare className="w-5 h-5 text-[#1d1d1f]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
        </span>
      </button>

      {/* Chat Window Modal: Apple iMessage Style */}
      {isOpen && (
        <div className="fixed bottom-22 left-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[520px] bg-white border border-gray-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0071e3] flex items-center justify-center font-bold text-white text-xs shadow-sm">
                TZ
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1d1d1f]">Chăm Sóc Khách Hàng TechZone</h4>
                <p className="text-[11px] text-[#6e6e73]">Trực tuyến 24/7 • Hỗ trợ chính hãng</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-[#1d1d1f] p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body: Clean iMessage bubbles */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f5f7]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-[#0071e3] text-white rounded-br-sm'
                      : 'bg-white text-[#1d1d1f] rounded-bl-sm border border-gray-200/80'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-[#86868b] mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 bg-white border border-gray-200 rounded-2xl w-fit text-[#86868b] text-xs shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] ml-1">Đang trả lời...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ suggestions */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {FAQ_SUGGESTIONS.map((faq, i) => (
              <button
                key={i}
                onClick={() => handleSend(faq)}
                className="whitespace-nowrap px-3 py-1 bg-[#f5f5f7] hover:bg-gray-200 border border-gray-200 text-[#1d1d1f] text-[11px] rounded-full transition-colors flex-shrink-0 font-medium"
              >
                {faq}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-3.5 py-2.5 bg-[#f5f5f7] border border-gray-200 rounded-full text-xs text-[#1d1d1f] placeholder-[#86868b] outline-none focus:border-[#0071e3] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 text-white rounded-full transition-all flex items-center justify-center shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
