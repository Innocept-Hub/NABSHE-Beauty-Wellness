import React, { useState } from 'react';
import { Language, ScreenType, UserProfile } from '../types';

interface VipMembershipScreenProps {
  userProfile: UserProfile;
  language: Language;
  onNavigate: (screen: ScreenType) => void;
}

export const VipMembershipScreen: React.FC<VipMembershipScreenProps> = ({
  userProfile,
  language,
  onNavigate,
}) => {
  const isRtl = language === 'ar';
  const [activeTierTab, setActiveTierTab] = useState<'amber' | 'obsidian' | 'silver'>('amber');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const copyLoyalty = () => {
    navigator.clipboard.writeText(userProfile.loyaltyNumber);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const tiers = {
    silver: {
      titleEn: 'Silver Tier',
      titleAr: 'الفئة الفضية',
      thresholdEn: 'Entry Level',
      thresholdAr: 'مستوى الدخول',
      perksEn: [
        'Welcome herbal tea upon arrival for all appointments',
        '5% savings on all shop product purchases',
        'Seasonal salon announcements and priority updates',
      ],
      perksAr: [
        'شاي الأعشاب الترحيبي عند كل موعد',
        'خصم 5% على جميع مشتريات المتجر',
        'إشعارات مسبقة بالعروض والخدمات الجديدة',
      ],
    },
    amber: {
      titleEn: 'Gold Tier (Current)',
      titleAr: 'الفئة الذهبية (الحالية)',
      thresholdEn: 'Active Status · 1,850 pts',
      thresholdAr: 'حالة نشطة · 1,850 نقطة',
      perksEn: [
        'Priority booking for private suites and senior stylists',
        'Complimentary 15-minute relaxation session after facials',
        'Free courier delivery across Dubai on orders over AED 200',
        '10% savings on treatment packages',
        'Dedicated WhatsApp salon booking channel',
      ],
      perksAr: [
        'أولوية حجز الأجنحة الخاصة وكبار الأخصائيات',
        'جلسة استرخاء مجانية لمدة 15 دقيقة بعد العناية بالوجه',
        'توصيل سريع مجاني في دبي للطلبات فوق 200 درهم',
        'خصم 10% على باقات الخدمات',
        'قناة حجز وتواصل مخصصة عبر واتساب',
      ],
    },
    obsidian: {
      titleEn: 'Platinum Tier',
      titleAr: 'الفئة البلاتينية',
      thresholdEn: 'By Invitation Only',
      thresholdAr: 'بدعوة خاصة للأعضاء الأكثر ولاءً',
      perksEn: [
        'Exclusive private room reservation during peak hours',
        'Dedicated senior therapist team assigned to your preferences',
        'Complimentary hydration mask upgrade with any facial',
        'Chauffeured pickup within Dubai for packages over AED 1,000',
        'Complimentary companion treatment once per year',
      ],
      perksAr: [
        'إمكانية حجز جناح خاص مستقل خلال أوقات الذروة',
        'فريق أخصائيات مخصص لاختياراتك وتفضيلاتك الدائمة',
        'ترقية مجانية لقناع الترطيب مع أي جلسة وجه',
        'خدمة سيارة خاصة داخل دبي للباقات فوق 1,000 درهم',
        'جلسة عناية مجانية لمرافقة مرة كل عام',
      ],
    },
  };

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
          {isRtl ? 'برنامج العضوية' : 'Loyalty Program'}
        </span>
      </div>

      {/* Screen Title */}
      <section className="pt-1 pb-3 flex flex-col gap-1">
        <div className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]"></span>
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]">
            {isRtl ? 'بطاقة النادي' : 'Club Membership'}
          </span>
        </div>
        <h1 className="font-serif text-[26px] sm:text-[30px] md:text-[36px] text-[#e5e1e4] font-semibold tracking-tight">
          {isRtl ? 'عضوية ومكافآت نابشيه' : 'NABSHÉ VIP Membership'}
        </h1>
        <p className="font-sans text-[13px] md:text-[14px] text-[#d0c5af] leading-relaxed">
          {isRtl
            ? 'مزايا وخصومات حصرية لعميلات الصالون الدائمات مع أولوية في المواعيد.'
            : 'Exclusive privileges, savings, and priority appointments for our regular guests.'}
        </p>
      </section>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 my-4 items-start">
        {/* Left Column: VIP Pass & Sanctuary Privileges (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* VIP Member Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#1b1b1d] via-[#2a2a2c] to-[#3a3528] p-6 border border-[#f2ca50]/50 shadow-2xl luxury-card-hover group">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#f2ca50]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

            <div className="relative z-10 flex flex-col justify-between min-h-[200px]">
              {/* Card Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="/nabshe-logo.png"
                    alt="NABSHÉ Logo"
                    className="h-7 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://lh3.googleusercontent.com/aida/AEtjO1XZAiCzCucs9FzXbjnewf2ods18SiVfWE0oGX7zgwaUoOtSYVejhiW3h_UAykbB3qnl5a7JW2sXiU7lqQe-gfPpsZ9a3Ii7-9cq_i3GmEoOQzMjxLnp2cLlFo9mvGv1Jb6FffFW6ckjVRSE_GVUkia9iYtBOAjHKjY5todVjBPFDYGFj0fbk41wfV69VYXFfZ3rJ9ahfmcNshu1kRpuN6kW4BPHGnWheauwprA4OJjUhHQ8EDF2jcXzF98';
                    }}
                  />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#f2ca50] text-[#241a00] font-sans text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  Gold Tier
                </span>
              </div>

              {/* Member Name & Details */}
              <div className="my-5">
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#d0c5af] block">
                  {isRtl ? 'اسم العضوة' : 'Guest Member'}
                </span>
                <h2 className="font-serif text-[22px] md:text-[24px] text-[#e5e1e4] font-semibold tracking-wide mt-0.5">
                  {userProfile.name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-mono text-[13px] text-[#f2ca50] font-semibold tracking-wider">
                    {userProfile.loyaltyNumber}
                  </span>
                  <button
                    onClick={copyLoyalty}
                    className="p-1 rounded-md text-[#d0c5af] hover:text-[#f2ca50] hover:bg-[#353437]/40 transition-colors"
                    type="button"
                    title={isRtl ? 'نسخ رقم العضوية' : 'Copy Member ID'}
                    aria-label="Copy Member ID"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {copiedCode ? 'done' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="flex items-end justify-between pt-3 border-t border-[#353437]/60">
                <div className="flex flex-col">
                  <span className="font-sans text-[9px] uppercase tracking-wider text-[#99907c]">
                    {isRtl ? 'الفرع الأساسي' : 'Primary Salon'}
                  </span>
                  <span className="font-sans text-[11px] text-[#e5e1e4] font-medium">
                    Wasl 51, Jumeirah, Dubai
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-70" title="Security Beacon">
                  <span className="w-1 h-5 bg-[#f2ca50] rounded-sm"></span>
                  <span className="w-0.5 h-4 bg-[#f2ca50] rounded-sm"></span>
                  <span className="w-1.5 h-6 bg-[#f2ca50] rounded-sm"></span>
                  <span className="w-0.5 h-3 bg-[#f2ca50] rounded-sm"></span>
                  <span className="w-1 h-5 bg-[#f2ca50] rounded-sm"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Valet Parking Card */}
          <div className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 flex items-start gap-3.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#f2ca50]/15 border border-[#f2ca50]/30 flex items-center justify-center text-[#f2ca50] shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">local_parking</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider">
                {isRtl ? 'مواقف خاصة وخدمة فاليه' : 'Complimentary Valet Parking'}
              </span>
              <p className="font-sans text-[12px] text-[#d0c5af] leading-relaxed mt-0.5">
                {isRtl
                  ? 'مواقف مريحة ومظللة في وصل 51 مع خدمة صف السيارات مجاناً لجميع عضوات وضيوف الصالون.'
                  : 'Convenient covered parking in Wasl 51 with complimentary valet service for all salon visitors.'}
              </p>
            </div>
          </div>

          {/* VIP WhatsApp Fast-Track Notice */}
          <div className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 flex items-start gap-3.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-bold text-[#e5e1e4] uppercase tracking-wider">
                {isRtl ? 'مكتب الاستقبال المباشر' : 'Direct Reception Line'}
              </span>
              <p className="font-sans text-[12px] text-[#99907c] leading-relaxed mt-0.5">
                {isRtl
                  ? 'قناة اتصال سريعة ومخصصة لتنسيق المواعيد الخاصة وحجوزات الباقات والمناسبات.'
                  : 'Dedicated priority line to coordinate private suites, custom beauty elixirs, and bridal packages.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Tier Privileges & Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Tier Switcher Tabs */}
          <div className="flex items-center bg-[#201f21] p-1.5 rounded-2xl border border-[#353437]/50 shadow-inner">
            <button
              onClick={() => setActiveTierTab('silver')}
              className={`flex-1 py-2.5 px-3 text-center rounded-xl font-sans text-[12px] font-bold transition-all ${
                activeTierTab === 'silver'
                  ? 'bg-[#f2ca50] text-[#241a00] shadow-md'
                  : 'text-[#d0c5af] hover:text-[#e5e1e4]'
              }`}
              type="button"
            >
              {isRtl ? 'الفضية' : 'Silver'}
            </button>

            <button
              onClick={() => setActiveTierTab('amber')}
              className={`flex-1 py-2.5 px-3 text-center rounded-xl font-sans text-[12px] font-bold transition-all ${
                activeTierTab === 'amber'
                  ? 'bg-[#f2ca50] text-[#241a00] shadow-md'
                  : 'text-[#d0c5af] hover:text-[#e5e1e4]'
              }`}
              type="button"
            >
              {isRtl ? 'الذهبية (الحالية)' : 'Gold (Current)'}
            </button>

            <button
              onClick={() => setActiveTierTab('obsidian')}
              className={`flex-1 py-2.5 px-3 text-center rounded-xl font-sans text-[12px] font-bold transition-all ${
                activeTierTab === 'obsidian'
                  ? 'bg-[#f2ca50] text-[#241a00] shadow-md'
                  : 'text-[#d0c5af] hover:text-[#e5e1e4]'
              }`}
              type="button"
            >
              {isRtl ? 'البلاتينية' : 'Platinum'}
            </button>
          </div>

          {/* Tier Details Card */}
          <div className="p-6 rounded-3xl bg-[#1b1b1d] border border-[#353437]/50 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#353437]/40">
              <div>
                <h3 className="font-serif text-[18px] md:text-[21px] text-[#e5e1e4] font-semibold">
                  {isRtl ? tiers[activeTierTab].titleAr : tiers[activeTierTab].titleEn}
                </h3>
                <span className="font-sans text-[11px] text-[#f2ca50] font-semibold block mt-0.5">
                  {isRtl ? tiers[activeTierTab].thresholdAr : tiers[activeTierTab].thresholdEn}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#201f21] border border-[#353437]/60 flex items-center justify-center text-[#f2ca50] shadow-sm">
                <span className="material-symbols-outlined text-[24px]">
                  {activeTierTab === 'obsidian' ? 'diamond' : 'stars'}
                </span>
              </div>
            </div>

            {/* Perks List */}
            <div className="space-y-3 pt-1">
              {(isRtl ? tiers[activeTierTab].perksAr : tiers[activeTierTab].perksEn).map((perk, i) => (
                <div key={i} className="flex items-start gap-3 text-[13px] font-sans text-[#d0c5af]">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[18px] mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <span className="leading-relaxed">{perk}</span>
                </div>
              ))}
            </div>

            {/* Compact, Well-Proportioned Action Buttons Row */}
            <div className="pt-4 border-t border-[#353437]/40 flex flex-col sm:flex-row gap-2.5 items-center">
              <a
                href="https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20I%20would%20like%20to%20inquire%20about%20membership%20tiers%20and%20points."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 h-[40px] px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.35)] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                <span>{isRtl ? 'الاستفسار عبر واتساب' : 'Inquire on WhatsApp'}</span>
              </a>

              <button
                onClick={() => onNavigate('booking')}
                className="w-full sm:flex-1 h-[40px] px-4 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] hover:border-[#f2ca50]/40 text-[#e5e1e4] font-sans text-[11.5px] sm:text-[12px] font-semibold border border-[#353437]/60 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <span>{isRtl ? 'حجز موعد جديد' : 'Book Appointment'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
