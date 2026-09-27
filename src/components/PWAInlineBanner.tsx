import React, { useState } from 'react';
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
  const { isInstallable, promptInstall } = usePWA();
  const [isPrompting, setIsPrompting] = useState<boolean>(false);
  const isRtl = language === 'ar';

  if (!isInstallable) {
    return null;
  }

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsPrompting(true);
      const success = await promptInstall();
      if (success) {
        onInstalled?.();
      }
    } finally {
      setIsPrompting(false);
    }
  };

  return (
    <div
      className={`lg:hidden flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#201f21]/90 border border-[#f2ca50]/30 hover:border-[#f2ca50]/60 transition-all shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="material-symbols-outlined text-[18px] text-[#f2ca50] shrink-0 animate-pulse">
          install_mobile
        </span>
        <span className="font-sans text-[12px] font-semibold text-[#e5e1e4] truncate">
          {isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
        </span>
      </div>

      <button
        onClick={handleInstallClick}
        disabled={isPrompting}
        type="button"
        aria-label={isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
        title={isRtl ? 'تثبيت تطبيق نابشيه' : 'Install NABSHÉ App'}
        className="w-8 h-8 rounded-lg bg-[#f2ca50] hover:bg-[#ffe088] text-[#241a00] flex items-center justify-center transition-all active:scale-90 shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[17px]">
          download
        </span>
      </button>
    </div>
  );
};
