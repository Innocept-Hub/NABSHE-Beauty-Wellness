import React, { useState, useMemo } from 'react';
import { Language, ScreenType, Treatment, BoutiqueProduct } from '../types';
import { TREATMENTS, BOUTIQUE_PRODUCTS } from '../data/mockData';

interface SearchScreenProps {
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  onSelectTreatment: (treatment: Treatment) => void;
  onAddToCart: (product: BoutiqueProduct) => void;
  onSelectProduct?: (product: BoutiqueProduct) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  language,
  onNavigate,
  onSelectTreatment,
  onAddToCart,
  onSelectProduct,
}) => {
  const isRtl = language === 'ar';
  const [query, setQuery] = useState<string>('gold');
  const [filterType, setFilterType] = useState<'all' | 'treatments' | 'products'>('all');
  const [forceNoResults, setForceNoResults] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const suggestedTags = [
    { en: '24K Gold', ar: 'ذهب 24' },
    { en: 'Caviar', ar: 'كافيار' },
    { en: 'Hammam', ar: 'حمام مغربي' },
    { en: 'Hair Care', ar: 'عناية الشعر' },
    { en: 'Oud Mist', ar: 'رذاذ العود' },
    { en: 'Massage', ar: 'مساج' },
  ];

  const results = useMemo(() => {
    if (forceNoResults) return { treatments: [], products: [] };
    const q = query.toLowerCase().trim();
    if (!q) return { treatments: [], products: [] };

    const tr = TREATMENTS.filter(t =>
      t.titleEn.toLowerCase().includes(q) ||
      t.titleAr.toLowerCase().includes(q) ||
      t.descriptionEn.toLowerCase().includes(q) ||
      t.descriptionAr.toLowerCase().includes(q)
    );

    const pr = BOUTIQUE_PRODUCTS.filter(p =>
      p.titleEn.toLowerCase().includes(q) ||
      p.titleAr.toLowerCase().includes(q) ||
      p.descriptionEn.toLowerCase().includes(q) ||
      p.descriptionAr.toLowerCase().includes(q)
    );

    return { treatments: tr, products: pr };
  }, [query, forceNoResults]);

  const hasAnyResults = results.treatments.length > 0 || results.products.length > 0;

  const handleProductAdd = (p: BoutiqueProduct) => {
    onAddToCart(p);
    setAddedToast(isRtl ? `تمت إضافة ${p.titleAr} إلى الحقيبة` : `Added ${p.titleEn} to Bag`);
    setTimeout(() => setAddedToast(null), 2000);
  };

  return (
    <div className={`flex flex-col w-full max-w-7xl mx-auto pb-32 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Toast */}
      {addedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#201f21] border border-[#f2ca50]/50 text-[#e5e1e4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">shopping_bag</span>
          <span>{addedToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-[#353437]/40 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-8 h-8 rounded-full bg-[#201f21] flex items-center justify-center text-[#e5e1e4] hover:text-[#f2ca50]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isRtl ? 'arrow_forward' : 'arrow_back'}
            </span>
          </button>
          <span className="font-serif text-[18px] text-[#e5e1e4] font-semibold">
            {isRtl ? 'البحث عن الخدمات والمنتجات' : 'Search Services & Products'}
          </span>
        </div>

        {/* State Toggle */}
        <button
          onClick={() => {
            setForceNoResults(!forceNoResults);
            if (!forceNoResults) {
              setQuery('xyz-unmatched');
            } else {
              setQuery('gold');
            }
          }}
          className={`px-3 py-1 rounded-full text-[10px] font-sans font-bold border transition-colors ${
            forceNoResults
              ? 'bg-[#ff5e5e]/20 text-[#ff8e8e] border-[#ff5e5e]/40'
              : 'bg-[#201f21] text-[#f2ca50] border-[#f2ca50]/40'
          }`}
          type="button"
          title="Toggle between State 1 (Results) and State 2 (No Results)"
        >
          {forceNoResults ? (isRtl ? 'معاينة: بدون نتائج' : 'Preview: No Results') : (isRtl ? 'معاينة: توجد نتائج' : 'Preview: Has Results')}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full my-2">
        <div className="relative flex items-center bg-[#201f21] rounded-2xl border border-[#353437]/50 shadow-inner focus-within:border-[#f2ca50]/60 transition-all">
          <span className="material-symbols-outlined absolute left-4 text-[#f2ca50] text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setForceNoResults(false);
            }}
            placeholder={isRtl ? 'ابحثي عن خدمة معينة، ذهب، شعر، أو مستحضرات...' : 'Search services, gold facial, hair, products...'}
            className="w-full bg-transparent py-3.5 pl-11 pr-11 text-[#e5e1e4] font-sans text-[13px] placeholder:text-[#99907c] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setForceNoResults(false); }}
              className="absolute right-3.5 w-6 h-6 rounded-full bg-[#2a2a2c] flex items-center justify-center text-[#d0c5af] hover:text-[#e5e1e4]"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <span className="font-sans text-[10px] text-[#99907c] uppercase font-bold shrink-0">
          {isRtl ? 'الأكثر طلباً:' : 'Popular:'}
        </span>
        {suggestedTags.map(tag => (
          <button
            key={tag.en}
            onClick={() => {
              setQuery(tag.en);
              setForceNoResults(false);
            }}
            className="shrink-0 px-3 py-1 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#d0c5af] hover:text-[#f2ca50] font-sans text-[11px] border border-[#353437]/30 transition-colors"
            type="button"
          >
            {isRtl ? tag.ar : tag.en}
          </button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center bg-[#201f21] p-1 rounded-xl border border-[#353437]/50 my-2">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-sans font-bold transition-all ${
            filterType === 'all'
              ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
              : 'text-[#d0c5af] hover:text-[#e5e1e4]'
          }`}
          type="button"
        >
          {isRtl ? 'جميع النتائج' : 'All Matches'}
        </button>
        <button
          onClick={() => setFilterType('treatments')}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-sans font-bold transition-all ${
            filterType === 'treatments'
              ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
              : 'text-[#d0c5af] hover:text-[#e5e1e4]'
          }`}
          type="button"
        >
          {isRtl ? 'الخدمات' : 'Services'}
        </button>
        <button
          onClick={() => setFilterType('products')}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-sans font-bold transition-all ${
            filterType === 'products'
              ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
              : 'text-[#d0c5af] hover:text-[#e5e1e4]'
          }`}
          type="button"
        >
          {isRtl ? 'المنتجات' : 'Products'}
        </button>
      </div>

      {/* Results View or No Results State */}
      <div className="space-y-4 my-2">
        {hasAnyResults ? (
          <>
            {/* Treatments Section */}
            {(filterType === 'all' || filterType === 'treatments') && results.treatments.length > 0 && (
              <div className="space-y-2.5">
                <span className="font-sans text-[11px] text-[#f2ca50] uppercase tracking-wider font-bold block">
                  {isRtl ? 'الخدمات المطابقة' : 'Service Matches'}
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6">
                  {results.treatments.map(t => (
                    <article
                      key={t.id}
                      onClick={() => onSelectTreatment(t)}
                      className="flex flex-col justify-between bg-[#1b1b1d] rounded-2xl p-2.5 sm:p-3 md:p-3.5 lg:p-4 border border-[#353437]/50 shadow-md group relative overflow-hidden transition-all hover:border-[#f2ca50]/40 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2 z-10 relative">
                        <span className="font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm bg-[#201f21]/90 backdrop-blur-md text-[#f2ca50] border border-[#f2ca50]/30">
                          {t.duration} {isRtl ? 'دقيقة' : 'MIN'}
                        </span>
                      </div>
                      <div>
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#201f21] mb-2.5 relative border border-[#353437]/40">
                          <img
                            src={t.imageUrl}
                            alt={isRtl ? t.titleAr : t.titleEn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h4 className="font-sans text-[13px] md:text-[14px] font-semibold text-[#e5e1e4] leading-snug line-clamp-2 group-hover:text-[#f2ca50] transition-colors">
                          {isRtl ? t.titleAr : t.titleEn}
                        </h4>
                        <span className="font-sans text-[11px] text-[#d0c5af] block mt-0.5">
                          {t.suiteEn}
                        </span>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-[#353437]/40 flex flex-col gap-1.5">
                        <div className="flex items-baseline justify-between">
                          <span className="font-sans text-[13.5px] sm:text-[14px] md:text-[14.5px] font-bold text-[#f2ca50] whitespace-nowrap">
                            AED {t.price}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTreatment(t);
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
                  ))}
                </div>
              </div>
            )}

            {/* Boutique Products Section */}
            {(filterType === 'all' || filterType === 'products') && results.products.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="font-sans text-[11px] text-[#f2ca50] uppercase tracking-wider font-bold block">
                  {isRtl ? 'منتجات المتجر المطابقة' : 'Product Matches'}
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6">
                  {results.products.map(p => (
                    <article
                      key={p.id}
                      onClick={() => onSelectProduct?.(p)}
                      className="flex flex-col justify-between bg-[#1b1b1d] rounded-2xl p-2.5 sm:p-3 md:p-3.5 lg:p-4 border border-[#353437]/50 shadow-md group relative overflow-hidden transition-all hover:border-[#f2ca50]/40 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2 z-10 relative">
                        <span className="font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm bg-[#201f21]/90 backdrop-blur-md text-[#f2ca50] border border-[#f2ca50]/30">
                          {isRtl ? p.tagAr : p.tagEn}
                        </span>
                      </div>
                      <div>
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#201f21] mb-2.5 relative border border-[#353437]/40">
                          <img
                            src={p.imageUrl}
                            alt={isRtl ? p.titleAr : p.titleEn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h4 className="font-sans text-[13px] md:text-[14px] font-semibold text-[#e5e1e4] leading-snug line-clamp-2">
                          {isRtl ? p.titleAr : p.titleEn}
                        </h4>
                        <span className="font-sans text-[11px] text-[#d0c5af] block mt-0.5">
                          {isRtl ? p.volumeAr : p.volumeEn}
                        </span>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-[#353437]/40 flex flex-col gap-1.5">
                        <div className="flex items-baseline justify-between">
                          <span className="font-sans text-[13.5px] sm:text-[14px] md:text-[14.5px] font-bold text-[#f2ca50] whitespace-nowrap">
                            AED {p.price}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductAdd(p);
                          }}
                          className="w-full h-[40px] rounded-xl bg-[#2a2a2c] hover:bg-[#f2ca50] hover:text-[#241a00] text-[#e5e1e4] font-sans text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px] shrink-0">shopping_bag</span>
                          <span className="whitespace-nowrap">{isRtl ? 'إضافة للحقيبة' : 'Add to Bag'}</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* State 2: No Results Found */
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-3 bg-[#1b1b1d] rounded-2xl border border-[#353437]/50 p-6 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-[#201f21] flex items-center justify-center text-[#f2ca50]">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <h3 className="font-serif text-[18px] text-[#e5e1e4] font-semibold">
              {isRtl ? `لم نجد أي نتائج تطابق "${query}"` : `No Results Found Matching "${query}"`}
            </h3>
            <p className="font-sans text-[12px] text-[#d0c5af] max-w-xs leading-relaxed">
              {isRtl
                ? 'جربي البحث عن خدمات أخرى أو تواصلي مع فريق الصالون عبر واتساب.'
                : 'Try browsing our services or contact our salon team via WhatsApp.'}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => { setQuery('facial'); setForceNoResults(false); }}
                className="px-4 py-2 rounded-full bg-[#f2ca50] text-[#241a00] font-sans text-[11px] font-bold"
                type="button"
              >
                {isRtl ? 'عرض جلسات العناية بالوجه' : 'Browse Facials'}
              </button>
              <a
                href="https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20I%20am%20searching%20for%20a%20service."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-full bg-[#201f21] text-[#47ea7a] font-sans text-[11px] font-bold border border-[#353437]/40 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">chat</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
