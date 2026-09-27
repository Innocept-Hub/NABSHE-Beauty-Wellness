import React from 'react';
import { usePWA } from '../context/PWAContext';
import { Language } from '../types';

interface PWAInlineBannerProps {
  language?: Language;
  className?: string;
  onInstalled?: () => void;
}

export const PWAInlineBanner: React.FC<PWAInlineBannerProps> = ({
  language = 'en',
  className = '',
  onInstalled,
}) => {
  const { isInstallable, openModal, hasNativePrompt, promptInstall } = usePWA();
  const isRtl = language === 'ar';

  if (!isInstallable) {
    return null;
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNativePrompt) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        onInstalled?.();
      }
    } else {
      // In iframe preview or iOS, open the interactive install modal/guide
      openModal();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`lg:hidden flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#201f21] border border-[#f2ca50]/40 hover:border-[#f2ca50] transition-all shadow-md cursor-pointer group ${className}`}
      role="button"
      tabIndex={0}
      aria-label={isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-[#f2ca50]/15 border border-[#f2ca50]/30 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[17px] text-[#f2ca50]">
            install_mobile
          </span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-[12px] font-bold text-[#e5e1e4] group-hover:text-[#f2ca50] transition-colors truncate">
              {isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
            </span>
          </div>
          <p className="font-sans text-[10px] text-[#a09c9f] truncate">
            {isRtl ? 'وصول أسرع وتجربة حجز مميزة' : 'Quick Access & faster booking'}
          </p>
        </div>
      </div>

      <button
        onClick={handleClick}
        type="button"
        aria-label={isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
        title={isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
        className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] hover:brightness-110 text-[#241a00] flex items-center justify-center transition-all active:scale-90 shadow-sm shrink-0 cursor-pointer font-bold"
      >
        <span className="material-symbols-outlined text-[18px]">
          download
        </span>
      </button>
    </div>
  );
};
