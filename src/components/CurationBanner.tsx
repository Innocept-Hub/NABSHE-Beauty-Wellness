import React, { useState } from 'react';
import { Play, Sparkles, X, Volume2, Maximize2 } from 'lucide-react';
import { ScreenType } from '../types';

export interface CurationBannerProps {
  index: number;
  type?: 'service' | 'product' | 'general';
  isRtl?: boolean;
  onNavigate?: (screen: ScreenType) => void;
  onAction?: () => void;
}

interface BannerContent {
  tagEn: string;
  tagAr: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  actionEn: string;
  actionAr: string;
  mediaBadgeEn: string;
  mediaBadgeAr: string;
  videoDuration: string;
  bgGradient: string;
  imageUrl: string;
  targetScreen?: ScreenType;
}

const SERVICE_BANNERS: BannerContent[] = [
  {
    tagEn: 'Seasonal Special Offer',
    tagAr: 'عرض الموسم الحصري',
    titleEn: 'Complimentary 24K Gold Eye Therapy',
    titleAr: 'علاج مجاني لمحيط العينين بالذهب عيار 24',
    descEn: 'Receive complimentary botanical eye therapy with any royal ritual or bespoke facial booked this month in Downtown Dubai.',
    descAr: 'احصلي على علاج تكميلي لمحيط العينين مع أي جلسة علاجية ملكية أو فيشال مخصص هذا الشهر في وسط مدينة دبي.',
    actionEn: 'View Special Offer',
    actionAr: 'عرض تفاصيل العرض',
    mediaBadgeEn: 'Editorial Video Reel',
    mediaBadgeAr: 'فيديو حصري للملتقى',
    videoDuration: '0:45',
    bgGradient: 'from-[#201f21] via-[#2d281e] to-[#1b1b1d]',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    targetScreen: 'booking',
  },
  {
    tagEn: 'Artisan Ritual Cinema',
    tagAr: 'سينما طقوس نابتشي',
    titleEn: 'The Art of Moroccan Hammam & Hydrotherapy',
    titleAr: 'فن الحمام المغربي الملكي والعلاج المائي',
    descEn: 'Immerse in the sensory warmth of handcrafted black soap, eucalyptus steam chambers, and private marble relaxation suites.',
    descAr: 'انغمسي في دفء الصابون المغربي المعطر بالكينا، وغرف البخار الرخامية الخاصة لأقصى درجات الاسترخاء.',
    actionEn: 'Explore Hammam Suites',
    actionAr: 'استكشاف أجنحة الحمام',
    mediaBadgeEn: '4K Ritual Film',
    mediaBadgeAr: 'فيلم بدقة 4K',
    videoDuration: '1:12',
    bgGradient: 'from-[#1e1c24] via-[#24212b] to-[#1b1b1d]',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    targetScreen: 'services',
  },
  {
    tagEn: 'VIP Suites',
    tagAr: 'أجنحة خاصة',
    titleEn: 'Private VIP Suites & Dedicated Care',
    titleAr: 'أجنحة VIP الخاصة وعناية متميزة',
    descEn: 'Experience uninterrupted tranquility in soundproof private suites with expert specialists, private rain showers, and valet.',
    descAr: 'استمتعي بالهدوء والخصوصية في أجنحة عازلة للصوت مع أمهر الأخصائيات وخدمة صف السيارات المجانية.',
    actionEn: 'Inquire via WhatsApp',
    actionAr: 'تواصل عبر واتساب',
    mediaBadgeEn: 'Suite Tour Reel',
    mediaBadgeAr: 'جولة فيديو داخل الأجنحة',
    videoDuration: '0:58',
    bgGradient: 'from-[#201f21] via-[#2c2225] to-[#1b1b1d]',
    imageUrl: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=1200&q=80',
    targetScreen: 'vip',
  },
];

