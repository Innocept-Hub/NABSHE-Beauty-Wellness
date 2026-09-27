import React from 'react';
import { ScreenType, Language } from '../types';

interface BottomNavProps {
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  language: Language;
  pendingRequestsCount: number;
  onOpenCart: () => void;
  cartCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onNavigate,
  language,
  pendingRequestsCount,
  onOpenCart,
  cartCount = 0,
}) => {
  const isRtl = language === 'ar';

  const isHomeActive = activeScreen === 'home';
  const isServicesActive = activeScreen === 'services' || activeScreen === 'packages' || activeScreen === 'treatment-detail';
  const isShopActive = activeScreen === 'shop' || activeScreen === 'order-confirmation';
  const isVipActive = activeScreen === 'vip';

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#1b1b1d]/90 backdrop-blur-2xl border-t border-[#353437]/60 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] md:hidden">
      <div className="relative flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {/* Home Tab */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-0.5 transition-colors ${
            isHomeActive
              ? 'text-[#f2ca50] font-semibold'
              : 'text-[#d0c5af] hover:text-[#e5e1e4]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">spa</span>
          <span className="text-[10px] font-sans uppercase tracking-wider font-bold">
            {isRtl ? 'الرئيسية' : 'HOME'}
          </span>
        </button>

        {/* Services Tab */}
        <button
          onClick={() => onNavigate('services')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-0.5 transition-colors ${
            isServicesActive
              ? 'text-[#f2ca50] font-semibold'
              : 'text-[#d0c5af] hover:text-[#e5e1e4]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
          <span className="text-[10px] font-sans uppercase tracking-wider font-bold">
            {isRtl ? 'الخدمات' : 'SERVICES'}
          </span>
        </button>

        {/* Center Dynamic Floating Button:
            - When on PRODUCTS page: shows Shopping Bag icon & opens Bag Modal
            - When on SERVICES / other pages: shows Calendar icon & leads to Booking modal/screen */}
        <div className="relative -top-4 flex items-center justify-center">
          <button
            onClick={() => {
              if (isShopActive) {
                onOpenCart();
              } else {
                onNavigate('booking');
              }
            }}
            className="relative w-13 h-13 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] flex items-center justify-center shadow-[0_10px_25px_rgba(212,175,55,0.4)] active:scale-95 transition-transform cursor-pointer"
            type="button"
            aria-label={
              isShopActive
                ? (isRtl ? 'فتح حقيبة التسوق' : 'Open Shopping Bag')
                : (isRtl ? 'حجز موعد جديد' : 'Book Treatment Now')
            }
          >
            <span className="material-symbols-outlined text-[26px]">
              {isShopActive ? 'shopping_bag' : 'calendar_month'}
            </span>
            {isShopActive && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#131315] text-[#f2ca50] text-[11px] font-bold flex items-center justify-center border-2 border-[#f2ca50] shadow-md animate-in zoom-in-50">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Shop / Products Tab */}
        <button
          onClick={() => onNavigate('shop')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-0.5 transition-colors ${
            isShopActive
              ? 'text-[#f2ca50] font-semibold'
              : 'text-[#d0c5af] hover:text-[#e5e1e4]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">storefront</span>
          <span className="text-[10px] font-sans uppercase tracking-wider font-bold">
            {isRtl ? 'المنتجات' : 'PRODUCTS'}
          </span>
        </button>

        {/* VIP Club Tab */}
        <button
          onClick={() => onNavigate('vip')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-0.5 transition-colors ${
            isVipActive
              ? 'text-[#f2ca50] font-semibold'
              : 'text-[#d0c5af] hover:text-[#e5e1e4]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
          <span className="text-[10px] font-sans uppercase tracking-wider font-bold">
            {isRtl ? 'نادي VIP' : 'VIP CLUB'}
          </span>
        </button>
      </div>
    </nav>
  );
};
