import React from 'react';
import { Language, ScreenType } from '../types';

interface SanctuaryStoryScreenProps {
  language: Language;
  onNavigate: (screen: ScreenType) => void;
}

export const SanctuaryStoryScreen: React.FC<SanctuaryStoryScreenProps> = ({
  language,
  onNavigate,
}) => {
  const isRtl = language === 'ar';

  const principles = [
    {
      titleEn: '24K Cellular Gold Treatments',
      titleAr: 'عناية الذهب الخلوي عيار 24',
      descEn: 'Pure bio-compatible gold leaves applied with micro-vibrations to firm and hydrate skin layers.',
      descAr: 'رقائق ذهب نقية ومتوافقة حيوياً لتحفيز النضارة الطبيعية وترطيب طبقات البشرة بعمق.',
      icon: 'auto_awesome',
    },
    {
      titleEn: 'Damascus Rose Infusions',
      titleAr: 'خلاصات الورد الدمشقي الطبيعي',
      descEn: 'Steam-distilled pure rose water and botanical extracts to restore hydration and soothe skin.',
      descAr: 'مستخلصات الورد الطبيعي المقطر لترطيب البشرة وتهدئتها وتجديد نضارتها.',
      icon: 'local_florist',
    },
    {
      titleEn: 'Traditional Moroccan Beldi',
      titleAr: 'الحمام المغربي بالصابون البلدي',
      descEn: 'Pure olive-based black soap applied onto heated marble with invigorating eucalyptus steam.',
      descAr: 'صابون الزيتون الأسود الطبيعي على الرخام الدافئ مع بخار اليوكالبتوس المنعش والتقشير اللطيف.',
      icon: 'hot_tub',
    },
    {
      titleEn: 'Taif Oud & Sound Relaxation',
      titleAr: 'عود الطائف والاسترخاء الصوتي',
      descEn: 'Gentle singing bowl resonance and natural aged oud notes to promote quiet relaxation.',
      descAr: 'نغمات صوتية هادئة مع نفحات العود الطبيعي لتوفير أجواء استرخاء مريحة وهادئة.',
      icon: 'graphic_eq',
    },
  ];

  return (
    <div className={`flex flex-col w-full max-w-6xl mx-auto pb-32 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between py-2 border-b border-[#353437]/40 mb-3">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-[#d0c5af] hover:text-[#f2ca50] text-[12px] font-sans font-semibold transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isRtl ? 'arrow_forward' : 'arrow_back'}
          </span>
          <span>{isRtl ? 'الرئيسية' : 'Back'}</span>
        </button>
        <span className="font-sans text-[11px] text-[#f2ca50] uppercase tracking-wider font-bold">
          {isRtl ? 'عن نابشيه' : 'About NABSHÉ'}
        </span>
      </div>

      {/* Screen Title */}
      <section className="pt-1 pb-3 flex flex-col gap-1">
        <div className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]"></span>
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]">
            {isRtl ? 'صالون دبي الراقي' : 'Dubai Flagship Salon'}
          </span>
        </div>
        <h1 className="font-serif text-[26px] sm:text-[30px] md:text-[36px] text-[#e5e1e4] font-semibold tracking-tight">
          {isRtl ? 'قصة الصالون وموقعنا' : 'Our Story & Location'}
        </h1>
        <p className="font-sans text-[13px] md:text-[14px] text-[#d0c5af] leading-relaxed">
          {isRtl
            ? 'مساحة مريحة وفاخرة في جميرا بدبي تجمع بين تقاليد العناية العربية العريقة وأحدث بروتوكولات التجميل العالمية.'
            : 'A tranquil beauty destination in Jumeirah, Dubai uniting timeless regional beauty traditions with advanced European aesthetic care.'}
        </p>
      </section>

      {/* Hero Visual Card */}
      <div className="w-full h-56 md:h-72 rounded-3xl overflow-hidden relative border border-[#353437]/50 shadow-xl my-2">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6j7WR1aZZhmNtH4rY9JJb--A5GY7hfoop8fWHZo_YYkIFCwJbyxCPuiO18acyS2sjjeO2E_hkYh1129rvcleHzRElHDS8642K0I1uninuLS53kTam1umlLLmT8adw9Ga8jeNWJz28RZ2voO7At0aY7nkrKVnBIOZtzQ5xAkJZd860wZ0ip6ikEPThOiBXR_seHpk3w428cwDLv684_CoSN_NLvkRc-o0ZX5teIgS3e1BR2T9p95kz"
          alt="NABSHÉ Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#131315]/40 to-transparent"></div>
        <div className="absolute bottom-4 inset-x-5 flex items-center justify-between">
          <div>
            <span className="font-sans text-[10px] text-[#f2ca50] font-bold uppercase tracking-widest block">
              Wasl 51 · Jumeirah 1 · Dubai
            </span>
            <span className="font-serif text-[18px] md:text-[22px] text-[#e5e1e4] font-semibold">
              {isRtl ? 'أجواء من الهدوء والخصوصية التامة' : 'A Realm of Complete Calm & Privacy'}
            </span>
          </div>
        </div>
      </div>

      {/* Treatment Principles */}
      <section className="py-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">spa</span>
          <h2 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold">
            {isRtl ? 'ركائز العناية في نابشيه' : 'Our Care Principles'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {principles.map((principle, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-sm flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#201f21] border border-[#f2ca50]/30 flex items-center justify-center text-[#f2ca50] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">{principle.icon}</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-serif text-[15px] font-semibold text-[#e5e1e4]">
                  {isRtl ? principle.titleAr : principle.titleEn}
                </h3>
                <p className="font-sans text-[12px] text-[#d0c5af] leading-relaxed mt-1">
                  {isRtl ? principle.descAr : principle.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Private Suites Overview */}
      <section className="p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-md space-y-3 my-2">
        <h3 className="font-serif text-[16px] text-[#e5e1e4] font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">domain</span>
          <span>{isRtl ? 'الأجنحة وغرف الجلسات الخاصة' : 'Private Treatment Rooms'}</span>
        </h3>
        <p className="font-sans text-[12px] md:text-[13px] text-[#d0c5af] leading-relaxed">
          {isRtl
            ? 'صُممت غرف وأجنحة الصالون بعوازل صوتية متطورة وأسرّة معالجة حرارية مريحة لضمان أقصى درجات الخصوصية والراحة.'
            : 'Engineered with sound-attenuated acoustic panels and heated ergonomic treatment beds for private, uninterrupted sessions.'}
        </p>
        <div className="grid grid-cols-2 gap-3 pt-1 font-sans text-[11px] text-[#e5e1e4]">
          <div className="p-3 rounded-xl bg-[#201f21] border border-[#353437]/40 text-center">
            <span className="text-[#f2ca50] font-bold block mb-0.5">The Gold Suite</span>
            <span className="text-[#99907c] text-[11px]">{isRtl ? 'لجلسات الوجه والعرائس' : 'Private VIP & Bridal Care'}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#201f21] border border-[#353437]/40 text-center">
            <span className="text-[#f2ca50] font-bold block mb-0.5">Moroccan Hammam Room</span>
            <span className="text-[#99907c] text-[11px]">{isRtl ? 'رخام دافئ وبخار يوكالبتوس' : 'Heated Stone & Herbal Steam'}</span>
          </div>
        </div>
      </section>

      {/* Location & Visiting Hours */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-md space-y-3 my-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">location_on</span>
            <span className="font-serif text-[16px] font-semibold text-[#e5e1e4]">
              {isRtl ? 'الموقع ومواعيد العمل' : 'Salon Location & Hours'}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#47ea7a]/15 text-[#47ea7a] font-sans text-[10px] font-bold border border-[#47ea7a]/30">
            {isRtl ? 'يومياً حتى 10:00 مساءً' : 'Open Daily until 10:00 PM'}
          </span>
        </div>

        <div className="font-sans text-[12px] text-[#d0c5af] space-y-1">
          <p className="text-[#e5e1e4] font-semibold text-[13px]">
            Wasl 51, Al Wasl Road, Jumeirah 1, Dubai, United Arab Emirates
          </p>
          <p>
            {isRtl
              ? 'مواقف سيارات خاصة ومظللة مع خدمة صف السيارات (Valet) المجانية لعميلات الصالون.'
              : 'Dedicated underground parking with complimentary valet service for all salon guests.'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => onNavigate('services')}
          className="flex-1 h-12 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          type="button"
        >
          <span>{isRtl ? 'استعراض الخدمات' : 'Explore Services'}</span>
          <span className="material-symbols-outlined text-[16px]">
            {isRtl ? 'arrow_back' : 'arrow_forward'}
          </span>
        </button>

        <a
          href="https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20I%20would%20like%20directions%20to%20the%20salon."
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 h-12 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#47ea7a] font-sans text-[12px] font-semibold flex items-center justify-center gap-1.5 border border-[#353437]/50"
        >
          <span className="material-symbols-outlined text-[18px]">directions</span>
          <span>{isRtl ? 'الموقع' : 'Directions'}</span>
        </a>
      </div>
    </div>
  );
};
