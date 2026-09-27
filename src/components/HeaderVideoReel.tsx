import React, { useEffect, useRef } from 'react';

interface HeaderVideoReelProps {
  src: string;
  poster?: string;
  className?: string;
}

export const HeaderVideoReel: React.FC<HeaderVideoReelProps> = ({
  src,
  poster,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict browser-compliance for soundless looping autoplay
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const startPlayback = () => {
      if (!video) return;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy deferred playback until first interaction
          const onFirstTouch = () => {
            if (video) {
              video.muted = true;
              video.play().catch(() => {});
            }
          };
          window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true });
          window.addEventListener('click', onFirstTouch, { once: true, passive: true });
        });
      }
    };

    // Attempt immediately and when canplay fires
    startPlayback();
    video.addEventListener('canplay', startPlayback, { once: true });

    return () => {
      video.removeEventListener('canplay', startPlayback);
    };
  }, [src]);

  return (
    <div
      className={`relative aspect-[9/16] w-full max-h-[195px] sm:max-h-[230px] rounded-2xl overflow-hidden bg-[#131315] shadow-none ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        className="w-full h-full object-cover rounded-2xl pointer-events-none"
      />
    </div>
  );
};
