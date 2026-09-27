import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallModalProps {
  language?: Language;
}

const STORAGE_KEY = 'nabshe_pwa_dismissed';

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ language = 'en' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isRtl = language === 'ar';

  useEffect(() => {
    // Check if dismissed before
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        return;
      }
    } catch {
      // In case localStorage is blocked in private browsing
    }

    // Check if already running in standalone/installed mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setDeferredPrompt(e as BeforeInstallPromptEvent);
          setIsVisible(true);
        }
      } catch {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsVisible(true);
      }
    };

    const handleAppInstalled = () => {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
        } catch {
          // ignore
        }
      }
      setIsVisible(false);
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Error triggering PWA install prompt:', err);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setIsVisible(false);
    setDeferredPrompt(null);
  };

  if (!isVisible || !deferredPrompt) {
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
