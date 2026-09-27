import React, { useState } from 'react';
import { Language, ScreenType, BoutiqueOrder } from '../types';

interface OrderConfirmationScreenProps {
  order: BoutiqueOrder;
  language: Language;
  onNavigate: (screen: ScreenType) => void;
}

export const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({
  order,
  language,
  onNavigate,
}) => {
  const isRtl = language === 'ar';
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const copyOrderRef = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className={`flex flex-col w-full max-w-4xl mx-auto pb-28 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between py-2 border-b border-[#353437]/40 mb-3">
        <span className="font-sans text-[11px] text-[#f2ca50] uppercase tracking-wider font-bold">
          {isRtl ? 'تأكيد طلب المنتجات' : 'Order Confirmation'}
        </span>
        <button
          onClick={() => onNavigate('shop')}
          className="text-[#d0c5af] hover:text-[#e5e1e4] text-[12px] font-sans font-semibold flex items-center gap-1"
          type="button"
        >
          <span>{isRtl ? 'إغلاق' : 'Done'}</span>
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      {/* Celebration Header */}
      <div className="flex flex-col items-center text-center py-4">
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] flex items-center justify-center shadow-[0_0_35px_rgba(242,202,80,0.4)]">
            <span className="material-symbols-outlined text-[32px]">check_circle</span>
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#47ea7a] ring-2 ring-[#131315] flex items-center justify-center text-[10px] text-[#003915] font-bold">
            ✓
          </span>
        </div>

        <h1 className="font-serif text-[24px] sm:text-[28px] text-[#e5e1e4] font-semibold tracking-tight">
          {isRtl ? 'تم إرسال طلبك بنجاح' : 'Order Sent Successfully'}
        </h1>
        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-[#201f21] border border-[#f2ca50]/30">
          <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse"></span>
          <span className="text-[12px] font-sans font-semibold text-[#f2ca50]">
            {isRtl ? 'تم الإرسال، بانتظار التأكيد' : 'Sent, awaiting confirmation'}
          </span>
        </div>
        <p className="font-sans text-[13px] text-[#d0c5af] max-w-sm mt-2 leading-relaxed">
          {isRtl
            ? 'سيتواصل معك فريق الصالون لتأكيد موعد التوصيل ورابط الدفع عبر زينة أو تابي.'
            : 'Our salon team will contact you shortly to confirm delivery timing and payment.'}
        </p>

        {/* Order Reference Pill */}
        <button
          onClick={copyOrderRef}
          className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#201f21] border border-[#f2ca50]/40 text-[#f2ca50] font-sans text-[12px] font-bold tracking-wider hover:bg-[#2a2a2c] transition-all"
          type="button"
        >
          <span>{order.orderNumber}</span>
          <span className="material-symbols-outlined text-[15px]">
            {copiedCode ? 'done' : 'content_copy'}
          </span>
          {copiedCode && (
            <span className="text-[10px] text-[#47ea7a]">
              {isRtl ? 'تم النسخ' : 'Copied'}
            </span>
          )}
        </button>
      </div>

      {/* Itemized Order Details */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-md my-3 space-y-3">
        <h3 className="font-serif text-[16px] font-semibold text-[#e5e1e4]">
          {isRtl ? 'المنتجات المطلوبة' : 'Ordered Products'}
        </h3>

        <div className="space-y-2.5">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#201f21] border border-[#353437]/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.imageUrl}
                  alt={item.titleEn}
                  className="w-12 h-12 rounded-lg object-cover bg-[#131315] border border-[#353437]/40 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-[13px] font-semibold text-[#e5e1e4] truncate">
                    {isRtl ? item.titleAr : item.titleEn}
                  </span>
                  <span className="font-sans text-[11px] text-[#d0c5af]">
                    {item.volume} • Qty {item.qty}
                  </span>
                </div>
              </div>
              <span className="font-sans text-[14px] font-bold text-[#f2ca50] shrink-0">
                AED {item.price}
              </span>
            </div>
          ))}
        </div>

        {/* Breakdown Meta */}
        <div className="pt-3 border-t border-[#353437]/40 space-y-2 text-[12px] font-sans text-[#d0c5af]">
          <div className="flex justify-between">
            <span>{isRtl ? 'عدد المنتجات' : 'Total Items'}</span>
            <span className="text-[#e5e1e4] font-semibold">{order.itemsCount}</span>
          </div>
          <div className="flex justify-between">
            <span>{isRtl ? 'نوع التغليف' : 'Packaging'}</span>
            <span className="text-[#e5e1e4] font-semibold">{isRtl ? order.packagingAr : order.packagingEn}</span>
          </div>
          <div className="flex justify-between">
            <span>{isRtl ? 'طريقة التوصيل' : 'Delivery Method'}</span>
            <span className="text-[#47ea7a] font-semibold">
              {isRtl ? 'توصيل مبرد سريع • دبي' : 'Fast Courier Delivery (Dubai)'}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#353437]/30 text-[#e5e1e4] font-bold text-[14px]">
            <span>{isRtl ? 'الإجمالي' : 'Total Price'}</span>
            <span className="text-[#f2ca50]">AED {order.totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col gap-2.5 mt-3">
        <a
          href={`https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20I%20have%20placed%20Shop%20Order%20${encodeURIComponent(order.orderNumber)}%20for%20AED%20${order.totalPrice}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 rounded-full bg-[#25D366] text-[#003915] font-sans text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>{isRtl ? 'متابعة عبر محادثة واتساب' : 'Chat on WhatsApp'}</span>
        </a>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onNavigate('requests')}
            className="flex-1 py-2.5 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#f2ca50] text-[12px] font-sans font-bold transition-colors border border-[#353437]/50"
            type="button"
          >
            {isRtl ? 'عرض طلباتي' : 'View My Requests'}
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="flex-1 py-2.5 rounded-full bg-transparent hover:bg-[#201f21] text-[#d0c5af] text-[12px] font-sans transition-colors"
            type="button"
          >
            {isRtl ? 'متابعة التسوق' : 'Continue Shopping'}
          </button>
        </div>
      </div>
    </div>
  );
};
