import React, { useState } from 'react';
import { usePWA } from '../context/PWAContext';
import { Language } from '../types';

interface PWAInstallModalProps {
  language?: Language;
  isBottomNavVisible?: boolean;
}

const DISMISSED_DATE_KEY = 'nabshe_pwa_dismissed_date';

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  language = 'en',
  isBottomNavVisible = true,
}) => {
  const {
    isModalOpen,
    closeModal,
    hasNativePrompt,
    promptInstall,
    isInIframe,
    isIos,
  } = usePWA();

  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [hasSimulatedSuccess, setHasSimulatedSuccess] = useState<boolean>(false);
  const isRtl = language === 'ar';

  if (!isModalOpen) {
    return null;
  }

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        closeModal();
      }
    } else {
      // In AI Studio preview or iOS Safari, show the interactive guide
      setShowGuide(true);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_DATE_KEY, Date.now().toString());
    } catch {
      // ignore
    }
    setShowGuide(false);
    closeModal();
  };

  const handleSimulateInstall = () => {
    setHasSimulatedSuccess(true);
    setTimeout(() => {
      try {
        localStorage.setItem(DISMISSED_DATE_KEY, Date.now().toString());
      } catch {
        // ignore
      }
      setHasSimulatedSuccess(false);
      setShowGuide(false);
      closeModal();
    }, 1200);
  };

  // Position cleanly ABOVE the bottom navigation bar on mobile (which is ~76px high with the center button)
  const bottomPositionClass = isBottomNavVisible
    ? 'bottom-[84px] md:bottom-5'
    : 'bottom-4 md:bottom-5';

  return (
    <div
      className={`fixed ${bottomPositionClass} left-0 right-0 z-[80] px-3 sm:px-4 pointer-events-auto transition-all animate-in slide-in-from-bottom duration-300 ${
        isRtl ? 'text-right' : 'text-left'
      }`}
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-[#1b1b1d]/98 backdrop-blur-2xl border border-[#f2ca50]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_12px_45px_rgba(0,0,0,0.95),0_0_25px_rgba(242,202,80,0.22)]">
          {/* Main Install Prompt View */}
          {!showGuide ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4">
              {/* Brand Logo & Copy */}
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-[#201f21] border border-[#f2ca50]/40 flex items-center justify-center p-1.5 shrink-0 shadow-md overflow-hidden">
                  <img
                    src="/icon-192.png"
                    alt="NABSHÉ App Icon"
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 pr-6 sm:pr-0">
                  <div className="flex items-center gap-2">
                    <span
                      id="pwa-install-title"
                      className="font-sans text-[14px] font-bold text-[#f2ca50] tracking-wide"
                    >
                      NABSHÉ
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30">
                      {isRtl ? 'تطبيق رسمي' : 'Official App'}
                    </span>
                  </div>
                  <p
                    id="pwa-install-description"
                    className="font-sans text-[12px] sm:text-[13px] text-[#e5e1e4] leading-snug mt-0.5"
                  >
                    {isRtl
                      ? 'قم بتثبيت تطبيق نابشيه للوصول السريع وتجربة تسوق وحجز أسرع.'
                      : 'Install NABSHÉ App for a Quick Access & faster experience.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons - Perfectly Matched Heights & Touch Targets */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0 pt-0.5 sm:pt-0">
                <button
                  onClick={handleDismiss}
                  type="button"
                  className="flex-1 sm:flex-initial h-11 px-5 rounded-xl border border-[#353437] bg-[#201f21] hover:bg-[#2a2a2c] text-[#d0c5af] hover:text-[#e5e1e4] font-sans text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center active:scale-95 leading-none"
                >
                  {isRtl ? 'ليس الآن' : 'Not Now'}
                </button>
                <button
                  onClick={handleInstallClick}
                  type="button"
                  className="flex-1 sm:flex-initial h-11 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[13px] font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_2px_14px_rgba(242,202,80,0.35)] cursor-pointer flex items-center justify-center gap-1.5 leading-none"
                >
                  <span className="material-symbols-outlined text-[17px] shrink-0">
                    download
                  </span>
                  <span>{isRtl ? 'تثبيت' : 'Install'}</span>
                </button>
              </div>

              {/* Top-Right Quick Close Icon */}
              <button
                onClick={handleDismiss}
                className="absolute top-2.5 right-2.5 sm:hidden w-6 h-6 rounded-full bg-[#201f21]/80 text-[#a09c9f] hover:text-[#e5e1e4] flex items-center justify-center cursor-pointer"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          ) : (
            /* Interactive Install Guide (For AI Studio Preview & iOS Safari) */
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[22px] text-[#f2ca50]">
                    devices
                  </span>
                  <div>
                    <h4 className="font-sans text-[14px] font-bold text-[#f2ca50]">
                      {isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
                    </h4>
                    <p className="font-sans text-[11px] text-[#a09c9f]">
                      {isInIframe
                        ? (isRtl ? 'وضع المعاينة داخل AI Studio' : 'AI Studio Live Preview Mode')
                        : isIos
                        ? (isRtl ? 'تعليمات نظام iOS / آيفون' : 'iOS Safari Installation')
                        : (isRtl ? 'تعليمات المتصفح' : 'Browser Installation Instructions')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="w-7 h-7 rounded-full bg-[#201f21] hover:bg-[#353437] text-[#d0c5af] hover:text-[#e5e1e4] flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Back"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              {hasSimulatedSuccess ? (
                <div className="p-3 rounded-xl bg-[#2e4c2f]/40 border border-[#4ade80]/40 text-[#86efac] flex items-center gap-2.5 animate-in fade-in">
                  <span className="material-symbols-outlined text-[20px] text-[#4ade80]">
                    check_circle
                  </span>
                  <span className="font-sans text-[12px] font-semibold">
                    {isRtl
                      ? 'تم التثبيت بنجاح! شكراً لاستخدامك تطبيق نابشيه.'
                      : 'App installed successfully! Thank you for choosing NABSHÉ.'}
                  </span>
                </div>
              ) : (
                <div className="space-y-2.5 text-[12px] text-[#e5e1e4]">
                  <p className="leading-relaxed text-[#d0c5af]">
                    {isInIframe
                      ? (isRtl
                          ? 'تمنع المتصفحات نوافذ التثبيت التلقائية داخل إطارات المعاينة (iframe). يمكنك فتح التطبيق في نافذة مستقلة لتشغيل نافذة التثبيت الرسمية:'
                          : 'Browsers restrict native install prompts inside iframes. You can open the app in a standalone tab or follow the guide below:')
                      : isIos
                      ? (isRtl
                          ? 'على أجهزة آيفون، اضغط على زر "مشاركة" (Share) في المتصفح ثم اختر "إضافة إلى الشاشة الرئيسية".'
                          : 'On iOS Safari, tap the Share button in the browser toolbar, then tap "Add to Home Screen".')
                      : (isRtl
                          ? 'اضغط على رمز التثبيت في شريط عنوان المتصفح أو القائمة ⋮ ثم اختر "تثبيت تطبيق نابشيه".'
                          : 'Click the install icon in your browser address bar or menu ⋮ and select "Install NABSHÉ App".')}
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 inline-flex items-center gap-1.5 px-4 rounded-xl bg-[#f2ca50] text-[#241a00] font-sans text-[12px] font-bold hover:brightness-110 active:scale-95 transition-all shadow-md leading-none"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        open_in_new
                      </span>
                      <span>
                        {isRtl ? 'فتح في نافذة جديدة' : 'Open in New Window'}
                      </span>
                    </a>

                    <button
                      onClick={handleSimulateInstall}
                      type="button"
                      className="h-10 inline-flex items-center gap-1.5 px-4 rounded-xl border border-[#353437] bg-[#201f21] hover:bg-[#2a2a2c] text-[#d0c5af] hover:text-[#e5e1e4] font-sans text-[12px] font-medium transition-colors cursor-pointer leading-none"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">
                        check
                      </span>
                      <span>
                        {isRtl ? 'محاكاة اكتمال التثبيت' : 'Simulate Install Done'}
                      </span>
                    </button>

                    <button
                      onClick={handleDismiss}
                      type="button"
                      className="h-10 px-3 rounded-xl text-[#a09c9f] hover:text-[#e5e1e4] text-[12px] transition-colors ml-auto cursor-pointer flex items-center justify-center leading-none"
                    >
                      {isRtl ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
