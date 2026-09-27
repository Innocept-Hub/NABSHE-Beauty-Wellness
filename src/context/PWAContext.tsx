import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAContextType {
  isInstallable: boolean;
  hasNativePrompt: boolean;
  isInstalled: boolean;
  isInIframe: boolean;
  isIos: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'manual_guide'>;
}

const PWAContext = createContext<PWAContextType>({
  isInstallable: true,
  hasNativePrompt: false,
  isInstalled: false,
  isInIframe: false,
  isIos: false,
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  promptInstall: async () => 'manual_guide',
});

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const DISMISSED_DATE_KEY = 'nabshe_pwa_dismissed_date';

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);

    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    setIsIos(ios);

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(standalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setIsModalOpen(false);
      try {
        localStorage.setItem(DISMISSED_DATE_KEY, Date.now().toString());
      } catch {
        // ignore
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Initial 7-day cooldown check for automatically displaying modal
    try {
      const dismissedDate = localStorage.getItem(DISMISSED_DATE_KEY);
      let isCooldownActive = false;
      if (dismissedDate) {
        const timestamp = parseInt(dismissedDate, 10);
        if (!isNaN(timestamp) && Date.now() - timestamp < SEVEN_DAYS_MS) {
          isCooldownActive = true;
        }
      }

      // If not in standalone mode and cooldown is not active, display modal
      if (!standalone && !isCooldownActive) {
        const timer = setTimeout(() => {
          setIsModalOpen(true);
        }, 800);
        return () => {
          clearTimeout(timer);
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
          window.removeEventListener('appinstalled', handleAppInstalled);
        };
      }
    } catch {
      // ignore
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'manual_guide'> => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setIsModalOpen(false);
          try {
            localStorage.setItem(DISMISSED_DATE_KEY, Date.now().toString());
          } catch {
            // ignore
          }
          return 'accepted';
        }
        return 'dismissed';
      } catch (err) {
        console.error('Error triggering PWA install prompt:', err);
        setDeferredPrompt(null);
        return 'dismissed';
      }
    }

    // Inside iframe or iOS where native event is suppressed
    return 'manual_guide';
  };

  // App is installable if not already running as standalone PWA
  const isInstallable = !isInstalled;

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        hasNativePrompt: Boolean(deferredPrompt),
        isInstalled,
        isInIframe,
        isIos,
        isModalOpen,
        openModal,
        closeModal,
        promptInstall,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => useContext(PWAContext);