const PRODUCT_BANNERS: BannerContent[] = [
  {
    tagEn: 'Active Botanicals',
    tagAr: 'مستحضرات طبيعية',
    titleEn: 'Cold-Pressed Damascena Rose & Rare Royal Oud',
    titleAr: 'مستخلصات الورد الدمشقي ودهن العود الملكي النادر',
    descEn: 'Hand-distilled botanical serums, pure cold-pressed botanical oils, and genuine 24K cosmetic gold flakes formulated for daily glow.',
    descAr: 'سيرومات عشبية مقطرة يدوياً، زيوت معصورة على البارد ورقائق الذهب عيار 24 لإشراقة يومية مستدامة.',
    actionEn: 'Explore Products',
    actionAr: 'استكشف المنتجات',
    mediaBadgeEn: 'Sourcing Documentary',
    mediaBadgeAr: 'فيلم وثائقي للمكونات',
    videoDuration: '0:50',
    bgGradient: 'from-[#241e1c] via-[#2b2420] to-[#1b1b1d]',
    imageUrl: '/assets/Images/Hair-Serum.jpg',
    targetScreen: 'shop',
  },
  {
    tagEn: 'Home Ritual Experience',
    tagAr: 'طقوس العناية المنزلية',
    titleEn: 'Rose Quartz Sculpting & Lymphatic Wellness',
    titleAr: 'نحت البشرة بحجر الكوارتز الوردي الطبيعي',
    descEn: 'Pair your daily restorative serum with natural gemstone tools designed to drain puffiness and restore facial contour tension.',
    descAr: 'عززي روتينك اليومي بأدوات الأحجار الكريمة الطبيعية لشد البشرة وتنشيط الدورة الدموية.',
    actionEn: 'Explore Beauty Tools',
    actionAr: 'استكشف أدوات الجمال',
    mediaBadgeEn: 'How-to Ritual Video',
    mediaBadgeAr: 'فيديو توضيحي للاستخدام',
    videoDuration: '0:35',
    bgGradient: 'from-[#1f2022] via-[#26242a] to-[#1b1b1d]',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    targetScreen: 'shop',
  },
];

