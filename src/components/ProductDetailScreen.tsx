import React, { useState } from 'react';
import { Heart, ZoomIn, X, ShoppingBag, ShieldCheck, Sparkles, Check, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { BoutiqueProduct, Language, ScreenType } from '../types';

interface ProductDetailScreenProps {
  product: BoutiqueProduct;
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  onAddToCart: (product: BoutiqueProduct, quantity?: number) => void;
  onOpenCartModal: () => void;
  isSaved?: boolean;
  onToggleSave?: (productId: string) => void;
  allProducts?: BoutiqueProduct[];
  onSelectProduct?: (product: BoutiqueProduct) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  language,
  onNavigate,
  onAddToCart,
  onOpenCartModal,
  isSaved: externalIsSaved,
  onToggleSave,
  allProducts = [],
  onSelectProduct,
}) => {
  const isRtl = language === 'ar';
  const [internalIsSaved, setInternalIsSaved] = useState<boolean>(false);
  const isSaved = externalIsSaved !== undefined ? externalIsSaved : internalIsSaved;
  const [quantity, setQuantity] = useState<number>(1);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage'>('description');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleBookmark = () => {
    if (onToggleSave) {
      onToggleSave(product.id);
    } else {
      setInternalIsSaved(!internalIsSaved);
    }
    showToast(
      !isSaved
        ? (isRtl ? 'تم الحفظ في قائمة المفضلة' : 'Saved to Wishlist')
        : (isRtl ? 'تمت الإزالة من المفضلة' : 'Removed from Wishlist')
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.titleEn} | NABSHÉ Boutique`,
        text: product.descriptionEn,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast(isRtl ? 'تم نسخ رابط المنتج' : 'Product link copied to clipboard');
    }
  };

  const handleAddQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const handleMinusQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    showToast(
      isRtl
        ? `تمت إضافة ${quantity} من ${product.titleAr} إلى الحقيبة`
        : `Added ${quantity} × ${product.titleEn} to Bag`
    );
  };

  const handleWhatsAppInquiry = () => {
    const text = isRtl
      ? `مرحباً نبشي بيوتي، أود الاستفسار عن منتج: ${product.titleEn} (AED ${product.price})`
      : `Hello NABSHÉ Beauty, I would like to inquire about: ${product.titleEn} (AED ${product.price})`;
    window.open(`https://wa.me/971509196975?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || !product.category))
    .slice(0, 4);

  const totalCalculated = product.price * quantity;
  const tabbyInstallment = (totalCalculated / 4).toFixed(2);

  return (
    <div className={`flex flex-col w-full max-w-5xl mx-auto pb-36 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#241e12] border border-[#f2ca50] text-[#f2ca50] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[12.5px] font-sans font-semibold animate-in fade-in slide-in-from-top-2">
          <Check size={16} className="text-[#f2ca50]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#201f21] text-[#e5e1e4] hover:text-[#f2ca50] border border-[#353437]/40 transition-colors font-sans text-[11px] font-semibold tracking-wider uppercase cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isRtl ? 'chevron_right' : 'chevron_left'}
          </span>
          <span>{isRtl ? 'المتجر' : 'Shop Boutique'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleBookmark}
            aria-label="Save to Wishlist"
            className={`w-9 h-9 rounded-full bg-[#201f21] border border-[#353437]/40 flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              isSaved
                ? 'text-[#f2ca50] bg-[#f2ca50]/15 border-[#f2ca50]/40'
                : 'text-[#e5e1e4] hover:text-[#f2ca50]'
            }`}
            type="button"
          >
            <Heart size={15} strokeWidth={1.5} className={isSaved ? 'fill-current' : ''} />
          </button>

          <button
            onClick={handleShare}
            aria-label="Share product"
            className="w-9 h-9 rounded-full bg-[#201f21] border border-[#353437]/40 flex items-center justify-center text-[#e5e1e4] hover:text-[#f2ca50] transition-transform active:scale-90 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 my-3 items-stretch">
        {/* Left Column: Interactive Product Visual with Zoom Lightbox Trigger */}
        <div className="md:col-span-6 flex flex-col justify-between gap-3 h-full">
          <div
            onClick={() => setIsZoomOpen(true)}
            className="relative w-full flex-1 aspect-square md:aspect-auto min-h-[300px] md:min-h-[380px] rounded-2xl md:rounded-3xl overflow-hidden bg-[#1b1b1d] border border-[#353437]/60 shadow-xl group cursor-zoom-in"
          >
            <img
              src={product.imageUrl}
              alt={product.titleEn}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131315]/80 via-transparent to-transparent pointer-events-none" />

            {/* Badges */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
              {product.tagEn && (
                <span className="px-3 py-1 rounded-full bg-[#f2ca50] text-[#241a00] font-sans text-[10px] font-bold uppercase tracking-wider shadow-md">
                  {isRtl ? product.tagAr : product.tagEn}
                </span>
              )}
              <span className={`px-2.5 py-1 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider shadow-md ${
                product.inStock ? 'bg-[#201f21]/90 text-[#47ea7a] border border-[#47ea7a]/30' : 'bg-[#ff5e5e] text-white'
              }`}>
                {product.inStock ? (isRtl ? 'متوفر' : 'In Stock') : (isRtl ? 'غير متوفر' : 'Out of Stock')}
              </span>
            </div>

            {/* Tap to Zoom Indicator */}
            <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b1b1d]/85 backdrop-blur-md border border-[#353437]/60 text-[#e5e1e4] font-sans text-[11px] shadow-lg group-hover:border-[#f2ca50]/50 transition-colors">
              <ZoomIn size={14} className="text-[#f2ca50]" />
              <span>{isRtl ? 'تكبير الصورة' : 'Tap to Zoom'}</span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="shrink-0 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck size={16} className="text-[#f2ca50] mb-0.5" />
              <span className="font-sans text-[10.5px] font-semibold text-[#e5e1e4]">
                {isRtl ? 'أصلي 100%' : '100% Authentic'}
              </span>
            </div>
            <div className="flex flex-col items-center border-x border-[#353437]/40">
              <Sparkles size={16} className="text-[#f2ca50] mb-0.5" />
              <span className="font-sans text-[10.5px] font-semibold text-[#e5e1e4]">
                {isRtl ? 'موصى به في الصالون' : 'Salon Grade'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[16px] text-[#f2ca50] mb-0.5">local_shipping</span>
              <span className="font-sans text-[10.5px] font-semibold text-[#e5e1e4]">
                {isRtl ? 'توصيل سريع بالإمارات' : 'UAE Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info, Pricing, Quantity & Add to Bag */}
        <div className="md:col-span-6 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider">
                {product.volumeEn} · {isRtl ? 'مستحضر حصري' : 'NABSHÉ Exclusive'}
              </span>
              <span className="font-sans text-[11px] text-[#99907c]">
                SKU: {product.id.toUpperCase()}
              </span>
            </div>

            <h1 className="font-serif text-[24px] sm:text-[28px] md:text-[32px] text-[#e5e1e4] font-semibold leading-tight">
              {isRtl ? product.titleAr : product.titleEn}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-2.5 pt-0.5">
              <span className="font-serif text-[22px] sm:text-[24px] font-bold text-[#f2ca50]">
                AED {product.price}
              </span>
              <span className="font-sans text-[10.5px] text-[#99907c] uppercase">
                {isRtl ? 'شامل ضريبة القيمة المضافة 5%' : 'Incl. 5% VAT'}
              </span>
            </div>

            {/* Tabby Installment Banner */}
            <div className="p-3.5 rounded-2xl bg-[#201f21] border border-[#353437]/50 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">credit_card</span>
                <div className="flex flex-col">
                  <span className="font-sans text-[12px] font-bold text-[#e5e1e4]">
                    {isRtl
                      ? `أو 4 دفعات بدون فوائد بقيمة ${tabbyInstallment} درهم`
                      : `Or 4 interest-free payments of AED ${tabbyInstallment}`}
                  </span>
                  <span className="font-sans text-[10.5px] text-[#d0c5af]">
                    {isRtl ? 'قسّمي المبلغ مع تابي' : 'Split in 4 with Tabby'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#2a2a2c] text-[10px] font-bold text-[#f2ca50] border border-[#353437]/60">
                TABBY
              </span>
            </div>

            {/* Quantity Selector & Add to Bag in page body (Side by side on mobile & desktop, consistent height) */}
            <div className="pt-2 flex items-center gap-2.5 sm:gap-3">
              {/* Quantity */}
              <div className="h-[40px] flex items-center justify-between bg-[#201f21] border border-[#353437]/60 rounded-xl px-2 w-[105px] sm:w-[115px] shrink-0">
                <button
                  type="button"
                  onClick={handleMinusQuantity}
                  disabled={quantity <= 1}
                  className="w-6 h-6 rounded-md bg-[#2a2a2c] hover:bg-[#353437] disabled:opacity-40 text-[#e5e1e4] flex items-center justify-center font-bold text-[13px] transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="font-sans text-[13px] font-bold text-[#e5e1e4] px-1.5">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleAddQuantity}
                  disabled={quantity >= 10}
                  className="w-6 h-6 rounded-md bg-[#2a2a2c] hover:bg-[#353437] disabled:opacity-40 text-[#e5e1e4] flex items-center justify-center font-bold text-[13px] transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCartClick}
                disabled={!product.inStock}
                className="h-[40px] px-5 sm:px-6 flex-1 sm:flex-initial sm:w-auto rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.35)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag size={15} className="text-[#241a00]" />
                <span>{isRtl ? 'إضافة للحقيبة' : '+ ADD TO BAG'}</span>
              </button>
            </div>

            {/* Quick WhatsApp Concierge Button */}
            <div>
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="h-[40px] px-4 w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#25D366] border border-[#25D366]/35 font-sans text-[11px] sm:text-[11.5px] font-semibold transition-all cursor-pointer"
              >
                <MessageCircle size={15} />
                <span>{isRtl ? 'استفسري عن المنتج عبر واتساب' : 'Inquire About Product via WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* Tabbed Info: Description, Ingredients, Usage Ritual */}
          <div className="pt-3 border-t border-[#353437]/50">
            <div className="flex items-center gap-2 border-b border-[#353437]/50 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('description')}
                className={`font-sans text-[12px] font-bold pb-1 transition-colors cursor-pointer ${
                  activeTab === 'description'
                    ? 'text-[#f2ca50] border-b-2 border-[#f2ca50]'
                    : 'text-[#d0c5af] hover:text-[#e5e1e4]'
                }`}
              >
                {isRtl ? 'الوصف' : 'Description'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ingredients')}
                className={`font-sans text-[12px] font-bold pb-1 transition-colors cursor-pointer ${
                  activeTab === 'ingredients'
                    ? 'text-[#f2ca50] border-b-2 border-[#f2ca50]'
                    : 'text-[#d0c5af] hover:text-[#e5e1e4]'
                }`}
              >
                {isRtl ? 'المكونات' : 'Ingredients'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('usage')}
                className={`font-sans text-[12px] font-bold pb-1 transition-colors cursor-pointer ${
                  activeTab === 'usage'
                    ? 'text-[#f2ca50] border-b-2 border-[#f2ca50]'
                    : 'text-[#d0c5af] hover:text-[#e5e1e4]'
                }`}
              >
                {isRtl ? 'طريقة الاستخدام' : 'Ritual / How to Apply'}
              </button>
            </div>

            <div className="py-3 text-[12.5px] sm:text-[13px] text-[#d0c5af] font-sans leading-relaxed">
              {activeTab === 'description' && (
                <p>{isRtl ? product.descriptionAr : product.descriptionEn}</p>
              )}
              {activeTab === 'ingredients' && (
                <p>{(isRtl ? product.ingredientsAr : product.ingredientsEn) || (isRtl ? 'تركيبة غنية بخلاصات طبيعية وعناصر مغذية معتمدة في الصالون.' : 'Rich botanical extracts, bio-active peptides, and nourishing vitamins tested by NABSHÉ specialists.')}</p>
              )}
              {activeTab === 'usage' && (
                <p>{(isRtl ? product.usageAr : product.usageEn) || (isRtl ? 'يستخدم يومياً بعد تنظيف البشرة أو الاستحمام لنتائج مثالية ومستدامة.' : 'Use daily after cleansing or post-treatment to lock in moisture and sustain salon-level glow.')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Pairing / Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#353437]/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold">
              {isRtl ? 'منتجات ينصح بها مع هذا المستحضر' : 'Recommended Pairings'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="text-[#f2ca50] hover:text-[#ffe088] font-sans text-[12px] font-semibold flex items-center gap-1"
            >
              <span>{isRtl ? 'تصفح الكل' : 'View All'}</span>
              <span className="material-symbols-outlined text-[15px]">
                {isRtl ? 'chevron_left' : 'chevron_right'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {relatedProducts.map(rel => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct && onSelectProduct(rel)}
                className="p-3 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 hover:border-[#f2ca50]/50 transition-all flex flex-col justify-between gap-2.5 cursor-pointer luxury-card-hover group"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#201f21]">
                  <img
                    src={rel.imageUrl}
                    alt={rel.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h3 className="font-sans text-[12px] font-bold text-[#e5e1e4] line-clamp-1 group-hover:text-[#f2ca50] transition-colors">
                    {isRtl ? rel.titleAr : rel.titleEn}
                  </h3>
                  <span className="font-sans text-[10.5px] text-[#d0c5af]">
                    {rel.volumeEn}
                  </span>
                  <span className="font-serif text-[13px] font-bold text-[#f2ca50] block mt-0.5">
                    AED {rel.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full-Screen Image Lightbox / Zoom Modal */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#201f21] border border-[#353437]/70 text-[#e5e1e4] hover:text-[#f2ca50] flex items-center justify-center cursor-pointer shadow-xl z-10"
            aria-label="Close zoomed view"
          >
            <X size={20} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] w-full flex flex-col items-center"
          >
            <img
              src={product.imageUrl}
              alt={product.titleEn}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-[#353437]/60"
            />
            <div className="mt-3 text-center">
              <span className="font-serif text-[16px] sm:text-[18px] text-[#e5e1e4] font-semibold block">
                {isRtl ? product.titleAr : product.titleEn}
              </span>
              <span className="font-sans text-[12px] text-[#f2ca50]">
                {product.volumeEn} · AED {product.price}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Action Dock (always visible, z-50, never covered) */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#161618]/95 backdrop-blur-2xl border-t border-[#353437]/70 py-2.5 px-4 sm:px-6 shadow-[0_-10px_35px_rgba(0,0,0,0.7)] pb-safe">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[9.5px] sm:text-[10px] tracking-widest text-[#99907c] font-semibold uppercase leading-none">
              {isRtl ? 'المجموع' : 'Subtotal'} ({quantity} {isRtl ? 'قطعة' : 'item'})
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-serif text-[16px] sm:text-[17px] font-bold text-[#f2ca50] leading-tight">
                AED {totalCalculated}
              </span>
              <span className="font-sans text-[9.5px] text-[#99907c] uppercase">
                {isRtl ? 'شامل الضريبة' : 'VAT incl.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-1 justify-end max-w-md">
            <button
              type="button"
              onClick={onOpenCartModal}
              className="h-[40px] px-3 sm:px-3.5 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#e5e1e4] hover:text-[#f2ca50] border border-[#353437]/70 font-sans text-[11px] font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title={isRtl ? 'عرض الحقيبة' : 'View Bag'}
            >
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">{isRtl ? 'عرض الحقيبة' : 'VIEW BAG'}</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={!product.inStock}
              className="h-[40px] px-4 sm:px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(242,202,80,0.25)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.35)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <ShoppingBag size={15} className="text-[#241a00]" />
              <span>{isRtl ? '+ إضافة للحقيبة' : '+ ADD TO BAG'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
