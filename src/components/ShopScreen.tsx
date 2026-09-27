import React, { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { Language, ScreenType, BoutiqueProduct, CartItem } from '../types';
import { BOUTIQUE_PRODUCTS } from '../data/mockData';
import { useGridInterval, chunkItems } from '../utils/useGridInterval';
import { CurationBanner } from './CurationBanner';
import { HeaderVideoReel } from './HeaderVideoReel';

interface ShopScreenProps {
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  cart: CartItem[];
  onAddToCart: (product: BoutiqueProduct) => void;
  onOpenCartModal: () => void;
  savedProductIds?: string[];
  onToggleSaveProduct?: (id: string) => void;
  onSelectProduct?: (product: BoutiqueProduct) => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  language,
  onNavigate,
  cart,
  onAddToCart,
  onOpenCartModal,
  savedProductIds = [],
  onToggleSaveProduct,
  onSelectProduct,
}) => {
  const isRtl = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notifyToast, setNotifyToast] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const handleToggleHeart = (product: BoutiqueProduct) => {
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
    { id: 'all', labelEn: 'All Products', labelAr: 'الكل' },
    { id: 'serums', labelEn: 'Serums & Oils', labelAr: 'السيروم والزيوت' },
    { id: 'hair', labelEn: 'Hair Care', labelAr: 'العناية بالشعر' },
    { id: 'fragrance', labelEn: 'Fragrance & Oud', labelAr: 'العطور والعود' },
    { id: 'body', labelEn: 'Body & Bath', labelAr: 'الجسم والاستحمام' },
    { id: 'tools', labelEn: 'Beauty Tools', labelAr: 'أدوات العناية' },
  ];

  const interval = useGridInterval();

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return BOUTIQUE_PRODUCTS;
    return BOUTIQUE_PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const productChunks = useMemo(() => {
    return chunkItems(filteredProducts, interval);
  }, [filteredProducts, interval]);

  const handleNotifyMe = (product: BoutiqueProduct) => {
    setNotifyToast(
      isRtl
        ? `سنخبرك عبر واتساب فور توفر ${product.titleAr}`
        : `We will notify you via WhatsApp when ${product.titleEn} is back in stock.`
    );
    setTimeout(() => setNotifyToast(null), 3000);
  };

  const handleAdd = (product: BoutiqueProduct) => {
    onAddToCart(product);
    setAddedToast(
      isRtl ? `تمت إضافة ${product.titleAr} إلى حقيبة التسوق` : `Added ${product.titleEn} to Bag`
    );
    setTimeout(() => setAddedToast(null), 2000);
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className={`flex flex-col w-full max-w-7xl mx-auto pb-36 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#201f21] border border-[#f2ca50]/50 text-[#e5e1e4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">shopping_bag</span>
          <span>{addedToast}</span>
        </div>
      )}

      {notifyToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#201f21] border border-[#47ea7a]/50 text-[#e5e1e4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#47ea7a] text-[18px]">notifications_active</span>
          <span>{notifyToast}</span>
        </div>
      )}

      {/* Header Intro: 2 Columns on Mobile, Tablet & Desktop (70% text / 30% compact portrait video) */}
      <section className="pt-1 pb-3 flex items-center justify-between gap-3 sm:gap-5">
        {/* Left Column (70% width) */}
        <div className="w-[68%] sm:w-[70%] flex flex-col gap-1 min-w-0">
          <span className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]">
            {isRtl ? 'منتجات الجمال' : 'BEAUTY PRODUCTS'}
          </span>
          <h1 className="font-serif text-[24px] sm:text-[30px] md:text-[36px] text-[#e5e1e4] font-semibold tracking-tight">
            {isRtl ? 'المتجر' : 'SHOP'}
          </h1>
          <p className="font-sans text-[12px] sm:text-[13px] md:text-[14px] text-[#d0c5af] leading-relaxed line-clamp-3 sm:line-clamp-none">
            {isRtl
              ? 'مستحضرات عناية معتمدة تم اختيارها بعناية للحفاظ على صحة ونضارة بشرتك وشعرك في المنزل.'
              : 'Professional salon-grade skincare, hair treatments, and personal care products for daily home routines.'}
          </p>

          <div className="hidden sm:inline-flex items-center gap-1.5 mt-1 text-[11px] text-[#99907c] font-sans">
            <span className="material-symbols-outlined text-[#f2ca50] text-[15px]">verified</span>
            <span>{isRtl ? 'منتجات أصلية 100% معتمدة' : '100% Authentic Professional Grade'}</span>
          </div>
        </div>

        {/* Right Column (30% width, compact portrait reel) - seamlessly blends with background, no gold outline */}
        <div className="w-[32%] sm:w-[30%] max-w-[120px] sm:max-w-[140px] md:max-w-[155px] shrink-0">
          <HeaderVideoReel
            src="/assets/Video-Clips/Luxury-Skincare-Serum.mp4"
            poster="/assets/Images/Vital-Serum.jpg"
          />
        </div>
      </section>

      {/* Category Pills: scroll on mobile, flex wrap on tablet/desktop */}
      <div className="py-2.5 overflow-x-auto no-scrollbar md:overflow-visible -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
        <div className="flex items-center gap-2 w-max md:w-full md:flex-wrap">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full font-sans text-[12px] font-semibold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
                    : 'bg-[#201f21] text-[#d0c5af] hover:text-[#e5e1e4] border border-[#353437]/40'
                }`}
                type="button"
              >
                {isRtl ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Product Grid with Editorial Banners between intervals */}
      <div className="flex flex-col space-y-4 my-4">
        {productChunks.map((chunk, chunkIdx) => (
          <React.Fragment key={chunkIdx}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 reveal-on-scroll">
              {chunk.map(product => {
                const isSaved = savedProductIds.includes(product.id);
                return (
                  <article
                    key={product.id}
                    role="button"
                    tabIndex={0}
                    aria-label={isRtl ? `عرض تفاصيل ${product.titleAr}` : `View details for ${product.titleEn}`}
                    onClick={() => onSelectProduct?.(product)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
                        e.preventDefault();
                        onSelectProduct?.(product);
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleHeart(product);
                        }}
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
                          alt={product.titleEn}
                          className={`w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out ${
                            !product.inStock ? 'opacity-40 grayscale' : ''
                          }`}
                        />
                      </div>

                      {/* Title & Volume */}
                      <h2 className="font-sans text-[13px] md:text-[14px] font-semibold text-[#e5e1e4] leading-snug line-clamp-2 group-hover:text-[#f2ca50] transition-colors">
                        {isRtl ? product.titleAr : product.titleEn}
                      </h2>
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

                      {product.inStock ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdd(product);
                          }}
                          className="w-full h-[40px] rounded-xl bg-[#2a2a2c] hover:bg-[#f2ca50] hover:text-[#241a00] text-[#e5e1e4] font-sans text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1.5 hover:shadow-[0_4px_16px_rgba(242,202,80,0.3)] transition-all duration-200 active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px] shrink-0">shopping_bag</span>
                          <span className="whitespace-nowrap">{isRtl ? 'إضافة للحقيبة' : 'Add to Bag'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotifyMe(product);
                          }}
                          className="w-full h-[40px] rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#99907c] hover:text-[#e5e1e4] font-sans text-[10.5px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 border border-[#353437]/50 active:scale-95 transition-colors cursor-pointer whitespace-nowrap"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[15px] shrink-0">notifications</span>
                          <span className="whitespace-nowrap">{isRtl ? 'إشعار بالتوفر' : 'Notify on WhatsApp'}</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Full-width editorial banner with video/placeholder after each interval */}
            {chunkIdx < productChunks.length - 1 && (
              <CurationBanner
                index={chunkIdx}
                type="product"
                isRtl={isRtl}
                onNavigate={onNavigate}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* UAE Delivery Information */}
      <section className="mt-4 mb-2 p-4 sm:p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 flex items-center gap-3.5 shadow-md">
        <div className="w-10 h-10 rounded-full bg-[#f2ca50]/15 flex items-center justify-center text-[#f2ca50] shrink-0">
          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
        </div>
        <div className="flex flex-col">
          <span className="font-sans text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider">
            {isRtl ? 'توصيل محلي في الإمارات' : 'UAE Delivery'}
          </span>
          <p className="font-sans text-[12px] md:text-[13px] text-[#d0c5af] leading-relaxed">
            {isRtl
              ? 'توصيل سريع داخل دبي والإمارات مع تغليف آمن للحفاظ على جودة المستحضرات.'
              : 'Fast courier delivery across Dubai and all UAE emirates with temperature-controlled packaging.'}
          </p>
        </div>
      </section>

      {/* Sticky Floating Bag Summary Bar - positioned with clear clearance above bottom nav and floating bag button */}
      {cartTotalItems > 0 && (
        <div className="fixed bottom-[86px] md:bottom-6 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none">
          <div className="max-w-xl mx-auto bg-[#201f21]/95 backdrop-blur-md border border-[#f2ca50]/60 rounded-xl sm:rounded-2xl py-2 px-3 sm:py-2.5 sm:px-4 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2.5 animate-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f2ca50] text-[#241a00] flex items-center justify-center font-bold text-[11px] sm:text-[12px] shrink-0 shadow-sm">
                {cartTotalItems}
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[11px] text-[#e5e1e4] font-medium leading-tight">
                  {isRtl ? 'حقيبة التسوق' : 'Shopping Bag'}
                </span>
                <span className="font-sans text-[13px] sm:text-[14px] font-bold text-[#f2ca50] leading-tight">
                  AED {cartTotalPrice}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenCartModal}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[11px] sm:text-[12px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1 active:scale-95 transition-transform"
              type="button"
            >
              <span>{isRtl ? 'مراجعة الحقيبة' : 'Review Bag'}</span>
              <span className="material-symbols-outlined text-[15px]">
                {isRtl ? 'arrow_back' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