export const CurationBanner: React.FC<CurationBannerProps> = ({
  index,
  type = 'service',
  isRtl = false,
  onNavigate,
  onAction,
}) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const bannerList = type === 'product' ? PRODUCT_BANNERS : SERVICE_BANNERS;
  const banner = bannerList[index % bannerList.length];

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (onNavigate && banner.targetScreen) {
      onNavigate(banner.targetScreen);
    }
  };

  return (
    <div className="w-full my-6 sm:my-8 reveal-on-scroll">
      {/* Full-Width Luxury Editorial Banner */}
      <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#f2ca50]/25 bg-gradient-to-r ${banner.bgGradient} p-5 sm:p-7 md:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.45)] group transition-all hover:border-[#f2ca50]/45`}>
        {/* Ambient Subtle Radial Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#f2ca50]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#f2ca50]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Text Column (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4">
            {/* Top Pill / Seasonal Tag */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/35 text-[#f2ca50] font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <Sparkles size={12} className="text-[#f2ca50]" />
                <span>{isRtl ? banner.tagAr : banner.tagEn}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#201f21]/80 text-[#99907c] font-sans text-[10px] border border-[#353437]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                <span>{isRtl ? 'متاح الآن' : 'Available in Salon'}</span>
              </span>
            </div>

            {/* Headline */}
            <h3 className="font-serif text-[20px] sm:text-[23px] md:text-[26px] text-[#e5e1e4] font-medium leading-tight">
              {isRtl ? banner.titleAr : banner.titleEn}
            </h3>

            {/* Description */}
            <p className="font-sans text-[12px] sm:text-[13px] md:text-[14px] text-[#d0c5af] leading-relaxed max-w-xl">
              {isRtl ? banner.descAr : banner.descEn}
            </p>

            {/* CTA & Video Trigger Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAction}
                className="px-5 py-2.5 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#241a00] font-sans text-[12px] sm:text-[13px] font-bold tracking-wide shadow-md active:scale-95 transition-all flex items-center gap-2"
                type="button"
              >
                <span>{isRtl ? banner.actionAr : banner.actionEn}</span>
                <span className="material-symbols-outlined text-[16px]">
                  {isRtl ? 'arrow_back' : 'arrow_forward'}
                </span>
              </button>

              <button
                onClick={() => setShowVideoModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#201f21]/90 hover:bg-[#2a2a2c] text-[#e5e1e4] hover:text-[#f2ca50] border border-[#353437]/70 font-sans text-[12px] font-medium transition-colors flex items-center gap-2 active:scale-95 shadow-sm"
                type="button"
                title="Preview Video Placeholder"
              >
                <div className="w-5 h-5 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] flex items-center justify-center">
                  <Play size={10} className="fill-current ml-0.5" />
                </div>
                <span>{isRtl ? 'مشاهدة الفيديو التوضيحي' : 'Watch Video Reel'}</span>
                <span className="text-[10px] text-[#99907c] font-mono">({banner.videoDuration})</span>
              </button>
            </div>
          </div>

          {/* Right Video / Media Symbol Placeholder Box (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <div
              onClick={() => setShowVideoModal(true)}
              className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#f2ca50]/30 shadow-lg cursor-pointer group/video bg-[#141416]"
            >
              {/* Background Still Image with subtle dark luxury overlay */}
              <img
                src={banner.imageUrl}
                alt={banner.titleEn}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-700 opacity-80"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/Images/Body-Oil.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1d] via-[#1b1b1d]/40 to-transparent" />

              {/* Top Media Tags */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="font-sans text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#1b1b1d]/85 backdrop-blur-md text-[#f2ca50] border border-[#f2ca50]/30 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]" />
                  {isRtl ? banner.mediaBadgeAr : banner.mediaBadgeEn}
                </span>
                <span className="font-mono text-[10px] text-[#e5e1e4] bg-[#1b1b1d]/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#353437]/50">
                  {banner.videoDuration}
                </span>
              </div>

              {/* Center Video Symbol with Pulsing Ring */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f2ca50]/20 animate-ping opacity-75" />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#f2ca50] text-[#241a00] flex items-center justify-center shadow-[0_0_20px_rgba(242,202,80,0.5)] group-hover/video:scale-110 transition-transform">
                    <Play size={20} className="fill-current ml-0.5" />
                  </div>
                </div>
                <span className="font-sans text-[11px] font-semibold text-[#ffffff] bg-[#1b1b1d]/80 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10 tracking-wide">
                  {isRtl ? 'اضغط لتشغيل العرض' : 'Click to Play Reel'}
                </span>
              </div>

              {/* Bottom Placeholder Notice */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-[#d0c5af] z-10">
                <span>{isRtl ? 'مساحة مخصصة للفيديو أو البانر' : 'Video / Banner Asset Slot'}</span>
                <span className="text-[#f2ca50] font-mono">1080p · 60fps</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Video Player Placeholder Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-[#1b1b1d] border border-[#f2ca50]/40 rounded-2xl md:rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#353437]/50 flex items-center justify-between bg-[#201f21]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#f2ca50]/15 text-[#f2ca50] flex items-center justify-center border border-[#f2ca50]/30">
                  <Play size={16} className="fill-current ml-0.5" />
                </div>
                <div>
                  <h4 className="font-serif text-[15px] sm:text-[16px] text-[#e5e1e4] font-medium">
                    {isRtl ? banner.titleAr : banner.titleEn}
                  </h4>
                  <span className="font-sans text-[11px] text-[#d0c5af]">
                    {isRtl ? 'معاينة مشغل الفيديو الحصري' : 'NABSHÉ Cinematic Ritual Preview'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="w-8 h-8 rounded-full bg-[#2a2a2c] hover:bg-[#353437] text-[#d0c5af] hover:text-[#ffffff] flex items-center justify-center transition-colors"
                type="button"
                aria-label="Close video player"
              >
                <X size={16} />
              </button>
            </div>

            {/* Real Video Player Canvas */}
            <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
              <video
                src={type === 'product' ? '/assets/Video-Clips/collagen-serum.mp4' : '/assets/Video-Clips/hair-treatment.mp4'}
                controls
                autoPlay
                loop
                muted
                playsInline
                ref={(el) => {
                  if (el) {
                    el.muted = true;
                    el.play().catch(() => {});
                  }
                }}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#201f21] border-t border-[#353437]/50 flex items-center justify-between">
              <span className="font-sans text-[12px] text-[#d0c5af]">
                {isRtl ? 'يمكنك استبدال هذا النموذج بأي فيديو أو بنر مخصص' : 'This section seamlessly accommodates your video URL or banner graphic.'}
              </span>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  handleAction();
                }}
                className="px-4 py-2 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#241a00] font-sans text-[12px] font-bold transition-all shadow-sm"
                type="button"
              >
                {isRtl ? 'حجز هذه الخدمة' : 'Book Ritual Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
