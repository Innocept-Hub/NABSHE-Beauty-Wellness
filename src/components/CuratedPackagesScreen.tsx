import React, { useState } from 'react';
import { Language, ScreenType, ServicePackage } from '../types';
import { SERVICE_PACKAGES } from '../data/mockData';

interface CuratedPackagesScreenProps {
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  onRequestSubmitted: (packageItem: ServicePackage, window: string) => void;
  onModalChange?: (isOpen: boolean) => void;
}

export const CuratedPackagesScreen: React.FC<CuratedPackagesScreenProps> = ({
  language,
  onNavigate,
  onRequestSubmitted,
  onModalChange,
}) => {
  const isRtl = language === 'ar';
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [preferredWindow, setPreferredWindow] = useState<string>('Afternoon');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleOpenModal = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setIsSuccess(false);
    onModalChange?.(true);
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
    setIsSuccess(false);
    onModalChange?.(false);
  };

  const handleConfirmRequest = () => {
    if (!selectedPackage) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onRequestSubmitted(selectedPackage, preferredWindow);
        setSelectedPackage(null);
        setIsSuccess(false);
        onModalChange?.(false);
      }, 1000);
    }, 600);
  };

  return (
    <div className={`flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-2 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Navigation Breadcrumb / Sub-Tabs */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={() => onNavigate('services')}
          className="flex items-center gap-1 text-[#d0c5af] hover:text-[#f2ca50] font-sans text-[12px] font-semibold transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isRtl ? 'arrow_forward' : 'arrow_back'}
          </span>
          <span>{isRtl ? 'العودة للخدمات الفردية' : 'Back to Services'}</span>
        </button>
      </div>

      {/* Introductory Title Area */}
      <section className="pt-2 pb-4 flex flex-col gap-1">
        <div className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse"></span>
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]">
            {isRtl ? 'العلاجات المميزة' : 'SIGNATURE TREATMENTS'}
          </span>
        </div>
        <h1 className="font-serif text-[26px] sm:text-[30px] md:text-[36px] text-[#e5e1e4] font-semibold tracking-tight">
          {isRtl ? 'العلاجات المميزة والباقات' : 'Signature Treatments & Packages'}
        </h1>
        <p className="font-sans text-[13px] md:text-[14px] text-[#d0c5af] max-w-xl leading-relaxed">
          {isRtl
            ? 'جلسات علاجية متكاملة تجمع بين أكثر من خدمة لتوفير أقصى قدر من النتائج والراحة.'
            : 'Multi-service combinations thoughtfully sequenced for maximum aesthetic results and deep relaxation.'}
        </p>
      </section>

      {/* Package Cards Responsive Grid (Mobile 1-col, Tablet/Desktop 2-col, Wide 3-col) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {SERVICE_PACKAGES.map(pkg => (
          <article
            key={pkg.id}
            className="reveal-on-scroll relative overflow-hidden rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-xl flex flex-col justify-between luxury-card-hover group"
          >
            {/* Visual Cover */}
            <div className="relative h-48 md:h-56 w-full overflow-hidden bg-[#201f21]">
              <img
                src={pkg.imageUrl}
                alt={pkg.titleEn}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1d] via-[#1b1b1d]/80 via-40% to-transparent pointer-events-none"></div>

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 bg-[#f2ca50] text-[#241a00] font-sans text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                {isRtl ? pkg.tagAr : pkg.tagEn}
              </div>

              {/* Duration Pill */}
              <div className="absolute bottom-3 right-3 bg-[#0e0e10]/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-[#353437]/40">
                <span className="material-symbols-outlined text-[#f2ca50] text-[15px]">schedule</span>
                <span className="font-sans text-[12px] font-semibold text-[#e5e1e4]">
                  {pkg.duration} {isRtl ? 'دقيقة' : 'min'}
                </span>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3.5">
              <div>
                <h2 className="font-serif text-[19px] md:text-[21px] text-[#e5e1e4] font-semibold">
                  {isRtl ? pkg.titleAr : pkg.titleEn}
                </h2>
                <p className="font-sans text-[12px] md:text-[13px] text-[#d0c5af] mt-1">
                  {isRtl ? pkg.descriptionAr : pkg.descriptionEn}
                </p>
              </div>

              {/* Inclusions List */}
              <ul className="flex flex-col gap-2.5 bg-[#201f21] rounded-xl p-3.5 border border-[#353437]/40">
                {pkg.inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#f2ca50] text-[18px] shrink-0 mt-0.5">
                      {item.icon}
                    </span>
                    <div className="flex-1 flex justify-between items-baseline gap-2">
                      <span className="font-sans text-[13px] text-[#e5e1e4]">
                        {isRtl ? item.titleAr : item.titleEn}
                      </span>
                      <span className="font-sans text-[11px] text-[#d0c5af] shrink-0 font-medium">
                        {item.duration}
                      </span>
                    </div>
                  </li>
                ))}
                {pkg.specialNoteEn && (
                  <li className="flex items-center gap-2 pt-1 border-t border-[#353437]/40 text-[#f2ca50] text-[12px] font-sans font-medium">
                    <span className="material-symbols-outlined text-[16px]">stars</span>
                    <span>{isRtl ? pkg.specialNoteAr : pkg.specialNoteEn}</span>
                  </li>
                )}
              </ul>

              {/* Price & Action Row */}
              <div className="flex items-center justify-between gap-2.5 sm:gap-3 pt-2 border-t border-[#353437]/40">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                    <span className="font-sans text-[15px] sm:text-[16px] font-bold text-[#f2ca50] whitespace-nowrap leading-none">
                      AED {pkg.price}
                    </span>
                    {pkg.originalPrice && (
                      <span className="font-sans text-[11px] sm:text-[11.5px] text-[#99907c] line-through whitespace-nowrap leading-none">
                        AED {pkg.originalPrice}
                      </span>
                    )}
                  </div>
                  {pkg.savings ? (
                    <span className="font-sans text-[10.5px] text-[#47ea7a] font-semibold whitespace-nowrap mt-1 leading-none">
                      {isRtl ? `توفير ${pkg.savings} درهم` : `Saves AED ${pkg.savings}`}
                    </span>
                  ) : null}
                </div>

                <button
                  onClick={() => handleOpenModal(pkg)}
                  className="h-[40px] px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[11px] sm:text-[11.5px] md:text-[12px] font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.35)] active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] shrink-0">event_available</span>
                  <span className="whitespace-nowrap">{isRtl ? 'طلب الباقة' : 'Request Package'}</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* WhatsApp Guest Support Helper */}
      <section className="mt-6 mb-2">
        <div className="bg-[#1b1b1d] rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#353437]/50 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#18cd61]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#47ea7a] text-[24px]">chat</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[13px] font-bold text-[#e5e1e4] uppercase tracking-wider">
                {isRtl ? 'استفسار عن الباقات المخصصة' : 'Custom Package Inquiries'}
              </span>
              <p className="font-sans text-[12px] text-[#d0c5af]">
                {isRtl
                  ? 'هل ترغبين في تعديل الخدمات أو حجز باقة لمجموعة؟ تواصل معنا مباشرة عبر واتساب.'
                  : 'Interested in a customized package or group appointment? Contact guest care on WhatsApp.'}
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20I%20would%20like%20to%20inquire%20about%20a%20custom%20service%20package."
            target="_blank"
            rel="noopener noreferrer"
            className="h-[40px] px-5 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#25D366] font-sans text-[11.5px] sm:text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors border border-[#25D366]/40 active:scale-95 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] shrink-0">send</span>
            <span className="whitespace-nowrap">{isRtl ? 'محادثة واتساب' : 'Chat on WhatsApp'}</span>
          </a>
        </div>
      </section>

      {/* Interactive Request Confirmation Sheet Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-[#0e0e10]/85 backdrop-blur-md transition-opacity p-0 sm:p-4">
          <div className="w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] flex flex-col bg-[#1b1b1d] border border-[#353437] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 pb-safe">
            {/* Grab handle on mobile */}
            <div className="w-12 h-1 rounded-full bg-[#353437] mx-auto mt-3 shrink-0 sm:hidden"></div>

            {/* Header */}
            <div className="px-5 sm:px-6 pt-3 pb-3 border-b border-[#353437]/50 flex justify-between items-start shrink-0">
              <div className="flex flex-col">
                <span className="font-sans text-[9.5px] uppercase tracking-widest text-[#f2ca50] font-bold">
                  {isRtl ? 'طلب موعد باقة' : 'Appointment Request'}
                </span>
                <h3 className="font-serif text-[18px] sm:text-[20px] text-[#e5e1e4] font-semibold mt-0.5">
                  {isRtl ? selectedPackage.titleAr : selectedPackage.titleEn}
                </h3>
                <span className="font-sans text-[11.5px] text-[#f2ca50] font-medium mt-0.5">
                  {selectedPackage.duration} {isRtl ? 'دقيقة' : 'min'} • AED {selectedPackage.price}
                </span>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] flex items-center justify-center text-[#d0c5af] hover:text-[#e5e1e4] transition-colors cursor-pointer"
                type="button"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-5 sm:p-6 flex flex-col gap-4 overflow-y-auto">
              {/* Included Services Breakdown */}
              {selectedPackage.inclusions && selectedPackage.inclusions.length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10.5px] uppercase tracking-wider text-[#99907c] font-semibold">
                    {isRtl ? 'الخدمات المشمولة في الباقة' : 'Included Treatments Sequence'}
                  </label>
                  <div className="rounded-xl bg-[#201f21] border border-[#353437]/50 divide-y divide-[#353437]/40">
                    {selectedPackage.inclusions.map((inc, i) => (
                      <div key={i} className="px-3.5 py-2.5 flex items-center justify-between text-[12px] font-sans">
                        <div className="flex items-center gap-2 text-[#e5e1e4]">
                          <span className="material-symbols-outlined text-[#f2ca50] text-[15px]">{inc.icon || 'spa'}</span>
                          <span>{isRtl ? inc.titleAr : inc.titleEn}</span>
                        </div>
                        <span className="text-[#99907c] font-medium">{inc.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Window Selector */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[10.5px] uppercase tracking-wider text-[#99907c] font-semibold">
                  {isRtl ? 'الفترة الزمنية المفضلة' : 'Select Preferred Window'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Morning', labelEn: 'Morning', labelAr: 'الصباح', time: '10:00 - 13:00' },
                    { id: 'Afternoon', labelEn: 'Afternoon', labelAr: 'الظهيرة', time: '13:00 - 17:00' },
                    { id: 'Evening', labelEn: 'Evening', labelAr: 'المساء', time: '17:00 - 21:00' },
                  ].map(windowItem => {
                    const isWindowActive = preferredWindow === windowItem.id;
                    return (
                      <button
                        key={windowItem.id}
                        onClick={() => setPreferredWindow(windowItem.id)}
                        className={`min-h-[46px] rounded-xl font-sans flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isWindowActive
                            ? 'bg-[#f2ca50] text-[#241a00] shadow-md font-bold'
                            : 'bg-[#201f21] text-[#e5e1e4] hover:bg-[#2a2a2c] border border-[#353437]/40'
                        }`}
                        type="button"
                      >
                        <span className="text-[11.5px]">{isRtl ? windowItem.labelAr : windowItem.labelEn}</span>
                        <span className={`text-[9.5px] ${isWindowActive ? 'text-[#241a00]/80' : 'text-[#d0c5af]'}`}>
                          {windowItem.time}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Note */}
              <div className="bg-[#201f21] rounded-xl p-3 flex items-center justify-between border border-[#353437]/40">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">credit_card</span>
                  <span className="font-sans text-[11.5px] text-[#e5e1e4]">
                    {isRtl ? 'لا يتم خصم أي مبلغ الآن' : 'No advance payment required'}
                  </span>
                </div>
                <span className="font-sans text-[10.5px] font-bold text-[#47ea7a]">
                  Tabby / Pay in Salon
                </span>
              </div>
            </div>

            {/* Dedicated Action Footer with Standard 40px Buttons */}
            <div className="px-5 sm:px-6 py-3 border-t border-[#353437]/50 bg-[#161618] flex flex-col gap-2 shrink-0">
              <button
                onClick={handleConfirmRequest}
                disabled={isSubmitting || isSuccess}
                className={`h-[40px] px-6 w-full rounded-xl font-sans text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                  isSuccess
                    ? 'bg-[#47ea7a] text-[#003915]'
                    : 'bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00]'
                }`}
                type="button"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin shrink-0">progress_activity</span>
                    <span className="whitespace-nowrap">{isRtl ? 'جاري إرسال الطلب...' : 'Submitting Request...'}</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] shrink-0">verified</span>
                    <span className="whitespace-nowrap">{isRtl ? 'تم إرسال الطلب، بانتظار التأكيد' : 'Sent, awaiting confirmation'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px] shrink-0">check_circle</span>
                    <span className="whitespace-nowrap">{isRtl ? 'تأكيد طلب الموعد' : 'Confirm Appointment Request'}</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/971509196975?text=${encodeURIComponent(
                  isRtl
                    ? `مرحباً نبشي بيوتي، أود الاستفسار عن باقة: ${selectedPackage.titleEn} (AED ${selectedPackage.price}) - الفترة المفضلة: ${preferredWindow}`
                    : `Hello NABSHÉ Beauty, I would like to inquire about package: ${selectedPackage.titleEn} (AED ${selectedPackage.price}) - Preferred Window: ${preferredWindow}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[40px] px-4 w-full rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#25D366] border border-[#25D366]/40 font-sans text-[11.5px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px] shrink-0">chat</span>
                <span className="whitespace-nowrap">{isRtl ? 'استفسار عن الباقة عبر واتساب' : 'Inquire via WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
