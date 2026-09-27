import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Divide as Hamburger } from 'hamburger-react';
import { Language, ScreenType } from '../types';
import { PWAInlineBanner } from './PWAInlineBanner';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (screen: ScreenType) => void;
  activeScreen: ScreenType;
  onOpenSearch: () => void;
  savedCount?: number;
  onMobileMenuChange?: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onNavigate,
  activeScreen,
  onOpenSearch,
  savedCount = 0,
  onMobileMenuChange,
}) => {
  const isRtl = language === 'ar';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Track scroll state and scroll progress for dynamic luxury header effects
  useEffect(() => {
    let ticking = false;

    const updateScrollMetrics = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 15);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollMetrics);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollMetrics();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Notify parent of mobile menu open/close state
  useEffect(() => {
    onMobileMenuChange?.(isMobileMenuOpen);
  }, [isMobileMenuOpen, onMobileMenuChange]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (screen: ScreenType) => {
    onNavigate(screen);
    setIsMobileMenuOpen(false);
  };

  const navItems: { screen: ScreenType; labelEn: string; labelAr: string; icon: string }[] = [
    { screen: 'home', labelEn: 'HOME', labelAr: 'الرئيسية', icon: 'spa' },
    { screen: 'services', labelEn: 'SERVICES', labelAr: 'الخدمات', icon: 'auto_awesome' },
    { screen: 'packages', labelEn: 'SIGNATURE TREATMENTS', labelAr: 'العلاجات المميزة', icon: 'card_giftcard' },
    { screen: 'shop', labelEn: 'PRODUCTS', labelAr: 'المنتجات', icon: 'shopping_bag' },
    { screen: 'saved', labelEn: 'WISHLIST', labelAr: 'المفضلة', icon: 'favorite' },
    { screen: 'artisans', labelEn: 'OUR SPECIALISTS', labelAr: 'أخصائياتنا', icon: 'badge' },
    { screen: 'vip', labelEn: 'VIP CLUB', labelAr: 'نادي VIP', icon: 'workspace_premium' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b pt-safe ${
          isScrolled
            ? 'bg-[#131315]/95 backdrop-blur-2xl border-[#353437]/70 shadow-[0_8px_30px_rgba(0,0,0,0.55)]'
            : 'bg-[#131315]/90 backdrop-blur-xl border-[#353437]/40 shadow-[0_4px_20px_rgba(0,0,0,0.35)]'
        }`}
      >
        <div className="relative h-[67px] sm:h-[68px] md:h-[78px] lg:h-[88px] xl:h-[92px] px-4 sm:px-6 lg:px-8 flex items-center justify-between max-w-7xl mx-auto transition-all duration-300">
          {/* Left: Brand Logo & Hamburger Button for Tablet/Mobile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Hamburger Nav Toggle with animated 'Divide' (Tablet & Mobile only - hidden on desktop lg:) */}
            <div className="lg:hidden flex items-center justify-center rounded-full bg-[#201f21] border border-[#353437]/60 hover:border-[#f2ca50]/50 transition-colors shadow-sm overflow-hidden active:scale-95">
              <Hamburger
                toggled={isMobileMenuOpen}
                toggle={setIsMobileMenuOpen}
                size={18}
                color="#f2ca50"
                rounded
                duration={0.35}
                label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              />
            </div>

            {/* Official Brand Logo: Left-aligned on mobile, center-aligned on tablet, static flex on desktop. Always links to Home */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center focus:outline-none group text-left shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 cursor-pointer"
              type="button"
              aria-label="NABSHÉ Home"
              title={isRtl ? 'الصفحة الرئيسية' : 'Return to Homepage'}
            >
              <img
                src="/nabshe-logo.png"
                width={130}
                height={40}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://lh3.googleusercontent.com/aida/AEtjO1XZAiCzCucs9FzXbjnewf2ods18SiVfWE0oGX7zgwaUoOtSYVejhiW3h_UAykbB3qnl5a7JW2sXiU7lqQe-gfPpsZ9a3Ii7-9cq_i3GmEoOQzMjxLnp2cLlFo9mvGv1Jb6FffFW6ckjVRSE_GVUkia9iYtBOAjHKjY5todVjBPFDYGFj0fbk41wfV69VYXFfZ3rJ9ahfmcNshu1kRpuN6kW4BPHGnWheauwprA4OJjUhHQ8EDF2jcXzF98';
                }}
                alt="NABSHÉ Beauty & Wellness"
                className="h-8 sm:h-9 md:h-10 lg:h-12 xl:h-[50px] w-auto max-w-[130px] sm:max-w-[150px] md:max-w-[170px] lg:max-w-[210px] xl:max-w-[230px] object-contain py-0.5 group-hover:scale-105 transition-transform"
              />
            </button>
          </div>

          {/* Desktop-Only Full Navigation Links (hidden on tablet & mobile, shown on lg:) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded-full font-sans text-[12px] font-bold uppercase tracking-wider transition-colors ${
                activeScreen === 'home'
                  ? 'text-[#f2ca50] bg-[#f2ca50]/15'
                  : 'text-[#d0c5af] hover:text-[#e5e1e4] hover:bg-[#201f21]'
              }`}
              type="button"
            >
              {isRtl ? 'الرئيسية' : 'HOME'}
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={`px-3 py-1.5 rounded-full font-sans text-[12px] font-bold uppercase tracking-wider transition-colors ${
                activeScreen === 'services' || activeScreen === 'treatment-detail'
                  ? 'text-[#f2ca50] bg-[#f2ca50]/15'
                  : 'text-[#d0c5af] hover:text-[#e5e1e4] hover:bg-[#201f21]'
              }`}
              type="button"
            >
              {isRtl ? 'الخدمات' : 'SERVICES'}
            </button>
            <button
              onClick={() => handleNavClick('packages')}
              className={`px-3 py-1.5 rounded-full font-sans text-[12px] font-bold uppercase tracking-wider transition-colors ${
                activeScreen === 'packages'
                  ? 'text-[#f2ca50] bg-[#f2ca50]/15'
                  : 'text-[#d0c5af] hover:text-[#e5e1e4] hover:bg-[#201f21]'
              }`}
              type="button"
            >
              {isRtl ? 'العلاجات المميزة' : 'SIGNATURE TREATMENTS'}
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`px-3 py-1.5 rounded-full font-sans text-[12px] font-bold uppercase tracking-wider transition-colors ${
                activeScreen === 'shop' || activeScreen === 'order-confirmation'
                  ? 'text-[#f2ca50] bg-[#f2ca50]/15'
                  : 'text-[#d0c5af] hover:text-[#e5e1e4] hover:bg-[#201f21]'
              }`}
              type="button"
            >
              {isRtl ? 'المنتجات' : 'PRODUCTS'}
            </button>
            <button
              onClick={() => handleNavClick('artisans')}
              className={`px-3 py-1.5 rounded-full font-sans text-[12px] font-bold uppercase tracking-wider transition-colors ${
                activeScreen === 'artisans'
                  ? 'text-[#f2ca50] bg-[#f2ca50]/15'
                  : 'text-[#d0c5af] hover:text-[#e5e1e4] hover:bg-[#201f21]'
              }`}
              type="button"
            >
              {isRtl ? 'أخصائياتنا' : 'OUR SPECIALISTS'}
            </button>
            <button
              onClick={() => handleNavClick('vip')}
              className={`px-3 py-1.5 rounded-full font-sans text-[12px] font-bold uppercase tracking-wider transition-colors ${
                activeScreen === 'vip'
                  ? 'text-[#f2ca50] bg-[#f2ca50]/15'
                  : 'text-[#d0c5af] hover:text-[#e5e1e4] hover:bg-[#201f21]'
              }`}
              type="button"
            >
              {isRtl ? 'نادي VIP' : 'VIP CLUB'}
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Search Icon */}
            <button
              onClick={onOpenSearch}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                activeScreen === 'search'
                  ? 'bg-[#f2ca50] text-[#241a00]'
                  : 'bg-[#201f21] text-[#e5e1e4] hover:text-[#f2ca50]'
              }`}
              type="button"
              aria-label="Search Services and Products"
              title={isRtl ? 'البحث' : 'Search'}
            >
              <span className="material-symbols-outlined text-[19px]">search</span>
            </button>

            {/* Wishlist / Saved Items Icon */}
            <button
              onClick={() => handleNavClick('saved')}
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                activeScreen === 'saved'
                  ? 'bg-[#f2ca50] text-[#241a00]'
                  : 'bg-[#201f21] text-[#e5e1e4] hover:text-[#f2ca50]'
              }`}
              type="button"
              aria-label={
                isRtl
                  ? savedCount > 0
                    ? `المحفوظات (${savedCount})`
                    : 'المحفوظات'
                  : savedCount > 0
                  ? `Saved Wishlist (${savedCount})`
                  : 'Saved Wishlist'
              }
              title={isRtl ? 'المحفوظات' : 'Saved Wishlist'}
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                className={savedCount > 0 || activeScreen === 'saved' ? 'fill-current' : ''}
              />
              {savedCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 min-w-[15px] h-3.5 px-1 rounded-full text-[9px] font-bold flex items-center justify-center leading-none ${
                    activeScreen === 'saved'
                      ? 'bg-[#131315] text-[#f2ca50]'
                      : 'bg-[#f2ca50] text-[#241a00]'
                  }`}
                >
                  {savedCount}
                </span>
              )}
            </button>

            {/* Bilingual Language Switcher */}
            <div className="inline-flex items-center bg-[#201f21] rounded-full p-0.5 border border-[#353437]/50 shadow-inner">
              <button
                onClick={() => onLanguageChange('en')}
                className={`min-w-[34px] sm:min-w-[38px] h-[26px] sm:h-[28px] px-1.5 sm:px-2 rounded-full font-sans text-[11px] font-bold tracking-wider uppercase transition-all ${
                  language === 'en'
                    ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
                    : 'text-[#d0c5af] hover:text-[#e5e1e4]'
                }`}
                type="button"
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('ar')}
                className={`min-w-[34px] sm:min-w-[38px] h-[26px] sm:h-[28px] px-1.5 sm:px-2 rounded-full font-sans text-[11px] font-bold tracking-wider uppercase transition-all ${
                  language === 'ar'
                    ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
                    : 'text-[#d0c5af] hover:text-[#e5e1e4]'
                }`}
                type="button"
              >
                AR
              </button>
            </div>

            {/* User Profile Avatar with Online Status */}
            <button
              onClick={() => handleNavClick('profile')}
              className={`relative p-0.5 rounded-full border transition-all active:scale-95 ${
                activeScreen === 'profile'
                  ? 'border-[#f2ca50] ring-2 ring-[#f2ca50]/30'
                  : 'border-[#4d4635] hover:border-[#f2ca50]'
              }`}
              type="button"
              aria-label="User Profile"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZDwYEDZ_lYkEaYquFX8Mr59XuZZ-BQetk4ssD6ccBzbMnn9n0lqHGiIdAaqbM-Of-qinCd6sjXXHi_gLRQRQQCrMg1JRki5SbCNQl12C7HjrKE0K-MjuR1XayBpxuua0SWyfvO-mJGNSdpdLOUBuisIwhDKnjatsJFoORMFa9TEYv7jKLA0jPENLXmIsnkOq0-NGQktetGOtxtjQoHxXFfzCd0yX8LVw6x427AoURsFCOvGDCLKz2"
                alt="Client Profile"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#47ea7a] rounded-full ring-2 ring-[#131315]"></span>
            </button>
          </div>
        </div>

        {/* Ambient Gold Scroll Progress Indicator */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] opacity-75 transition-all duration-75 pointer-events-none"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* Tablet & Mobile Slide-down Luxury Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[67px] sm:top-[68px] md:top-[78px] z-[60] lg:hidden flex flex-col animate-in fade-in duration-200">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 top-[67px] sm:top-[68px] md:top-[78px] bg-black/75 backdrop-blur-sm -z-10"
            aria-hidden="true"
          />

          {/* Menu Drawer Container */}
          <div
            className={`w-full max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-[#1b1b1d] border-b border-[#353437] shadow-2xl p-4 sm:p-5 pb-8 space-y-2.5 sm:space-y-4 ${
              isRtl ? 'text-right' : 'text-left'
            }`}
          >
            {/* Menu Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {navItems.map((item) => {
                const isActive =
                  activeScreen === item.screen ||
                  (item.screen === 'services' && activeScreen === 'treatment-detail') ||
                  (item.screen === 'shop' && activeScreen === 'order-confirmation') ||
                  (item.screen === 'requests' && activeScreen === 'request-received');

                return (
                  <button
                    key={item.screen}
                    onClick={() => handleNavClick(item.screen)}
                    className={`flex items-center justify-between px-3.5 py-2 sm:px-4 sm:py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/40 font-semibold shadow-sm'
                        : 'bg-[#201f21] text-[#e5e1e4] hover:bg-[#2a2a2c] hover:text-[#f2ca50] border border-[#353437]/30'
                    }`}
                    type="button"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-[#f2ca50]">
                        {item.icon}
                      </span>
                      <span className="font-sans text-[13px] sm:text-[14px]">
                        {isRtl ? item.labelAr : item.labelEn}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#99907c]">
                      {isRtl ? 'chevron_left' : 'chevron_right'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Footer in Drawer */}
            <div className="pt-2.5 sm:pt-3 border-t border-[#353437]/50 flex flex-col gap-2.5 sm:gap-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-[#201f21] border border-[#353437]/50 text-[#e5e1e4] hover:text-[#f2ca50] font-sans text-[12px] font-semibold transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[17px] text-[#f2ca50]">account_circle</span>
                  <span>{isRtl ? 'الملف الشخصي والتفضيلات' : 'Client Profile & Settings'}</span>
                </button>

                {/* Tablet branding text on the right */}
                <p className="font-sans text-[11px] text-[#99907c] text-center sm:text-right hidden sm:block">
                  {isRtl ? 'صالون نابشيه · دبي' : 'NABSHÉ Beauty & Wellness · Dubai'}
                </p>
              </div>

              {/* Mobile-only branding text: centered below Client Profile button */}
              <p className="font-sans text-[11px] text-[#99907c] text-center sm:hidden pt-0.5">
                {isRtl ? 'صالون نابشيه · دبي' : 'NABSHÉ Beauty & Wellness · Dubai'}
              </p>

              {/* Divider between "NABSHÉ Beauty & Wellness · Dubai" and "FOLLOW US ON" */}
              <div className="border-t border-[#353437]/40 w-full" />

              {/* Follow Us On & PWA Inline Banner Wrapper */}
              <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end w-full">
                {/* On mobile: Sits directly above FOLLOW US ON (order-1). On tablet: Aligns to right side (md:order-2) */}
                <div className="order-1 md:order-2 w-full md:w-auto">
                  <PWAInlineBanner
                    language={language}
                    onAction={() => setIsMobileMenuOpen(false)}
                    onInstalled={() => setIsMobileMenuOpen(false)}
                  />
                </div>

                {/* On mobile: Sits below the install banner (order-2). On tablet: Stays on the left (md:order-1) */}
                <div className="flex flex-col items-center sm:items-start gap-2 order-2 md:order-1">
                  <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#d0c5af] text-center sm:text-left">
                    {isRtl ? 'تابعونا على:' : 'FOLLOW US ON:'}
                  </span>

                  <div className="flex items-center gap-2 sm:gap-2.5 justify-center sm:justify-start w-full sm:w-auto">
                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#201f21] border border-[#353437] hover:border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#1b1b1d] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
                      aria-label="Instagram"
                      title="Instagram"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#201f21] border border-[#353437] hover:border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#1b1b1d] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
                      aria-label="Facebook"
                      title="Facebook"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>

                    {/* TikTok */}
                    <a
                      href="https://www.tiktok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#201f21] border border-[#353437] hover:border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#1b1b1d] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
                      aria-label="TikTok"
                      title="TikTok"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </a>

                    {/* Snapchat */}
                    <a
                      href="https://www.snapchat.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#201f21] border border-[#353437] hover:border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#1b1b1d] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
                      aria-label="Snapchat"
                      title="Snapchat"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.003 1.996c-4.148 0-6.93 2.825-6.93 6.07 0 1.034.336 2.457.778 3.418.156.34.254.672.083.99-.18.337-.589.516-.957.654-.51.191-1.156.425-1.378.966-.192.47-.024.965.419 1.238.647.4 1.344.475 2.062.553.25.027.466.196.536.444.156.55.518 1.482 1.745 1.777.625.15 1.258-.094 1.895-.337.587-.225 1.189-.455 1.847-.455s1.26.23 1.847.455c.637.243 1.27.487 1.895.337 1.227-.295 1.589-1.227 1.745-1.777.07-.248.286-.417.536-.444.718-.078 1.415-.153 2.062-.553.443-.273.611-.768.419-1.238-.222-.541-.868-.775-1.378-.966-.368-.138-.777-.317-.957-.654-.171-.318-.073-.65.083-.99.442-.961.778-2.384.778-3.418 0-3.245-2.782-6.07-6.93-6.07z"/>
                      </svg>
                    </a>

                    {/* Pinterest */}
                    <a
                      href="https://www.pinterest.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#201f21] border border-[#353437] hover:border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#1b1b1d] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
                      aria-label="Pinterest"
                      title="Pinterest"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
