import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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

  // Concurrency mutex lock to prevent concurrent calls to prompt()
  const isPromptingRef = useRef<boolean>(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Keep ref synchronized with state
  useEffect(() => {
    deferredPromptRef.current = deferredPrompt;
  }, [deferredPrompt]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);

    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    setIsIos(ios);

    // Initial standalone state
    const mql = window.matchMedia('(display-mode: standalone)');
    const isStandalone =
      mql.matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Dynamic listener for display-mode changes (e.g. app installed during session)
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setIsModalOpen(false);
        setDeferredPrompt(null);
        deferredPromptRef.current = null;
      }
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', handleMediaChange);
    } else {
      mql.addListener(handleMediaChange);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      deferredPromptRef.current = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      deferredPromptRef.current = null;
      setDeferredPrompt(null);
      setIsInstalled(true);
      setIsModalOpen(false);
      try {
        localStorage.setItem(DISMISSED_DATE_KEY, Date.now().toString());
      } catch {
        // Safe storage fallback
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check cooldown safely without fragmented returns
    let cooldownTimer: ReturnType<typeof setTimeout> | null = null;
    try {
      const dismissedDate = localStorage.getItem(DISMISSED_DATE_KEY);
      let isCooldownActive = false;
      if (dismissedDate) {
        const timestamp = parseInt(dismissedDate, 10);
        if (!isNaN(timestamp) && Date.now() - timestamp < SEVEN_DAYS_MS) {
          isCooldownActive = true;
        }
      }

      if (!isStandalone && !isCooldownActive) {
        cooldownTimer = setTimeout(() => {
          setIsModalOpen(true);
        }, 800);
      }
    } catch {
      // ignore security exceptions in strict sandboxed iframes
    }

    return () => {
      if (cooldownTimer) {
        clearTimeout(cooldownTimer);
      }
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleMediaChange);
      } else {
        mql.removeListener(handleMediaChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const openModal = () => {
    if (!isInstalled) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'manual_guide'> => {
    const promptEvent = deferredPromptRef.current;
    if (!promptEvent) {
      return 'manual_guide';
    }

    // Atomic mutex lock: prevents race condition / InvalidStateError on double invocation
    if (isPromptingRef.current) {
      return 'dismissed';
    }

    isPromptingRef.current = true;

    try {
      await promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;

      // Invalidate consumed prompt immediately
      deferredPromptRef.current = null;
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
      deferredPromptRef.current = null;
      setDeferredPrompt(null);
      return 'dismissed';
    } finally {
      isPromptingRef.current = false;
    }
  };

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
