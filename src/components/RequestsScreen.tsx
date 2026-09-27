import React, { useState } from 'react';
import { Language, ScreenType, AppointmentRequest, BoutiqueOrder } from '../types';

interface RequestsScreenProps {
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  appointments: AppointmentRequest[];
  orders: BoutiqueOrder[];
}

export const RequestsScreen: React.FC<RequestsScreenProps> = ({
  language,
  onNavigate,
  appointments,
  orders,
}) => {
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState<'all' | 'treatments' | 'orders'>('all');
  const [rebookingId, setRebookingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalCount = appointments.length + orders.length;

  const handleRebook = (apt: AppointmentRequest) => {
    setRebookingId(apt.id);
    setTimeout(() => {
      setRebookingId(null);
      setToastMessage(
        isRtl
          ? `تم بدء إعادة حجز ${apt.treatmentTitleAr}`
          : `Initiating repeat booking for ${apt.treatmentTitleEn}`
      );
      setTimeout(() => {
        setToastMessage(null);
        onNavigate('booking');
      }, 1200);
    }, 600);
  };

  return (
    <div className={`flex flex-col w-full max-w-7xl mx-auto pb-32 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#201f21] border border-[#f2ca50]/50 text-[#e5e1e4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">cached</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <section className="pt-1 pb-3 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse"></span>
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]">
              {isRtl ? 'سجل الطلبات' : 'Status & History'}
            </span>
          </div>
          <h1 className="font-serif text-[26px] sm:text-[30px] md:text-[36px] text-[#e5e1e4] font-semibold tracking-tight">
            {isRtl ? 'طلباتي ومواعيدي' : 'My Requests'}
          </h1>
          <p className="font-sans text-[13px] md:text-[14px] text-[#d0c5af] leading-relaxed">
            {isRtl
              ? 'متابعة حالة حجوزات الصالون وطلبات المنتجات في مكان واحد.'
              : 'Track the status of your appointment requests and product orders.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-[#201f21] p-1 rounded-xl border border-[#353437]/50 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-none sm:px-4 py-2 text-center rounded-lg font-sans text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
                : 'text-[#d0c5af] hover:text-[#e5e1e4]'
            }`}
            type="button"
          >
            <span>{isRtl ? 'الكل' : 'All'}</span>
            <span className="w-4 h-4 rounded-full bg-[#131315]/40 text-[9px] flex items-center justify-center">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('treatments')}
            className={`flex-1 sm:flex-none sm:px-4 py-2 text-center rounded-lg font-sans text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'treatments'
                ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
                : 'text-[#d0c5af] hover:text-[#e5e1e4]'
            }`}
            type="button"
          >
            <span>{isRtl ? 'المواعيد' : 'Appointments'}</span>
            <span className="w-4 h-4 rounded-full bg-[#131315]/40 text-[9px] flex items-center justify-center">
              {appointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 sm:flex-none sm:px-4 py-2 text-center rounded-lg font-sans text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
                : 'text-[#d0c5af] hover:text-[#e5e1e4]'
            }`}
            type="button"
          >
            <span>{isRtl ? 'الطلبات' : 'Orders'}</span>
            <span className="w-4 h-4 rounded-full bg-[#131315]/40 text-[9px] flex items-center justify-center">
              {orders.length}
            </span>
          </button>
        </div>
      </section>

      {/* Content Area */}
      <div className="space-y-5 my-3">
        {/* Appointments Section */}
        {(activeTab === 'all' || activeTab === 'treatments') && appointments.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-serif text-[17px] text-[#e5e1e4] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">calendar_today</span>
              <span>{isRtl ? 'طلبات المواعيد' : 'Appointment Requests'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map(apt => (
                <article
                  key={apt.id}
                  className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-md flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[11px] font-bold text-[#f2ca50] tracking-wider">
                      {apt.refNumber}
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] text-[10px] font-bold border border-[#f2ca50]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse"></span>
                      <span>{isRtl ? 'تم الإرسال، بانتظار التأكيد' : 'Sent, awaiting confirmation'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={apt.treatmentImage}
                      alt={apt.treatmentTitleEn}
                      className="w-16 h-16 rounded-xl object-cover border border-[#353437]/50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-[15px] font-semibold text-[#e5e1e4] truncate">
                        {isRtl ? apt.treatmentTitleAr : apt.treatmentTitleEn}
                      </h3>
                      <p className="font-sans text-[11px] text-[#d0c5af] mt-0.5">
                        {apt.dateStr} • {apt.specialist}
                      </p>
                      <span className="font-sans text-[13px] font-bold text-[#f2ca50] block mt-1">
                        AED {apt.totalPrice}
                      </span>
                    </div>
                  </div>

                  {apt.addOns && apt.addOns.length > 0 && (
                    <div className="text-[11px] font-sans text-[#d0c5af] bg-[#201f21] p-2 rounded-lg border border-[#353437]/30">
                      <span className="text-[#f2ca50] font-semibold">{isRtl ? 'إضافات الجلسة: ' : 'Add-on: '}</span>
                      <span>{apt.addOns.join(', ')}</span>
                    </div>
                  )}

                  {/* Actions Strip */}
                  <div className="pt-2 border-t border-[#353437]/40 flex items-center gap-2">
                    <a
                      href={`https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20inquiring%20about%20booking%20${encodeURIComponent(apt.refNumber)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 border border-[#25D366]/40 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">chat</span>
                      <span>{isRtl ? 'واتساب' : 'WhatsApp'}</span>
                    </a>

                    <button
                      onClick={() => handleRebook(apt)}
                      disabled={rebookingId === apt.id}
                      className="py-2 px-3 rounded-xl bg-[#2a2a2c] hover:bg-[#f2ca50] hover:text-[#241a00] text-[#e5e1e4] text-[11px] font-sans font-bold flex items-center justify-center gap-1 transition-colors border border-[#353437]/40"
                      type="button"
                    >
                      {rebookingId === apt.id ? (
                        <span className="material-symbols-outlined text-[15px] animate-spin">refresh</span>
                      ) : (
                        <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                      )}
                      <span>{isRtl ? 'حجز مجدد' : 'Rebook'}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Orders Section */}
        {(activeTab === 'all' || activeTab === 'orders') && orders.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="font-serif text-[17px] text-[#e5e1e4] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">shopping_bag</span>
              <span>{isRtl ? 'طلبات المنتجات' : 'Product Orders'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map(order => (
                <article
                  key={order.id}
                  className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-md flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[11px] font-bold text-[#f2ca50] tracking-wider">
                      {order.orderNumber}
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#47ea7a]/15 text-[#47ea7a] text-[10px] font-bold border border-[#47ea7a]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#47ea7a]"></span>
                      <span>{isRtl ? order.statusAr : order.statusEn}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[12px] font-sans">
                        <span className="text-[#e5e1e4] truncate max-w-[200px]">
                          {item.qty}x {isRtl ? item.titleAr : item.titleEn}
                        </span>
                        <span className="text-[#d0c5af]">AED {item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#353437]/40 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-sans text-[10px] text-[#d0c5af]">
                        {isRtl ? order.packagingAr : order.packagingEn}
                      </span>
                      <span className="font-sans text-[14px] font-bold text-[#f2ca50]">
                        AED {order.totalPrice}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20tracking%20order%20${encodeURIComponent(order.orderNumber)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3.5 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#47ea7a] text-[11px] font-sans font-bold flex items-center gap-1.5 border border-[#353437]/50"
                    >
                      <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                      <span>{isRtl ? 'تتبع التوصيل' : 'Track Order'}</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalCount === 0 && (
          <div className="py-12 text-center flex flex-col items-center justify-center space-y-3 bg-[#1b1b1d] rounded-2xl border border-[#353437]/50 p-6">
            <div className="w-14 h-14 rounded-full bg-[#201f21] flex items-center justify-center text-[#99907c]">
              <span className="material-symbols-outlined text-[28px]">history</span>
            </div>
            <h3 className="font-serif text-[18px] text-[#e5e1e4]">
              {isRtl ? 'لا توجد طلبات سابقة' : 'No Activity Yet'}
            </h3>
            <p className="font-sans text-[12px] text-[#d0c5af] max-w-xs">
              {isRtl
                ? 'استعرضي خدمات الصالون أو تسوقي من المتجر لمتابعة طلباتك هنا.'
                : 'Browse our services or shop our products to track appointments and orders here.'}
            </p>
            <button
              onClick={() => onNavigate('services')}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#f2ca50] text-[#241a00] font-sans text-[12px] font-bold"
              type="button"
            >
              {isRtl ? 'استعراض الخدمات' : 'Explore Services'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
