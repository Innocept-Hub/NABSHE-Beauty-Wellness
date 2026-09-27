import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Language, ScreenType, Treatment, BoutiqueProduct } from '../types';
import { BOUTIQUE_PRODUCTS } from '../data/mockData';

interface TreatmentDetailScreenProps {
  treatment: Treatment;
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  onProceedToBooking: (treatment: Treatment, addedProductIds: string[], calculatedPrice: number) => void;
  isSaved?: boolean;
  onToggleSave?: (treatmentId: string) => void;
  onSelectProduct?: (product: BoutiqueProduct) => void;
}

export const TreatmentDetailScreen: React.FC<TreatmentDetailScreenProps> = ({
  treatment,
  language,
  onNavigate,
  onProceedToBooking,
  isSaved: externalIsSaved,
  onToggleSave,
  onSelectProduct,
}) => {
  const isRtl = language === 'ar';
  const [internalIsSaved, setInternalIsSaved] = useState<boolean>(false);
  const isSaved = externalIsSaved !== undefined ? externalIsSaved : internalIsSaved;
  const [activeAddons, setActiveAddons] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleBookmark = () => {
    if (onToggleSave) {
      onToggleSave(treatment.id);
    } else {
      setInternalIsSaved(!internalIsSaved);
    }
    showToast(
      !isSaved
        ? (isRtl ? 'تم الحفظ في قائمة التفضيلات' : 'Saved to your Wishlist')
        : (isRtl ? 'تمت الإزالة من قائمة التفضيلات' : 'Removed from your Wishlist')
    );
  };

  const triggerShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${treatment.titleEn} | NABSHÉ`,
        text: 'Facial and aesthetic care at NABSHÉ UAE.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast(isRtl ? 'تم نسخ رابط الخدمة إلى الحافظة' : 'Service link copied to clipboard');
    }
  };

  const toggleAddon = (productId: string, productName: string) => {
    const nextState = !activeAddons[productId];
    setActiveAddons(prev => ({ ...prev, [productId]: nextState }));
    showToast(
      nextState
        ? (isRtl ? `تمت إضافة ${productName} للزيارة` : `Added ${productName} to appointment`)
        : (isRtl ? `تمت إزالة ${productName}` : `Removed ${productName}`)
    );
  };

  const addonsTotal = (treatment.recommendedProducts || []).reduce((sum, prod) => {
    return activeAddons[prod.id] ? sum + prod.price : sum;
  }, 0);

  const finalTotal = treatment.price + addonsTotal;

  const handleBookNow = () => {
    const selectedAddonIds = Object.keys(activeAddons).filter(id => activeAddons[id]);
    onProceedToBooking(treatment, selectedAddonIds, finalTotal);
  };

  return (
    <div className={`flex flex-col w-full max-w-6xl mx-auto pb-32 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2a2a2c] border border-[#f2ca50]/50 text-[#e5e1e4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => onNavigate('services')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#201f21] text-[#e5e1e4] hover:text-[#f2ca50] border border-[#353437]/40 transition-colors font-sans text-[11px] font-semibold tracking-wider uppercase"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isRtl ? 'chevron_right' : 'chevron_left'}
          </span>
          <span>{isRtl ? 'الخدمات' : 'Services'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleBookmark}
            aria-label="Save service"
            className={`w-9 h-9 rounded-full bg-[#201f21] border border-[#353437]/40 flex items-center justify-center transition-all active:scale-90 ${
              isSaved ? 'text-[#f2ca50] bg-[#f2ca50]/15 border-[#f2ca50]/40' : 'text-[#e5e1e4] hover:text-[#f2ca50]'
            }`}
            type="button"
            title={isRtl ? 'حفظ في المفضلة' : 'Save to Wishlist'}
          >
            <Heart
              size={15}
              strokeWidth={1.5}
              className={isSaved ? "fill-current" : ""}
            />
          </button>

          <button
            onClick={triggerShare}
            aria-label="Share service"
            className="w-9 h-9 rounded-full bg-[#201f21] border border-[#353437]/40 flex items-center justify-center text-[#e5e1e4] hover:text-[#f2ca50] transition-transform active:scale-90"
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">share</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Card */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#1b1b1d] border border-[#353437]/50 shadow-xl my-2">
        <div className="relative w-full h-72 md:h-96 overflow-hidden bg-[#201f21]">
          <img
            src={treatment.imageUrl}
            alt={treatment.titleEn}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1d] via-[#1b1b1d]/85 via-45% to-transparent pointer-events-none"></div>
        </div>

        {/* Hero Header Meta Info */}
        <div className="relative px-5 md:px-8 pb-5 -mt-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ca50] text-[#241a00] font-sans text-[10px] font-bold tracking-wider uppercase shadow-md mb-2">
            <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
            <span>{isRtl ? 'خدمة مميزة' : 'Featured Service'}</span>
          </div>

          <h1 className="font-serif text-[24px] sm:text-[30px] md:text-[34px] text-[#e5e1e4] font-semibold tracking-tight leading-snug">
            {isRtl ? treatment.titleAr : treatment.titleEn}
          </h1>
          <p className="font-sans text-[13px] md:text-[14px] text-[#d0c5af] leading-relaxed mt-1">
            {isRtl ? treatment.subtitleAr : treatment.subtitleEn}
          </p>

          {/* Direct In-Page Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-3">
            <button
              onClick={handleBookNow}
              className="h-[40px] px-5 w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.35)] active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>{isRtl ? 'احجز الموعد' : 'BOOK APPOINTMENT'}</span>
            </button>

            <a
              href={`https://wa.me/971509196975?text=${encodeURIComponent(
                isRtl
                  ? `مرحباً نبشي بيوتي، أود الاستفسار عن حجز خدمة: ${treatment.titleEn} (AED ${treatment.price})`
                  : `Hello NABSHÉ Beauty, I would like to inquire about booking: ${treatment.titleEn} (AED ${treatment.price})`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[40px] px-4 w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#25D366] border border-[#25D366]/40 font-sans text-[11px] sm:text-[11.5px] font-semibold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>{isRtl ? 'استفسار عبر واتساب' : 'Inquire on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Key Highlights (2x2 Grid on mobile, 4-col on tablet/desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-3">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1b1b1d] border border-[#353437]/50 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#201f21] border border-[#353437]/40 flex items-center justify-center text-[#f2ca50] shrink-0">
            <span className="material-symbols-outlined text-[20px]">schedule</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-[#d0c5af] font-sans">
              {isRtl ? 'المدة' : 'Duration'}
            </span>
            <span className="text-[14px] text-[#e5e1e4] font-bold truncate">
              {treatment.duration} {isRtl ? 'دقيقة' : 'Minutes'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1b1b1d] border border-[#353437]/50 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#201f21] border border-[#353437]/40 flex items-center justify-center text-[#f2ca50] shrink-0">
            <span className="material-symbols-outlined text-[20px]">payments</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-[#d0c5af] font-sans">
              {isRtl ? 'السعر' : 'Price'}
            </span>
            <span className="text-[14px] text-[#f2ca50] font-bold truncate">
              AED {treatment.price}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1b1b1d] border border-[#353437]/50 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#201f21] border border-[#353437]/40 flex items-center justify-center text-[#f2ca50] shrink-0">
            <span className="material-symbols-outlined text-[20px]">face_retouching_natural</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-[#d0c5af] font-sans">
              {isRtl ? 'منطقة التطبيق' : 'Application'}
            </span>
            <span className="text-[13px] text-[#e5e1e4] font-semibold truncate">
              {isRtl ? treatment.applicationAr : treatment.applicationEn}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1b1b1d] border border-[#353437]/50 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#201f21] border border-[#353437]/40 flex items-center justify-center text-[#f2ca50] shrink-0">
            <span className="material-symbols-outlined text-[20px]">meeting_room</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-[#d0c5af] font-sans">
              {isRtl ? 'الجناح' : 'Suite'}
            </span>
            <span className="text-[13px] text-[#e5e1e4] font-semibold truncate">
              {isRtl ? treatment.suiteAr : treatment.suiteEn}
            </span>
          </div>
        </div>
      </div>

      {/* About Treatment Section */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-sm my-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">auto_awesome</span>
          <h2 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold">
            {isRtl ? 'عن هذه الخدمة' : 'About this Treatment'}
          </h2>
        </div>
        <p className="font-sans text-[13px] md:text-[14px] text-[#d0c5af] leading-relaxed mb-4">
          {isRtl ? treatment.descriptionAr : treatment.descriptionEn}
        </p>

        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#353437]/40">
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#201f21] border border-[#353437]/30">
            <span className="material-symbols-outlined text-[#f2ca50] text-[20px] mb-1">verified</span>
            <span className="text-[11px] font-sans font-semibold text-[#e5e1e4]">
              {isRtl ? 'ذهب خالص 24' : 'Pure 24K Gold'}
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#201f21] border border-[#353437]/30">
            <span className="material-symbols-outlined text-[#f2ca50] text-[20px] mb-1">eco</span>
            <span className="text-[11px] font-sans font-semibold text-[#e5e1e4]">
              {isRtl ? 'مكونات نقية' : 'Pure Formula'}
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#201f21] border border-[#353437]/30">
            <span className="material-symbols-outlined text-[#f2ca50] text-[20px] mb-1">spa</span>
            <span className="text-[11px] font-sans font-semibold text-[#e5e1e4]">
              {isRtl ? 'نتائج مثبتة' : 'Proven Care'}
            </span>
          </div>
        </div>
      </div>

      {/* Protocol Steps */}
      {treatment.steps && treatment.steps.length > 0 && (
        <div className="my-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold">
              {isRtl ? 'مراحل الجلسة' : 'Treatment Steps'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {treatment.steps.map(step => (
              <div
                key={step.number}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-[#1b1b1d] border border-[#353437]/50 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-[#f2ca50] text-[#241a00] font-sans text-[12px] flex items-center justify-center shrink-0 font-bold">
                  {step.number}
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-serif text-[15px] font-semibold text-[#e5e1e4]">
                    {isRtl ? step.titleAr : step.titleEn}
                  </h3>
                  <p className="font-sans text-[12px] leading-relaxed text-[#d0c5af] mt-1">
                    {isRtl ? step.descriptionAr : step.descriptionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended At-Home Care Products */}
      {treatment.recommendedProducts && treatment.recommendedProducts.length > 0 && (
        <div className="my-3">
          <div className="flex flex-col mb-3">
            <h2 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold">
              {isRtl ? 'عناية منزلية موصى بها' : 'Recommended At-Home Care'}
            </h2>
            <p className="font-sans text-[12px] text-[#d0c5af]">
              {isRtl
                ? 'منتجات تحافظ على نتائج ونضارة البشرة بعد الجلسة'
                : 'Products to maintain treatment results at home'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {treatment.recommendedProducts.map(prod => {
              const isAdded = !!activeAddons[prod.id];
              return (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#1b1b1d] border border-[#353437]/50 shadow-sm"
                >
                  <div
                    onClick={() => {
                      const matched = BOUTIQUE_PRODUCTS.find(p => p.id === prod.id);
                      if (matched && onSelectProduct) {
                        onSelectProduct(matched);
                      }
                    }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer group/prod"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#201f21] shrink-0 border border-[#353437]/40 group-hover/prod:border-[#f2ca50]/50 transition-colors">
                      <img
                        src={prod.imageUrl}
                        alt={prod.nameEn}
                        className="w-full h-full object-cover group-hover/prod:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="font-sans text-[13px] font-semibold text-[#e5e1e4] truncate group-hover/prod:text-[#f2ca50] transition-colors">
                        {isRtl ? prod.nameAr : prod.nameEn}
                      </h4>
                      <span className="font-sans text-[11px] text-[#d0c5af]">
                        {isRtl ? prod.specAr : prod.specEn}
                      </span>
                      <span className="font-sans text-[14px] font-bold text-[#f2ca50] mt-0.5">
                        AED {prod.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAddon(prod.id, isRtl ? prod.nameAr : prod.nameEn)}
                    className={`flex items-center gap-1 px-3.5 py-2 rounded-full font-sans text-[11px] font-bold transition-all active:scale-95 shrink-0 ${
                      isAdded
                        ? 'bg-[#47ea7a] text-[#003915]'
                        : 'bg-[#2a2a2c] text-[#e5e1e4] hover:bg-[#f2ca50] hover:text-[#241a00] border border-[#353437]/40'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isAdded ? 'check' : 'add'}
                    </span>
                    <span>{isAdded ? (isRtl ? 'تمت الإضافة' : 'Added') : (isRtl ? 'إضافة للزيارة' : 'Add to Visit')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regional Tabby Split Notice */}
      <div className="p-4 rounded-xl bg-[#201f21] border border-[#353437]/40 flex items-center justify-between shadow-sm my-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2a2a2c] flex items-center justify-center text-[#f2ca50] shrink-0">
            <span className="material-symbols-outlined text-[18px]">credit_card</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[12px] text-[#e5e1e4] font-semibold">
              {isRtl ? `أو 4 دفعات بدون فوائد تبدأ من ${(finalTotal / 4).toFixed(2)} درهم` : `Or 4 interest-free installments of AED ${(finalTotal / 4).toFixed(2)}`}
            </span>
            <span className="font-sans text-[11px] text-[#d0c5af]">
              {isRtl ? 'بدون أي فوائد مع تابي' : 'Split in 4 with Tabby'}
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded bg-[#2a2a2c] text-[10px] font-bold text-[#f2ca50] border border-[#353437]/50">
          TABBY
        </span>
      </div>

      {/* Fixed Bottom Booking Dock */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#161618]/95 backdrop-blur-2xl border-t border-[#353437]/70 py-2.5 px-4 sm:px-6 shadow-[0_-10px_35px_rgba(0,0,0,0.7)] pb-safe">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[9.5px] sm:text-[10px] tracking-widest text-[#99907c] font-semibold uppercase leading-none mb-1">
              {isRtl ? 'السعر الإجمالي' : 'Total Price'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-[16px] sm:text-[17px] font-bold text-[#f2ca50] leading-tight">
                AED {finalTotal}
              </span>
              <span className="font-sans text-[9.5px] text-[#99907c] uppercase">
                {isRtl ? 'شامل الضريبة' : 'VAT incl.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end max-w-xs sm:max-w-sm">
            <button
              onClick={handleBookNow}
              className="h-[40px] px-5 sm:px-6 w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.35)] active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>{isRtl ? 'احجز الموعد' : 'BOOK APPOINTMENT'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
