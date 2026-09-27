import React, { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { Language, ScreenType, Treatment, BoutiqueProduct } from '../types';
import { TREATMENTS, BOUTIQUE_PRODUCTS } from '../data/mockData';
import { useGridInterval, chunkItems } from '../utils/useGridInterval';
import { CurationBanner } from './CurationBanner';

interface HomeScreenProps {
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  onSelectTreatment: (treatment: Treatment) => void;
  onSelectProduct?: (product: BoutiqueProduct) => void;
  onAddToCart: (product: BoutiqueProduct) => void;
  savedTreatmentIds?: string[];
  savedProductIds?: string[];
  onToggleSaveTreatment?: (id: string) => void;
  onToggleSaveProduct?: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onNavigate,
  onSelectTreatment,
  onSelectProduct,
  onAddToCart,
  savedTreatmentIds = [],
  savedProductIds = [],
  onToggleSaveTreatment,
  onToggleSaveProduct,
}) => {
  const isRtl = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const handleToggleTreatmentHeart = (e: React.MouseEvent, treatment: Treatment) => {
    e.stopPropagation();
    if (onToggleSaveTreatment) {
      const willBeSaved = !savedTreatmentIds.includes(treatment.id);
      onToggleSaveTreatment(treatment.id);
      setAddedToast(
        willBeSaved
          ? (isRtl ? `تم حفظ ${treatment.titleAr} في المفضلة` : `Saved ${treatment.titleEn}`)
          : (isRtl ? `تمت إزالة ${treatment.titleAr} من المفضلة` : `Removed ${treatment.titleEn}`)
      );
      setTimeout(() => setAddedToast(null), 2000);
    }
  };

  const handleToggleProductHeart = (e: React.MouseEvent, product: BoutiqueProduct) => {
    e.stopPropagation();
    if (onToggleSaveProduct) {
      const willBeSaved = !savedProductIds.includes(product.id);
      onToggleSaveProduct(product.id);
      setAddedToast(
        willBeSaved
          ? (isRtl ? `تم حفظ ${product.titleAr} في المفضلة` : `Saved ${product.titleEn}`)
          : (isRtl ? `تمت إزالة ${product.titleAr} من المفضلة` : `Removed ${product.titleEn}`)
      );
      setTimeout(() => setAddedToast(null), 2000);
    }
  };

  const categories = [
    { id: 'all', labelEn: 'All Services', labelAr: 'جميع الخدمات' },
    { id: 'facials', labelEn: 'Skincare', labelAr: 'عناية بالبشرة' },
    { id: 'hair', labelEn: 'Hair Care', labelAr: 'العناية بالشعر' },
    { id: 'hammam', labelEn: 'Hammam & Body', labelAr: 'الحمام المغربي' },
    { id: 'massage', labelEn: 'Massage & Relaxation', labelAr: 'المساج والاسترخاء' },
    { id: 'nails', labelEn: 'Nails & Pedicure', labelAr: 'الأظافر' },
  ];

  const interval = useGridInterval();

  const filteredTreatments = useMemo(() => {
    return selectedCategory === 'all'
      ? TREATMENTS
      : TREATMENTS.filter(t => t.category === selectedCategory);
  }, [selectedCategory]);

  const treatmentChunks = useMemo(() => {
    // Show up to 16 treatments on homepage so desktop has 2 sets of 8, mobile has 4 sets of 4
    return chunkItems(filteredTreatments.slice(0, 16), interval);
  }, [filteredTreatments, interval]);

  const boutiqueHighlights = useMemo(() => {
    return BOUTIQUE_PRODUCTS.slice(0, 8);
  }, []);

  const boutiqueChunks = useMemo(() => {
    return chunkItems(boutiqueHighlights, interval);
  }, [boutiqueHighlights, interval]);

  const handleAddProduct = (product: BoutiqueProduct) => {
    onAddToCart(product);
    setAddedToast(isRtl ? `تمت إضافة ${product.titleAr} إلى الحقيبة` : `Added ${product.titleEn} to Bag`);
    setTimeout(() => setAddedToast(null), 2200);
  };

  return (
    <div className={`flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-2 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Toast feedback */}
      {addedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#201f21] border border-[#f2ca50]/50 text-[#e5e1e4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">check_circle</span>
          <span>{addedToast}</span>
        </div>
      )}

      {/* Top Localization & Status Banner */}
      <div className="pt-2 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#47ea7a] animate-pulse"></span>
          <span className="font-sans text-[11px] md:text-[12px] font-semibold text-white tracking-normal">
            {isRtl ? 'مفتوح الآن' : "We're Open"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201f21] text-[#f2ca50] font-sans text-[11px] md:text-[12px] font-semibold border border-[#353437]/40 shadow-sm">
          <span className="material-symbols-outlined text-[15px]">location_on</span>
          <span>{isRtl ? 'دبي، داون تاون' : 'Dubai, Downtown'}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-2 -mx-4 sm:-mx-6 lg:mx-0 animate-fade-in-up">
        <div className="relative w-full rounded-none lg:rounded-2xl overflow-hidden shadow-2xl bg-[#1b1a1c] px-4 sm:px-6 lg:p-12 py-6 sm:py-8 lg:py-12 min-h-[300px] sm:min-h-[350px] md:min-h-[380px] lg:min-h-[440px] border-y lg:border border-[#353437]/50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85 contrast-125 saturate-135 brightness-100 scale-105 transition-transform duration-1000"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6j7WR1aZZhmNtH4rY9JJb--A5GY7hfoop8fWHZo_YYkIFCwJbyxCPuiO18acyS2sjjeO2E_hkYh1129rvcleHzRElHDS8642K0I1uninuLS53kTam1umlLLmT8adw9Ga8jeNWJz28RZ2voO7At0aY7nkrKVnBIOZtzQ5xAkJZd860wZ0ip6ikEPThOiBXR_seHpk3w428cwDLv684_CoSN_NLvkRc-o0ZX5teIgS3e1BR2T9p95kz')`,
            }}
          />
          {/* Subtle directional gradients for rich color and clear typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#131315]/65 to-transparent pointer-events-none"></div>
          <div className={`absolute inset-0 ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#131315]/80 via-[#131315]/30 to-transparent pointer-events-none`}></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex flex-col gap-2 sm:gap-2.5 max-w-2xl">
              <span className="font-sans text-[10.5px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-[#f2ca50] drop-shadow-sm">
                {isRtl ? 'عناية فائقة بالجمال' : 'Premium Beauty Care'}
              </span>

              <h1 className="font-serif text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] text-[#e5e1e4] font-semibold tracking-tight leading-tight">
                {isRtl ? (
                  <>فن الجمال <br />والعناية بالبشرة</>
                ) : (
                  <>The Art of Beauty <br />&amp; Restorative Care</>
                )}
              </h1>

              <p className="font-sans text-[12.5px] sm:text-[13.5px] md:text-[14.5px] text-[#d0c5af] leading-relaxed max-w-xl">
                {isRtl
                  ? 'استمتعي بأفضل علاجات البشرة، الشعر، الحمام المغربي، والأظافر في قلب دبي.'
                  : 'Experience premier aesthetic skincare, hair therapy, Moroccan hammam, and nail care in Downtown Dubai.'}
              </p>

              <div className="flex items-center gap-2.5 sm:gap-3 mt-1 sm:mt-2">
                <button
                  onClick={() => onNavigate('booking')}
                  className="h-9 sm:h-10 px-4.5 sm:px-5.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[12px] sm:text-[13px] font-bold tracking-wide text-center shadow-[0_6px_16px_rgba(212,175,55,0.28)] hover:shadow-[0_10px_24px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  type="button"
                >
                  <span>{isRtl ? 'احجز موعدك' : 'Book Appointment'}</span>
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                    {isRtl ? 'arrow_back' : 'arrow_forward'}
                  </span>
                </button>

                <a
                  href="https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20I%20would%20like%20to%20inquire%20about%20booking%20an%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 flex items-center justify-center hover:bg-[#25D366]/30 active:scale-95 transition-all shrink-0"
                  aria-label="WhatsApp Guest Care"
                  title="WhatsApp Support"
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chat</span>
                </a>
              </div>
            </div>

            {/* Desktop / Tablet Atmospheric Highlights */}
            <div className="hidden md:flex flex-col gap-2.5 p-4 rounded-2xl bg-[#1b1b1d]/85 backdrop-blur-md border border-[#353437]/60 text-left min-w-[240px]">
              <div className="flex items-center gap-2">
                <span className="text-[#f2ca50] text-[16px]">★★★★★</span>
                <span className="font-sans text-[12px] font-bold text-[#e5e1e4]">4.9 · 500+ Reviews</span>
              </div>
              <div className="h-px bg-[#353437]/50 w-full" />
              <div className="flex items-center gap-2 text-[#d0c5af] text-[12px]">
                <span className="material-symbols-outlined text-[#f2ca50] text-[16px]">verified</span>
                <span>{isRtl ? 'أجنحة خاصة وكبار الأخصائيات' : 'Private VIP Suites'}</span>
              </div>
              <div className="flex items-center gap-2 text-[#d0c5af] text-[12px]">
                <span className="material-symbols-outlined text-[#f2ca50] text-[16px]">local_parking</span>
                <span>{isRtl ? 'خدمة صف سيارات مجانية' : 'Complimentary Valet'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Filter Pills */}
      <div className="py-3 overflow-x-auto no-scrollbar md:overflow-visible -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
        <div className="flex items-center gap-2 w-max md:w-full md:flex-wrap">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all'
              ? TREATMENTS.length
              : TREATMENTS.filter(t => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full font-sans text-[12px] font-semibold transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#f2ca50] text-[#241a00] shadow-md'
                    : 'bg-[#201f21] text-[#d0c5af] hover:text-[#e5e1e4] border border-[#353437]/40'
                }`}
                type="button"
              >
                <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-[#241a00]/20 text-[#241a00]' : 'bg-[#2a2a2c] text-[#99907c]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Services Section (Responsive Grid across Mobile, Tablet, Desktop) */}
      <section className="py-3 reveal-on-scroll">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <h2 className="font-serif text-[20px] md:text-[24px] text-[#e5e1e4] font-medium">
              {isRtl ? 'الخدمات المتوفرة' : 'Featured Services'}
            </h2>
            <span className="font-sans text-[12px] text-[#99907c]">
              ({filteredTreatments.length})
            </span>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="font-sans text-[12px] text-[#f2ca50] flex items-center gap-1 hover:opacity-80 font-semibold"
            type="button"
          >
            <span>{isRtl ? 'عرض القائمة الكاملة' : 'View Full Menu'}</span>
            <span className="material-symbols-outlined text-[16px]">
              {isRtl ? 'chevron_left' : 'chevron_right'}
            </span>
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          {treatmentChunks.map((chunk, chunkIdx) => (
            <React.Fragment key={chunkIdx}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6">
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
                          onClick={(e) => handleToggleTreatmentHeart(e, treatment)}
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
                        {/* Service Visual */}
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#201f21] mb-2.5 relative border border-[#353437]/40">
                          <img
                            src={treatment.imageUrl}
                            alt={isRtl ? treatment.titleAr : treatment.titleEn}
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
                          className="w-full h-[40px] rounded-xl bg-[#2a2a2c] hover:bg-[#f2ca50] hover:text-[#241a00] text-[#e5e1e4] font-sans text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
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
                  onAction={() => onNavigate('services')}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Packages & VIP Dual Banner Grid (1 col on mobile, 2 col on tablet & desktop) */}
      <section className="py-3 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 reveal-on-scroll">
        {/* Packages Showcase Banner */}
        <div
          onClick={() => onNavigate('packages')}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#201f21] via-[#2a2a2c] to-[#201f21] p-5 md:p-6 border border-[#f2ca50]/30 shadow-lg cursor-pointer group flex flex-col justify-between luxury-card-hover"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f2ca50]/15 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10 gap-3">
            <div className="flex flex-col gap-1 max-w-xl">
              <span className="font-sans text-[10px] text-[#f2ca50] tracking-widest uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]"></span>
                {isRtl ? 'باقات متكاملة' : 'Service Packages'}
              </span>
              <h3 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold group-hover:text-[#f2ca50] transition-colors">
                {isRtl ? 'برامج العناية الشاملة' : 'Multi-Phase Treatment Packages'}
              </h3>
              <p className="font-sans text-[12px] md:text-[13px] text-[#d0c5af]">
                {isRtl
                  ? 'باقات علاجية متكاملة توفر حتى 170 درهم مع مزايا استثنائية'
                  : 'Multi-service combinations saving up to AED 170 with premier curated rituals'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f2ca50] text-[#241a00] flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">
                {isRtl ? 'arrow_back' : 'arrow_forward'}
              </span>
            </div>
          </div>
        </div>

        {/* VIP Membership Teaser */}
        <div
          onClick={() => onNavigate('vip')}
          className="p-5 md:p-6 rounded-2xl bg-gradient-to-l from-[#2a2a2c] via-[#201f21] to-[#1b1b1d] relative overflow-hidden border border-[#353437]/50 shadow-md cursor-pointer luxury-card-hover group flex flex-col justify-between"
        >
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-[#f2ca50]/10 blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 max-w-xl">
              <span className="font-sans text-[11px] font-bold text-[#f2ca50] tracking-wider uppercase flex items-center gap-1">
                <span>{isRtl ? 'عضوية النخبة' : 'NABSHÉ Club'}</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </span>
              <h3 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold group-hover:text-[#f2ca50] transition-colors">
                {isRtl ? 'عضوية NABSHÉ VIP' : 'NABSHÉ VIP Membership'}
              </h3>
              <p className="font-sans text-[12px] md:text-[13px] text-[#d0c5af]">
                {isRtl
                  ? 'استمتعي بمزايا الأولوية وخصومات حصرية على الخدمات والمنتجات.'
                  : 'Enjoy priority reservation privileges, discounts, and complimentary treatments.'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#d4af37] text-[#241a00] flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Links */}
      <section className="py-3 grid grid-cols-3 gap-3 md:gap-5 reveal-on-scroll">
        <button
          onClick={() => onNavigate('diagnostic')}
          className="p-3.5 sm:p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 luxury-card-hover flex flex-col items-center text-center gap-1.5 active:scale-95 shadow-sm group cursor-pointer"
          type="button"
        >
          <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f2ca50]/15 flex items-center justify-center text-[#f2ca50] group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">psychology_alt</span>
          </span>
          <span className="font-serif text-[13px] sm:text-[14px] md:text-[15px] text-[#e5e1e4] font-semibold group-hover:text-[#f2ca50] transition-colors">
            {isRtl ? 'فحص البشرة' : 'Skin Match'}
          </span>
          <span className="font-sans text-[11px] sm:text-[12px] text-[#99907c]">
            {isRtl ? 'استشارة 3 خطوات' : '3-Step Quiz'}
          </span>
        </button>

        <button
          onClick={() => onNavigate('artisans')}
          className="p-3.5 sm:p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 luxury-card-hover flex flex-col items-center text-center gap-1.5 active:scale-95 shadow-sm group cursor-pointer"
          type="button"
        >
          <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f2ca50]/15 flex items-center justify-center text-[#f2ca50] group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">group</span>
          </span>
          <span className="font-serif text-[13px] sm:text-[14px] md:text-[15px] text-[#e5e1e4] font-semibold group-hover:text-[#f2ca50] transition-colors">
            {isRtl ? 'الأخصائيات' : 'Specialists'}
          </span>
          <span className="font-sans text-[11px] sm:text-[12px] text-[#99907c]">
            {isRtl ? 'فريق العمل' : 'Our Team'}
          </span>
        </button>

        <button
          onClick={() => onNavigate('story')}
          className="p-3.5 sm:p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 luxury-card-hover flex flex-col items-center text-center gap-1.5 active:scale-95 shadow-sm group cursor-pointer"
          type="button"
        >
          <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f2ca50]/15 flex items-center justify-center text-[#f2ca50] group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">history_edu</span>
          </span>
          <span className="font-serif text-[13px] sm:text-[14px] md:text-[15px] text-[#e5e1e4] font-semibold group-hover:text-[#f2ca50] transition-colors">
            {isRtl ? 'عن الصالون' : 'About Us'}
          </span>
          <span className="font-sans text-[11px] sm:text-[12px] text-[#99907c]">
            {isRtl ? 'الرؤية والموقع' : 'Location & Vision'}
          </span>
        </button>
      </section>

      {/* Shop Products Showcase */}
      <section className="py-3 reveal-on-scroll">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-[20px] md:text-[24px] text-[#e5e1e4] font-medium">
            {isRtl ? 'منتجات المتجر' : 'Shop Products'}
          </h2>
          <button
            onClick={() => onNavigate('shop')}
            className="font-sans text-[12px] text-[#f2ca50] flex items-center gap-1 hover:opacity-80 font-semibold"
            type="button"
          >
            <span>{isRtl ? 'تصفح المتجر' : 'Explore Shop'}</span>
            <span className="material-symbols-outlined text-[16px]">
              {isRtl ? 'chevron_left' : 'chevron_right'}
            </span>
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          {boutiqueChunks.map((chunk, chunkIdx) => (
            <React.Fragment key={chunkIdx}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6">
                {chunk.map(product => {
                  const isSaved = savedProductIds.includes(product.id);
                  return (
                    <article
                      key={product.id}
                      role="button"
                      tabIndex={0}
                      aria-label={isRtl ? `عرض تفاصيل ${product.titleAr}` : `View details for ${product.titleEn}`}
                      onClick={() => onSelectProduct && onSelectProduct(product)}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
                          e.preventDefault();
                          onSelectProduct && onSelectProduct(product);
                        }
                      }}
                      className="flex flex-col justify-between bg-[#1b1b1d] rounded-2xl p-2.5 sm:p-3 md:p-3.5 lg:p-4 border border-[#353437]/50 shadow-md group relative overflow-hidden luxury-card-hover cursor-pointer"
                    >
                      {/* Top Tag & Heart Button Row */}
                      <div className="flex items-center justify-between mb-2 z-10 relative">
                        <span
                          className={`font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                            product.inStock
                              ? 'bg-[#201f21]/90 backdrop-blur-md text-[#f2ca50] border border-[#f2ca50]/30'
                              : 'bg-[#ff5e5e]/90 text-[#ffffff]'
                          }`}
                        >
                          {isRtl ? product.tagAr : product.tagEn}
                        </span>

                        <button
                          onClick={(e) => handleToggleProductHeart(e, product)}
                          className={`w-7 h-7 rounded-full bg-[#201f21]/80 backdrop-blur-md border border-[#353437]/50 flex items-center justify-center transition-all active:scale-90 ${
                            isSaved
                              ? 'text-[#f2ca50] bg-[#f2ca50]/15 border-[#f2ca50]/40'
                              : 'text-[#d0c5af] hover:text-[#f2ca50]'
                          }`}
                          type="button"
                          aria-label="Save product"
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
                        {/* Product Visual */}
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#201f21] mb-2.5 relative border border-[#353437]/40">
                          <img
                            src={product.imageUrl}
                            alt={isRtl ? product.titleAr : product.titleEn}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          />
                        </div>

                        {/* Title & Volume */}
                        <h3 className="font-sans text-[13px] md:text-[14px] font-semibold text-[#e5e1e4] leading-snug line-clamp-2 group-hover:text-[#f2ca50] transition-colors">
                          {isRtl ? product.titleAr : product.titleEn}
                        </h3>
                        <span className="font-sans text-[11px] text-[#d0c5af] block mt-0.5">
                          {isRtl ? product.volumeAr : product.volumeEn}
                        </span>
                      </div>

                      {/* Price & Action Row */}
                      <div className="mt-3 pt-2.5 border-t border-[#353437]/40 flex flex-col gap-1.5">
                        <div className="flex items-baseline justify-between">
                          <span className="font-sans text-[13.5px] sm:text-[14px] md:text-[14.5px] font-bold text-[#f2ca50] whitespace-nowrap">
                            AED {product.price}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddProduct(product);
                          }}
                          className="w-full h-[40px] rounded-xl bg-[#2a2a2c] hover:bg-[#f2ca50] hover:text-[#241a00] text-[#e5e1e4] font-sans text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1.5 hover:shadow-[0_4px_16px_rgba(242,202,80,0.3)] transition-all duration-200 active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px] shrink-0">shopping_bag</span>
                          <span className="whitespace-nowrap">{isRtl ? 'إضافة للحقيبة' : 'Add to Bag'}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Full-width editorial banner with video/placeholder after each interval */}
              {chunkIdx < boutiqueChunks.length - 1 && (
                <CurationBanner
                  index={chunkIdx}
                  type="product"
                  isRtl={isRtl}
                  onNavigate={onNavigate}
                  onAction={() => onNavigate('shop')}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};
