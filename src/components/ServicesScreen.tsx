import React, { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { Language, ScreenType, Treatment } from '../types';
import { TREATMENTS } from '../data/mockData';
import { useGridInterval, chunkItems } from '../utils/useGridInterval';
import { CurationBanner } from './CurationBanner';
import { HeaderVideoReel } from './HeaderVideoReel';

interface ServicesScreenProps {
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  onSelectTreatment: (treatment: Treatment) => void;
  savedTreatmentIds?: string[];
  onToggleSaveTreatment?: (id: string) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  language,
  onNavigate,
  onSelectTreatment,
  savedTreatmentIds = [],
  onToggleSaveTreatment,
}) => {
  const isRtl = language === 'ar';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const interval = useGridInterval();

  const handleToggleHeart = (e: React.MouseEvent, treatment: Treatment) => {
    e.stopPropagation();
    if (onToggleSaveTreatment) {
      const willBeSaved = !savedTreatmentIds.includes(treatment.id);
      onToggleSaveTreatment(treatment.id);
      setSavedToast(
        willBeSaved
          ? (isRtl ? `تم حفظ ${treatment.titleAr} في المفضلة` : `Saved ${treatment.titleEn}`)
          : (isRtl ? `تمت إزالة ${treatment.titleAr} من المفضلة` : `Removed ${treatment.titleEn}`)
      );
      setTimeout(() => setSavedToast(null), 2000);
    }
  };

  const categories = [
    { id: 'all', labelEn: 'All Services', labelAr: 'جميع الخدمات' },
    { id: 'facials', labelEn: 'Facials & Skincare', labelAr: 'عناية الوجه والذهب' },
    { id: 'hair', labelEn: 'Hair Care', labelAr: 'العناية بالشعر' },
    { id: 'hammam', labelEn: 'Hammam & Body', labelAr: 'الحمام المغربي' },
    { id: 'nails', labelEn: 'Nails & Pedicure', labelAr: 'الأظافر والباديكير' },
    { id: 'massage', labelEn: 'Massage Therapy', labelAr: 'المساج والاسترخاء' },
  ];

  const filteredTreatments = useMemo(() => {
    return TREATMENTS.filter(treatment => {
      const matchCat = activeCategory === 'all' || treatment.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        treatment.titleEn.toLowerCase().includes(q) ||
        treatment.titleAr.toLowerCase().includes(q) ||
        treatment.subtitleEn.toLowerCase().includes(q) ||
        treatment.subtitleAr.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  const treatmentChunks = useMemo(() => {
    return chunkItems(filteredTreatments, interval);
  }, [filteredTreatments, interval]);

  return (
    <div className={`flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-2 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#201f21] border border-[#f2ca50]/50 text-[#e5e1e4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <Heart size={14} strokeWidth={1.5} className="fill-current text-[#f2ca50]" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* Header & Intro */}
      {/* Header Intro: 2 Columns on Mobile, Tablet & Desktop (70% text / 30% compact portrait video) */}
      <section className="pt-1 pb-3 flex items-center justify-between gap-3 sm:gap-5">
        {/* Left Column (70% width) */}
        <div className="w-[68%] sm:w-[70%] flex flex-col gap-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] sm:text-[11px] text-[#f2ca50] uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] inline-block animate-pulse"></span>
              {isRtl ? 'قائمة الخدمات' : 'Service Menu'}
            </span>
          </div>
          <h1 className="font-serif text-[24px] sm:text-[30px] md:text-[36px] text-[#e5e1e4] font-semibold tracking-tight">
            {isRtl ? 'خدمات الصالون والعناية' : 'Salon & Care Services'}
          </h1>
          <p className="font-sans text-[12px] sm:text-[13px] md:text-[14px] text-[#d0c5af] leading-relaxed line-clamp-3 sm:line-clamp-none">
            {isRtl
              ? 'جلسات عناية شخصية متخصصة تجمع بين المنتجات الطبيعية وأحدث تقنيات الجمال.'
              : 'Personalized treatment sessions combining pure botanicals and advanced aesthetic techniques.'}
          </p>

          <button
            onClick={() => onNavigate('packages')}
            className="text-[11px] sm:text-[12px] font-sans font-semibold text-[#f2ca50] underline hover:opacity-80 w-fit mt-0.5"
            type="button"
          >
            {isRtl ? 'عرض الباقات المتكاملة' : 'View Service Packages'}
          </button>
        </div>

        {/* Right Column (30% width, compact portrait reel) - seamlessly blends with background, no gold outline */}
        <div className="w-[32%] sm:w-[30%] max-w-[120px] sm:max-w-[140px] md:max-w-[155px] shrink-0">
          <HeaderVideoReel
            src="/assets/Video-Clips/skincare.mp4"
            poster="/assets/Images/Spa-Hallway.jpg"
          />
        </div>
      </section>

      {/* Controls Row: Sub-nav & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 my-2">
        {/* Mode Sub-Navigation (Individual Services vs Packages) */}
        <div className="flex items-center bg-[#201f21] p-1 rounded-xl border border-[#353437]/50 w-full md:w-80 shrink-0">
          <button
            className="flex-1 py-2 text-center rounded-lg font-sans text-[12px] font-bold bg-[#f2ca50] text-[#241a00] shadow-sm transition-all"
            type="button"
          >
            {isRtl ? 'الخدمات الفردية' : 'Individual Services'}
          </button>
          <button
            onClick={() => onNavigate('packages')}
            className="flex-1 py-2 text-center rounded-lg font-sans text-[12px] font-semibold text-[#d0c5af] hover:text-[#e5e1e4] transition-all"
            type="button"
          >
            {isRtl ? 'الباقات المتكاملة' : 'Service Packages'}
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:max-w-md">
          <div className="relative flex items-center bg-[#2a2a2c] rounded-full border border-[#353437]/40 shadow-inner focus-within:border-[#f2ca50]/50 transition-all">
            <span className="material-symbols-outlined absolute left-4 text-[#f2ca50] text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحثي عن خدمة، علاج، أو جلسة...' : 'Search services, treatments, or therapies...'}
              className="w-full bg-transparent py-2.5 pl-11 pr-11 text-[#e5e1e4] font-sans text-[13px] placeholder:text-[#99907c] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 w-6 h-6 rounded-full bg-[#201f21] flex items-center justify-center text-[#d0c5af] hover:text-[#e5e1e4]"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Chips: horizontal scroll on mobile, flex wrap on tablet/desktop */}
      <div className="py-2.5 overflow-x-auto no-scrollbar md:overflow-visible -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
        <div className="flex items-center gap-2 w-max md:w-full md:flex-wrap">
          {categories.map(cat => {
            const isSelected = activeCategory === cat.id;
            const count = cat.id === 'all'
              ? TREATMENTS.length
              : TREATMENTS.filter(t => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full font-sans text-[12px] font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
                    : 'bg-[#201f21] text-[#d0c5af] hover:text-[#e5e1e4] border border-[#353437]/40'
                }`}
                type="button"
              >
                <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-[#241a00]/20 text-[#241a00]' : 'bg-[#2a2a2c] text-[#99907c]'
                }`}>
                  {count}
                </span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#241a00]"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Count Summary */}
      <div className="flex items-center justify-between py-1.5 px-0.5 text-[12px] font-sans text-[#99907c]">
        <span>
          {isRtl
            ? `عرض ${filteredTreatments.length} من أصل ${TREATMENTS.length} خدمة فاخرة`
            : `Showing ${filteredTreatments.length} of ${TREATMENTS.length} luxury treatments`}
        </span>
        {searchQuery.trim() && (
          <span className="text-[#f2ca50]">
            {isRtl ? `نتائج البحث عن "${searchQuery}"` : `Results for "${searchQuery}"`}
          </span>
        )}
      </div>

      {/* Services Responsive Grid (Mobile 1-col, Tablet 2-col, Desktop 3-col) */}
      <div className="mt-3">
        {filteredTreatments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-[#1b1b1d] rounded-2xl border border-[#353437]/50 text-center space-y-3 my-4">
            <div className="w-12 h-12 rounded-full bg-[#201f21] flex items-center justify-center text-[#f2ca50]">
              <span className="material-symbols-outlined text-[24px]">search_off</span>
            </div>
            <h3 className="font-serif text-[18px] text-[#e5e1e4]">
              {isRtl ? 'لم نجد نتائج مطابقة' : 'No Services Found'}
            </h3>
            <p className="font-sans text-[12px] text-[#d0c5af] max-w-xs">
              {isRtl
                ? 'جربي البحث بكلمات أخرى مثل ذهب، شعر، كافيار، أو حمام.'
                : 'Try searching for gold, facial, hair, caviar, or hammam.'}
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-full bg-[#2a2a2c] text-[#f2ca50] font-sans text-[12px] font-bold hover:bg-[#f2ca50] hover:text-[#241a00] transition-colors"
              type="button"
            >
              {isRtl ? 'إعادة ضبط البحث' : 'Clear Filters'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 sm:space-y-4">
            {treatmentChunks.map((chunk, chunkIdx) => (
              <React.Fragment key={chunkIdx}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 reveal-on-scroll">
                  {chunk.map(treatment => {
                    const isSaved = savedTreatmentIds.includes(treatment.id);
                    return (
                      <article
                        key={treatment.id}
                        role="button"
                        tabIndex={0}
                        aria-label={isRtl ? `عرض تفاصيل ${treatment.titleAr}` : `View details for ${treatment.titleEn}`}
                        onClick={() => onSelectTreatment(treatment)}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
                            e.preventDefault();
                            onSelectTreatment(treatment);
                          }
                        }}
                        className="flex flex-col justify-between bg-[#1b1b1d] rounded-2xl p-2.5 sm:p-3 md:p-3.5 lg:p-4 border border-[#353437]/50 shadow-md group relative overflow-hidden luxury-card-hover cursor-pointer"
                      >
                        {/* Top Tag & Heart Button Row */}
                        <div className="flex items-center justify-between mb-2 z-10 relative">
                          <span className="font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm bg-[#201f21]/90 backdrop-blur-md text-[#f2ca50] border border-[#f2ca50]/30">
                            {treatment.duration} {isRtl ? 'دقيقة' : 'MIN'}
                          </span>

                          <button
                            onClick={(e) => handleToggleHeart(e, treatment)}
                            className={`w-7 h-7 rounded-full bg-[#201f21]/80 backdrop-blur-md border border-[#353437]/50 flex items-center justify-center transition-all active:scale-90 ${
                              isSaved
                                ? 'text-[#f2ca50] bg-[#f2ca50]/15 border-[#f2ca50]/40'
                                : 'text-[#d0c5af] hover:text-[#f2ca50]'
                            }`}
                            type="button"
                            aria-label="Save treatment"
                            title={isRtl ? 'حفظ في المفضلة' : 'Save to Wishlist'}
                          >
                            <Heart
                              size={13}
                              strokeWidth={1.5}
                              className={isSaved ? "fill-current" : ""}
                            />
                          </button>
                        </div>

                        <div>
                          {/* Treatment Visual */}
                          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#201f21] mb-2.5 relative border border-[#353437]/40">
                            <img
                              src={treatment.imageUrl}
                              alt={isRtl ? treatment.titleAr : treatment.titleEn}
                              loading="lazy"
                              decoding="async"
                              width={400}
                              height={300}
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                            />
                          </div>

                          {/* Title & Suite/Subtitle */}
                          <h3 className="font-sans text-[13px] md:text-[14px] font-semibold text-[#e5e1e4] leading-snug line-clamp-2 group-hover:text-[#f2ca50] transition-colors">
                            {isRtl ? treatment.titleAr : treatment.titleEn}
                          </h3>
                          <span className="font-sans text-[11px] text-[#d0c5af] block mt-0.5">
                            {treatment.suiteEn}
                          </span>
                        </div>

                        {/* Price & Action Row */}
                        <div className="mt-3 pt-2.5 border-t border-[#353437]/40 flex flex-col gap-1.5">
                          <div className="flex items-baseline justify-between">
                            <span className="font-sans text-[13.5px] sm:text-[14px] md:text-[14.5px] font-bold text-[#f2ca50] whitespace-nowrap">
                              AED {treatment.price}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTreatment(treatment);
                              onNavigate('booking');
                            }}
                            className="w-full h-[40px] rounded-xl bg-[#2a2a2c] hover:bg-[#f2ca50] hover:text-[#241a00] text-[#e5e1e4] font-sans text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1.5 hover:shadow-[0_4px_16px_rgba(242,202,80,0.3)] transition-all duration-200 active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px] shrink-0">calendar_today</span>
                            <span className="whitespace-nowrap">{isRtl ? 'احجز الموعد' : 'Book Treatment'}</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Full-width editorial banner with video/placeholder after each interval */}
                {chunkIdx < treatmentChunks.length - 1 && (
                  <CurationBanner
                    index={chunkIdx}
                    type="service"
                    isRtl={isRtl}
                    onNavigate={onNavigate}
                    onAction={() => onNavigate('booking')}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Consultation Advice Banner */}
      <aside className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#201f21] via-[#1b1b1d] to-[#2a2a2c] p-5 md:p-6 shadow-lg border border-[#353437]/50 mt-6 mb-3">
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#f2ca50]/15 flex items-center justify-center text-[#f2ca50]">
              <span className="material-symbols-outlined text-[18px]">diversity_1</span>
            </span>
            <span className="font-sans text-[10px] text-[#f2ca50] uppercase tracking-widest font-bold">
              {isRtl ? 'استشارة مجانية' : 'Complimentary Consultation'}
            </span>
          </div>

          <div className="flex flex-col gap-1 max-w-2xl">
            <h3 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold">
              {isRtl ? 'هل تحتاجين لمساعدة في الاختيار؟' : "Need help choosing the right treatment?"}
            </h3>
            <p className="font-sans text-[13px] text-[#d0c5af] leading-relaxed">
              {isRtl
                ? 'احجزي استشارة مجانية لمدة 15 دقيقة مع خبيرة العناية لدينا لاختيار العلاج الأنسب لبشرتك وشعرك.'
                : 'Book a 15-minute consultation with our beauty specialist to recommend the most effective treatment for your skin or hair.'}
            </p>
          </div>

          <div className="pt-1 flex items-center gap-3">
            <button
              onClick={() => onNavigate('diagnostic')}
              className="px-4 py-2.5 rounded-full bg-[#f2ca50] text-[#241a00] font-sans text-[12px] font-bold hover:bg-[#ffe088] transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              type="button"
            >
              <span>{isRtl ? 'بدء فحص البشرة' : 'Start Skin Diagnostic'}</span>
              <span className="material-symbols-outlined text-[16px]">
                {isRtl ? 'arrow_back' : 'arrow_forward'}
              </span>
            </button>
            <a
              href="https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20I%20would%20like%20a%20treatment%20recommendation."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-full bg-[#201f21] text-[#47ea7a] font-sans text-[12px] font-semibold hover:text-[#e5e1e4] transition-colors border border-[#353437]/40 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Regional Payment Badges */}
      <div className="flex items-center justify-center gap-3 py-3 opacity-75">
        <span className="font-sans text-[11px] text-[#99907c]">
          {isRtl ? 'خيارات الدفع المتاحة:' : 'Flexible payment available:'}
        </span>
        <span className="px-2 py-0.5 rounded bg-[#201f21] text-[10px] font-bold text-[#d0c5af] tracking-wider border border-[#353437]/30">
          TABBY
        </span>
        <span className="px-2 py-0.5 rounded bg-[#201f21] text-[10px] font-bold text-[#d0c5af] tracking-wider border border-[#353437]/30">
          ZIINA
        </span>
        <span className="px-2 py-0.5 rounded bg-[#201f21] text-[10px] font-bold text-[#d0c5af] tracking-wider border border-[#353437]/30">
          APPLE PAY
        </span>
      </div>
    </div>
  );
};
