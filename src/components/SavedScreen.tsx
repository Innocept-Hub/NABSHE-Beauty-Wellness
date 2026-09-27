import React, { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { Language, ScreenType, Treatment, BoutiqueProduct } from '../types';
import { TREATMENTS, BOUTIQUE_PRODUCTS } from '../data/mockData';

interface SavedScreenProps {
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  savedTreatmentIds: string[];
  savedProductIds: string[];
  onToggleSaveTreatment: (id: string) => void;
  onToggleSaveProduct: (id: string) => void;
  onSelectTreatment: (treatment: Treatment) => void;
  onAddToCart: (product: BoutiqueProduct) => void;
  onClearSaved: () => void;
  onSelectProduct?: (product: BoutiqueProduct) => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  language,
  onNavigate,
  savedTreatmentIds,
  savedProductIds,
  onToggleSaveTreatment,
  onToggleSaveProduct,
  onSelectTreatment,
  onAddToCart,
  onClearSaved,
  onSelectProduct,
}) => {
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState<'all' | 'treatments' | 'products'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const savedTreatments = useMemo(() => {
    return TREATMENTS.filter(t => savedTreatmentIds.includes(t.id));
  }, [savedTreatmentIds]);

  const savedProducts = useMemo(() => {
    return BOUTIQUE_PRODUCTS.filter(p => savedProductIds.includes(p.id));
  }, [savedProductIds]);

  const totalSavedCount = savedTreatments.length + savedProducts.length;

  const handleBookTreatment = (treatment: Treatment) => {
    onSelectTreatment(treatment);
    onNavigate('booking');
  };

  const handleAddProduct = (product: BoutiqueProduct) => {
    onAddToCart(product);
    showToast(
      isRtl
        ? `تمت إضافة ${product.titleAr} إلى حقيبة التسوق`
        : `Added ${product.titleEn} to your Bag`
    );
  };

  const handleRemoveTreatment = (treatment: Treatment) => {
    onToggleSaveTreatment(treatment.id);
    showToast(
      isRtl
        ? `تمت إزالة ${treatment.titleAr} من المحفوظات`
        : `Removed ${treatment.titleEn} from Saved`
    );
  };

  const handleRemoveProduct = (product: BoutiqueProduct) => {
    onToggleSaveProduct(product.id);
    showToast(
      isRtl
        ? `تمت إزالة ${product.titleAr} من المحفوظات`
        : `Removed ${product.titleEn} from Saved`
    );
  };

  const handleConfirmClearAll = () => {
    onClearSaved();
    setShowClearConfirm(false);
    showToast(isRtl ? 'تم مسح جميع العناصر المحفوظة' : 'Cleared all saved items');
  };

  return (
    <div className={`flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-2 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#201f21] border border-[#f2ca50]/50 text-[#e5e1e4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <Heart size={14} strokeWidth={1.5} className="fill-current text-[#f2ca50]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal for Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1b1b1d] border border-[#353437] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">delete_sweep</span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-[18px] text-[#e5e1e4] font-semibold">
                {isRtl ? 'مسح قائمة المحفوظات؟' : 'Clear all saved items?'}
              </h3>
              <p className="font-sans text-[12px] text-[#d0c5af] leading-relaxed">
                {isRtl
                  ? 'سيتم حذف جميع الخدمات والمستحضرات المحفوظة من هذه القائمة على جهازك.'
                  : 'This will remove all saved treatment services and boutique products from your device.'}
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#201f21] text-[#d0c5af] hover:text-[#e5e1e4] font-sans text-[12px] font-semibold transition-colors"
                type="button"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmClearAll}
                className="flex-1 py-2.5 rounded-xl bg-[#f2ca50] text-[#241a00] hover:bg-[#ffe088] font-sans text-[12px] font-bold transition-colors"
                type="button"
              >
                {isRtl ? 'تأكيد المسح' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Title Section */}
      <section className="pt-1 pb-3 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]"></span>
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]">
              {isRtl ? 'قائمة التفضيلات' : 'Wishlist'}
            </span>
          </div>

          {totalSavedCount > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-[11px] font-sans font-medium text-[#99907c] hover:text-[#ff5e5e] transition-colors flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
              <span>{isRtl ? 'مسح الكل' : 'Clear All'}</span>
            </button>
          )}
        </div>

        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h1 className="font-serif text-[26px] sm:text-[30px] md:text-[36px] text-[#e5e1e4] font-semibold tracking-tight">
            {isRtl ? 'العناصر المحفوظة' : 'Saved Services & Products'}
          </h1>
          <span className="font-sans text-[12px] text-[#f2ca50] font-semibold bg-[#201f21] px-3 py-1 rounded-full border border-[#353437]/50">
            {totalSavedCount} {isRtl ? 'عناصر' : totalSavedCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        <p className="font-sans text-[13px] md:text-[14px] text-[#d0c5af] max-w-2xl leading-relaxed">
          {isRtl
            ? 'خدمات الصالون ومستحضرات العناية التي قمتِ بحفظها لسهولة حجزها أو شرائها لاحقاً.'
            : 'Your favorite salon services and beauty products saved for quick scheduling and ordering.'}
        </p>
      </section>

      {/* Category Tabs: All, Treatments, Products */}
      <div className="flex items-center bg-[#201f21] p-1 rounded-xl border border-[#353437]/50 my-2 max-w-md">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 text-center rounded-lg font-sans text-[12px] font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-[#f2ca50] text-[#241a00] font-bold shadow-sm'
              : 'text-[#d0c5af] hover:text-[#e5e1e4]'
          }`}
          type="button"
        >
          {isRtl ? `الكل (${totalSavedCount})` : `All (${totalSavedCount})`}
        </button>
        <button
          onClick={() => setActiveTab('treatments')}
          className={`flex-1 py-2 text-center rounded-lg font-sans text-[12px] font-semibold transition-all ${
            activeTab === 'treatments'
              ? 'bg-[#f2ca50] text-[#241a00] font-bold shadow-sm'
              : 'text-[#d0c5af] hover:text-[#e5e1e4]'
          }`}
          type="button"
        >
          {isRtl ? `الخدمات (${savedTreatments.length})` : `Services (${savedTreatments.length})`}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 text-center rounded-lg font-sans text-[12px] font-semibold transition-all ${
            activeTab === 'products'
              ? 'bg-[#f2ca50] text-[#241a00] font-bold shadow-sm'
              : 'text-[#d0c5af] hover:text-[#e5e1e4]'
          }`}
          type="button"
        >
          {isRtl ? `المنتجات (${savedProducts.length})` : `Products (${savedProducts.length})`}
        </button>
      </div>

      {/* Empty State when no items saved */}
      {totalSavedCount === 0 ||
      (activeTab === 'treatments' && savedTreatments.length === 0) ||
      (activeTab === 'products' && savedProducts.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 my-6 bg-[#1b1b1d] rounded-2xl border border-[#353437]/50 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#201f21] border border-[#353437]/60 flex items-center justify-center text-[#f2ca50] shadow-inner">
            <Heart size={22} strokeWidth={1.25} />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h3 className="font-serif text-[20px] text-[#e5e1e4] font-semibold">
              {isRtl ? 'قائمة المحفوظات فارغة' : 'Your Wishlist is Empty'}
            </h3>
            <p className="font-sans text-[13px] text-[#d0c5af] leading-relaxed">
              {isRtl
                ? 'اضغطي على رمز القلب في أي خدمة أو مستحضر لحفظه والوصول إليه بسرعة في أي وقت.'
                : 'Tap the heart icon on any treatment service or beauty product to keep it saved here for quick booking.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full max-w-xs">
            <button
              onClick={() => onNavigate('services')}
              className="w-full py-2.5 px-4 rounded-full bg-[#f2ca50] text-[#241a00] hover:bg-[#ffe088] font-sans text-[12px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>{isRtl ? 'استعراض الخدمات' : 'Explore Services'}</span>
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="w-full py-2.5 px-4 rounded-full bg-[#201f21] text-[#e5e1e4] hover:text-[#f2ca50] border border-[#353437]/50 font-sans text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
              <span>{isRtl ? 'زيارة المتجر' : 'Visit Shop'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 my-4">
          {/* Treatments Section */}
          {(activeTab === 'all' || activeTab === 'treatments') && savedTreatments.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#353437]/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">spa</span>
                  <h2 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold">
                    {isRtl ? 'خدمات الصالون المحفوظة' : 'Saved Salon Services'}
                  </h2>
                </div>
                <span className="font-sans text-[11px] text-[#99907c]">
                  {savedTreatments.length} {isRtl ? 'خدمات' : 'services'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6">
                {savedTreatments.map(treatment => (
                  <article
                    key={treatment.id}
                    onClick={() => {
                      onSelectTreatment(treatment);
                      onNavigate('treatment-detail');
                    }}
                    className="flex flex-col justify-between bg-[#1b1b1d] rounded-2xl p-2.5 sm:p-3 md:p-3.5 lg:p-4 border border-[#353437]/50 shadow-md group relative overflow-hidden transition-all hover:border-[#f2ca50]/40 cursor-pointer"
                  >
                    {/* Top Tag & Heart Button Row */}
                    <div className="flex items-center justify-between mb-2 z-10 relative">
                      <span className="font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm bg-[#201f21]/90 backdrop-blur-md text-[#f2ca50] border border-[#f2ca50]/30">
                        {treatment.duration} {isRtl ? 'دقيقة' : 'MIN'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTreatment(treatment);
                        }}
                        className="w-7 h-7 rounded-full bg-[#201f21]/80 backdrop-blur-md border border-[#353437]/50 flex items-center justify-center transition-all active:scale-90 text-[#f2ca50] bg-[#f2ca50]/15 border-[#f2ca50]/40"
                        type="button"
                        aria-label="Remove from Saved"
                        title={isRtl ? 'إزالة من المحفوظات' : 'Remove from Saved'}
                      >
                        <Heart size={13} strokeWidth={1.5} className="fill-current" />
                      </button>
                    </div>

                    <div>
                      {/* Treatment Visual */}
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#201f21] mb-2.5 relative border border-[#353437]/40">
                        <img
                          src={treatment.imageUrl}
                          alt={treatment.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                          handleBookTreatment(treatment);
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
            </section>
          )}

          {/* Products Section */}
          {(activeTab === 'all' || activeTab === 'products') && savedProducts.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#353437]/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">shopping_bag</span>
                  <h2 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold">
                    {isRtl ? 'مستحضرات المتجر المحفوظة' : 'Saved Products'}
                  </h2>
                </div>
                <span className="font-sans text-[11px] text-[#99907c]">
                  {savedProducts.length} {isRtl ? 'منتجات' : 'products'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
                {savedProducts.map(product => (
                  <article
                    key={product.id}
                    onClick={() => onSelectProduct?.(product)}
                    className="flex flex-col justify-between bg-[#1b1b1d] rounded-2xl p-2.5 sm:p-3 md:p-3.5 lg:p-4 border border-[#353437]/50 shadow-md group relative overflow-hidden transition-all hover:border-[#f2ca50]/40 cursor-pointer"
                  >
                    {/* Top Tag & Heart Button */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                          product.inStock
                            ? 'bg-[#201f21] text-[#f2ca50] border border-[#f2ca50]/30'
                            : 'bg-[#ff5e5e]/90 text-[#ffffff]'
                        }`}
                      >
                        {isRtl ? product.tagAr : product.tagEn}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveProduct(product);
                        }}
                        className="w-7 h-7 rounded-full bg-[#201f21] hover:bg-[#ff5e5e]/20 text-[#f2ca50] hover:text-[#ff5e5e] flex items-center justify-center transition-colors border border-[#353437]/50"
                        type="button"
                        aria-label="Remove product from Saved"
                        title={isRtl ? 'إزالة من المحفوظات' : 'Remove from Saved'}
                      >
                        <Heart size={13} strokeWidth={1.5} className="fill-current" />
                      </button>
                    </div>

                    <div>
                      {/* Product Visual */}
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#201f21] mb-2.5 relative border border-[#353437]/40">
                        <img
                          src={product.imageUrl}
                          alt={product.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Title & Volume */}
                      <h3 className="font-sans text-[13px] md:text-[14px] font-semibold text-[#e5e1e4] leading-snug line-clamp-2">
                        {isRtl ? product.titleAr : product.titleEn}
                      </h3>
                      <span className="font-sans text-[11px] text-[#d0c5af] block mt-0.5">
                        {isRtl ? product.volumeAr : product.volumeEn}
                      </span>
                    </div>

                    {/* Price & Action Row */}
                    <div className="mt-3 pt-2.5 border-t border-[#353437]/40 flex flex-col gap-2">
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
            </section>
          )}
        </div>
      )}
    </div>
  );
};
