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

// Module-level cache so we never miss beforeinstallprompt if it fired early
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    promptListeners.forEach((listener) => listener(globalDeferredPrompt));
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    promptListeners.forEach((listener) => listener(null));
  });
}

export interface PWAInstallButtonProps {
  language?: Language;
  variant?: 'compact' | 'full';
  className?: string;
  onInstalled?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language = 'en',
  variant = 'compact',
  className = '',
  onInstalled,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => globalDeferredPrompt
  );
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const isRtl = language === 'ar';

  useEffect(() => {
    const handlePromptChange = (prompt: BeforeInstallPromptEvent | null) => {
      setDeferredPrompt(prompt);
    };

    promptListeners.add(handlePromptChange);

    // Also check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setDeferredPrompt(null);
    }

    return () => {
      promptListeners.delete(handlePromptChange);
    };
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!deferredPrompt) return;

    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      // Clear the deferred prompt regardless of outcome as it cannot be used again
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
      promptListeners.forEach((listener) => listener(null));

      if (choiceResult.outcome === 'accepted') {
        onInstalled?.();
      }
    } catch (err) {
      console.error('Error during PWA installation:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  // Modern Chrome and Android suppress automatic popups; if event hasn't fired or app is installed, don't show
  if (!deferredPrompt) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        type="button"
        aria-label={isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
        title={isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-[28px] sm:h-[30px] rounded-full bg-[#1b1b1d] border border-[#f2ca50]/50 text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#241a00] hover:border-[#f2ca50] font-sans text-[11px] font-bold tracking-wider transition-all duration-200 active:scale-95 shadow-[0_2px_10px_rgba(242,202,80,0.15)] cursor-pointer shrink-0 ${className}`}
      >
        <span className="material-symbols-outlined text-[15px] sm:text-[16px] animate-pulse">
          install_mobile
        </span>
        <span className="hidden sm:inline whitespace-nowrap">
          {isRtl ? 'تثبيت التطبيق' : 'Install NABSHÉ App'}
        </span>
      </button>
    );
  }

  return (
    <div
      className={`w-full p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#1b1b1d] via-[#201f21] to-[#1b1b1d] border border-[#f2ca50]/40 shadow-[0_4px_20px_rgba(242,202,80,0.12)] flex items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#241a00] border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50] shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[22px]">install_mobile</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-sans text-[13px] font-bold text-[#f2ca50] truncate">
            {isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
          </h4>
          <p className="font-sans text-[11px] text-[#d0c5af] truncate">
            {isRtl ? 'حجز سريع وتجربة فاخرة بدون انترنت' : 'Fast booking & instant offline access'}
          </p>
        </div>
      </div>

      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        type="button"
        className="px-3.5 py-2 rounded-xl bg-[#f2ca50] text-[#241a00] font-sans text-[11.5px] font-bold hover:bg-[#ffe088] active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
      >
        {isRtl ? 'تثبيت' : 'Install'}
      </button>
    </div>
  );
};
