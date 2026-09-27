import React, { useState } from 'react';
import { Language, ScreenType, UserProfile } from '../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetData: () => void;
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  pendingAptCount: number;
  pendingOrderCount: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onResetData,
  language,
  onNavigate,
  pendingAptCount,
  pendingOrderCount,
}) => {
  const isRtl = language === 'ar';
  const [name, setName] = useState<string>(userProfile.name);
  const [phone, setPhone] = useState<string>(userProfile.phone);
  const [area, setArea] = useState<string>(userProfile.area);
  const [prefLang, setPrefLang] = useState<Language>(userProfile.preferredLanguage);
  const [whatsappConsent, setWhatsappConsent] = useState<boolean>(userProfile.whatsappConsent);
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const areas = [
    'Al Wasl',
    'Downtown Dubai',
    'Jumeirah 1, 2, 3',
    'Dubai Marina',
    'Palm Jumeirah',
    'Emirates Hills',
    'Business Bay',
    'DIFC',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim() || 'Fatima Al-Mansoor',
      phone: phone.trim() || '+971 50 919 6975',
      area,
      preferredLanguage: prefLang,
      loyaltyNumber: userProfile.loyaltyNumber,
      whatsappConsent,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2400);
  };

  const handleConfirmReset = () => {
    onResetData();
    setShowResetConfirm(false);
  };

  return (
    <div className={`flex flex-col w-full max-w-6xl mx-auto pb-32 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Toast */}
      {savedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#201f21] border border-[#f2ca50]/50 text-[#e5e1e4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">verified</span>
          <span>{isRtl ? 'تم حفظ التعديلات بنجاح' : 'Profile details updated successfully'}</span>
        </div>
      )}

      {/* Header */}
      <section className="pt-1 pb-3 flex flex-col gap-1">
        <div className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]"></span>
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]">
            {isRtl ? 'الملف الشخصي' : 'Client Profile'}
          </span>
        </div>
        <h1 className="font-serif text-[26px] sm:text-[30px] md:text-[36px] text-[#e5e1e4] font-semibold tracking-tight">
          {isRtl ? 'الملف الشخصي والتفضيلات' : 'Profile & Preferences'}
        </h1>
        <p className="font-sans text-[13px] md:text-[14px] text-[#d0c5af] leading-relaxed">
          {isRtl
            ? 'إدارة بياناتك الشخصية، رقم العضوية، وتفضيلات المواعيد والتواصل.'
            : 'Manage your contact details, membership tier, and appointment notification preferences.'}
        </p>
      </section>

      {/* Main Two-Column Layout on Desktop / Stacked on Mobile & Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
        {/* Left Column: VIP Card, Activity, Salon Shortcuts, Device Privacy */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* VIP Profile ID Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a2a2c] via-[#201f21] to-[#1b1b1d] p-5 border border-[#f2ca50]/40 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2ca50]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZDwYEDZ_lYkEaYquFX8Mr59XuZZ-BQetk4ssD6ccBzbMnn9n0lqHGiIdAaqbM-Of-qinCd6sjXXHi_gLRQRQQCrMg1JRki5SbCNQl12C7HjrKE0K-MjuR1XayBpxuua0SWyfvO-mJGNSdpdLOUBuisIwhDKnjatsJFoORMFa9TEYv7jKLA0jPENLXmIsnkOq0-NGQktetGOtxtjQoHxXFfzCd0yX8LVw6x427AoURsFCOvGDCLKz2"
                  alt="Client Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#f2ca50]/80 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#47ea7a] rounded-full ring-2 ring-[#131315]"></span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-[18px] text-[#e5e1e4] font-semibold truncate">
                    {userProfile.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#f2ca50] text-[#241a00] font-sans text-[10px] font-bold uppercase tracking-wider shrink-0">
                    VIP
                  </span>
                </div>
                <p className="font-sans text-[12px] text-[#d0c5af] mt-0.5">
                  {userProfile.phone}
                </p>
                <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
                  <span className="font-sans text-[11px] text-[#f2ca50] font-semibold">
                    {userProfile.loyaltyNumber} • {userProfile.area}
                  </span>
                  <button
                    onClick={() => onNavigate('vip')}
                    className="px-2.5 py-1 rounded-full bg-[#f2ca50]/15 hover:bg-[#f2ca50] text-[#f2ca50] hover:text-[#241a00] font-sans text-[10px] font-bold uppercase tracking-wider transition-colors border border-[#f2ca50]/40 flex items-center gap-1 cursor-pointer"
                    type="button"
                  >
                    <span>{isRtl ? 'تفاصيل العضوية' : 'Membership Pass'}</span>
                    <span className="material-symbols-outlined text-[13px]">
                      {isRtl ? 'arrow_back' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Status Shortcut Bar */}
          <div className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#201f21] flex items-center justify-center text-[#f2ca50] border border-[#353437]/40">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[12px] font-semibold text-[#e5e1e4]">
                  {isRtl
                    ? `${pendingAptCount} موعد نشط • ${pendingOrderCount} طلب منتجات`
                    : `${pendingAptCount} Active Booking • ${pendingOrderCount} Shop Order`}
                </span>
                <span className="font-sans text-[11px] text-[#d0c5af]">
                  {isRtl ? 'تم الإرسال، بانتظار التأكيد' : 'Sent, awaiting confirmation'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('requests')}
              className="px-3.5 py-1.5 rounded-full bg-[#2a2a2c] hover:bg-[#f2ca50] hover:text-[#241a00] text-[#f2ca50] font-sans text-[11px] font-bold transition-colors cursor-pointer"
              type="button"
            >
              {isRtl ? 'عرض' : 'View'}
            </button>
          </div>

          {/* Salon Information & Staff Links */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-md space-y-3">
            <h4 className="font-serif text-[15px] text-[#e5e1e4] font-semibold">
              {isRtl ? 'معلومات الصالون وفريق العمل' : 'Salon Information & Staff'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={() => onNavigate('vip')}
                className="p-3 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] border border-[#353437]/40 flex flex-col items-start gap-1 transition-colors text-left cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">diamond</span>
                <span className="font-serif text-[13px] text-[#e5e1e4] font-medium">
                  {isRtl ? 'عضوية النخبة' : 'VIP Membership'}
                </span>
                <span className="font-sans text-[10px] text-[#99907c]">
                  {isRtl ? 'الفئات والمزايا' : 'Tiers and perks'}
                </span>
              </button>

              <button
                onClick={() => onNavigate('story')}
                className="p-3 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] border border-[#353437]/40 flex flex-col items-start gap-1 transition-colors text-left cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">store</span>
                <span className="font-serif text-[13px] text-[#e5e1e4] font-medium">
                  {isRtl ? 'قصة الصالون' : 'Our Story'}
                </span>
                <span className="font-sans text-[10px] text-[#99907c]">
                  {isRtl ? 'الموقع والرؤية' : 'Location & vision'}
                </span>
              </button>

              <button
                onClick={() => onNavigate('artisans')}
                className="p-3 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] border border-[#353437]/40 flex flex-col items-start gap-1 transition-colors text-left cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">group</span>
                <span className="font-serif text-[13px] text-[#e5e1e4] font-medium">
                  {isRtl ? 'الأخصائيات' : 'Our Specialists'}
                </span>
                <span className="font-sans text-[10px] text-[#99907c]">
                  {isRtl ? 'فريق العناية' : 'Therapists & team'}
                </span>
              </button>
            </div>
          </div>

          {/* Device Privacy & Reset Data */}
          <div className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-sans text-[12px] font-semibold text-[#e5e1e4]">
                {isRtl ? 'خصوصية الجهاز' : 'Device Privacy'}
              </span>
              <span className="font-sans text-[11px] text-[#d0c5af]">
                {isRtl ? 'مسح البيانات المخزنة محلياً' : 'Reset stored session & profile data'}
              </span>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#201f21] hover:bg-[#ff5e5e]/20 text-[#ff5e5e] border border-[#ff5e5e]/30 font-sans text-[11px] font-bold transition-colors cursor-pointer"
              type="button"
            >
              {isRtl ? 'مسح البيانات' : 'Clear Data'}
            </button>
          </div>
        </div>

        {/* Right Column: Personal Details & Preferences Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="p-5 sm:p-6 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-md space-y-5">
            <div className="border-b border-[#353437]/40 pb-3">
              <h3 className="font-serif text-[18px] text-[#e5e1e4] font-semibold">
                {isRtl ? 'تعديل البيانات الشخصية' : 'Personal Details & Preferences'}
              </h3>
              <p className="font-sans text-[12px] text-[#d0c5af] mt-0.5">
                {isRtl
                  ? 'يتم استخدام هذه البيانات لتأكيد المواعيد وتوصيل المنتجات.'
                  : 'These details are used for booking confirmations and shop deliveries.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-[11px] uppercase tracking-wider text-[#d0c5af] font-semibold block mb-1.5">
                  {isRtl ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#201f21] border border-[#353437]/50 rounded-xl px-3.5 py-2.5 text-[13px] text-[#e5e1e4] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div>
                <label className="font-sans text-[11px] uppercase tracking-wider text-[#d0c5af] font-semibold block mb-1.5">
                  {isRtl ? 'رقم الهاتف' : 'Contact Phone (+971)'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-[#201f21] border border-[#353437]/50 rounded-xl px-3.5 py-2.5 text-[13px] text-[#e5e1e4] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div>
                <label className="font-sans text-[11px] uppercase tracking-wider text-[#d0c5af] font-semibold block mb-1.5">
                  {isRtl ? 'منطقة السكن المفضلة' : 'Preferred Dubai Area'}
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-[#201f21] border border-[#353437]/50 rounded-xl px-3.5 py-2.5 text-[13px] text-[#e5e1e4] focus:outline-none focus:border-[#f2ca50]"
                >
                  {areas.map(a => (
                    <option key={a} value={a} className="bg-[#1b1b1d] text-[#e5e1e4]">
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-sans text-[11px] uppercase tracking-wider text-[#d0c5af] font-semibold block mb-1.5">
                  {isRtl ? 'اللغة المفضلة' : 'Preferred Language'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrefLang('en')}
                    className={`py-2 rounded-xl font-sans text-[12px] font-semibold border transition-all cursor-pointer ${
                      prefLang === 'en'
                        ? 'bg-[#f2ca50] text-[#241a00] border-[#f2ca50] shadow-sm'
                        : 'bg-[#201f21] text-[#d0c5af] border-[#353437]/40'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefLang('ar')}
                    className={`py-2 rounded-xl font-sans text-[12px] font-semibold border transition-all cursor-pointer ${
                      prefLang === 'ar'
                        ? 'bg-[#f2ca50] text-[#241a00] border-[#f2ca50] shadow-sm'
                        : 'bg-[#201f21] text-[#d0c5af] border-[#353437]/40'
                    }`}
                  >
                    العربية (AR)
                  </button>
                </div>
              </div>
            </div>

            {/* WhatsApp Consent */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#201f21] border border-[#353437]/40">
              <input
                type="checkbox"
                id="whatsappNotify"
                checked={whatsappConsent}
                onChange={(e) => setWhatsappConsent(e.target.checked)}
                className="w-5 h-5 rounded accent-[#f2ca50] cursor-pointer mt-0.5 shrink-0"
              />
              <label htmlFor="whatsappNotify" className="text-[12px] font-sans text-[#d0c5af] cursor-pointer leading-relaxed">
                {isRtl
                  ? 'استلام تنبيهات المواعيد وتحديثات توصيل المنتجات عبر واتساب'
                  : 'Receive appointment reminders and courier delivery updates on WhatsApp.'}
              </label>
            </div>

            {/* Form Save Action Row: Clean, Proportionate, NOT Stretchy */}
            <div className="pt-2 border-t border-[#353437]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-sans text-[11px] text-[#99907c] order-2 sm:order-1 text-center sm:text-left">
                {isRtl ? 'يتم حفظ التعديلات محلياً لهذا الجهاز' : 'Changes are securely saved to your local session'}
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 h-11 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#241a00] font-sans text-[12px] font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer order-1 sm:order-2"
              >
                <span className="material-symbols-outlined text-[17px]">save</span>
                <span>{isRtl ? 'حفظ التعديلات' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e0e10]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#1b1b1d] border border-[#353437] rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-serif text-[18px] text-[#e5e1e4] font-semibold">
              {isRtl ? 'تأكيد مسح البيانات' : 'Clear Saved Data?'}
            </h3>
            <p className="font-sans text-[12px] text-[#d0c5af] leading-relaxed">
              {isRtl
                ? 'سيتم مسح بياناتك الشخصية وحقيبة التسوق وسجل المواعيد المخزنة على هذا المتصفح.'
                : 'This will reset your local profile information, bag items, and stored activity records.'}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-[#201f21] text-[#e5e1e4] font-sans text-[12px] font-semibold hover:bg-[#2a2a2c]"
                type="button"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2 rounded-xl bg-[#ff5e5e] text-[#ffffff] font-sans text-[12px] font-bold hover:bg-[#ff4242]"
                type="button"
              >
                {isRtl ? 'تأكيد المسح' : 'Yes, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
