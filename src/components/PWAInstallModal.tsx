import React, { useState, useEffect } from 'react';
import { usePWA } from '../context/PWAContext';
import { Language } from '../types';

interface PWAInstallModalProps {
  language?: Language;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const DISMISSED_DATE_KEY = 'nabshe_pwa_dismissed_date';

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ language = 'en' }) => {
  const { isInstallable, promptInstall } = usePWA();
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const isRtl = language === 'ar';

  useEffect(() => {
    try {
      const dismissedDate = localStorage.getItem(DISMISSED_DATE_KEY);
      if (dismissedDate) {
        const timestamp = parseInt(dismissedDate, 10);
        if (!isNaN(timestamp) && Date.now() - timestamp < SEVEN_DAYS_MS) {
          setIsDismissed(true);
          return;
        }
      }
      setIsDismissed(false);
    } catch {
      setIsDismissed(false);
    }
  }, []);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      try {
        localStorage.setItem(DISMISSED_DATE_KEY, Date.now().toString());
      } catch {
        // ignore
      }
    }
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_DATE_KEY, Date.now().toString());
    } catch {
      // ignore
    }
    setIsDismissed(true);
  };

  if (isDismissed || !isInstallable) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 w-full z-50 p-3 sm:p-4 pb-safe animate-in slide-in-from-bottom duration-300 pointer-events-auto ${
        isRtl ? 'text-right' : 'text-left'
      }`}
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1b1b1d]/98 backdrop-blur-2xl border border-[#f2ca50]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(242,202,80,0.18)] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Headline */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#201f21] border border-[#f2ca50]/40 flex items-center justify-center p-2 shrink-0 shadow-md">
              <img
                src="/nabshe-logo.png"
                alt="NABSHÉ Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[14px] font-bold text-[#f2ca50] tracking-wide" id="pwa-install-title">
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
                  ? 'قم بتثبيت تطبيق نابشيه لتجربة حجز أسرع وأسهل.'
                  : 'Install NABSHÉ App for a faster booking experience.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
            <button
              onClick={handleDismiss}
              type="button"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#353437] bg-[#201f21] text-[#d0c5af] hover:text-[#e5e1e4] hover:bg-[#2a2a2c] font-sans text-[12px] font-semibold transition-colors cursor-pointer text-center active:scale-95"
            >
              {isRtl ? 'ليس الآن' : 'Not Now'}
            </button>
            <button
              onClick={handleInstall}
              type="button"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[12px] font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_2px_14px_rgba(242,202,80,0.35)] cursor-pointer text-center"
            >
              {isRtl ? 'تثبيت' : 'Install'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
