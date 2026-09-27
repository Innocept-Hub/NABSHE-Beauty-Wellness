import React, { useState } from 'react';
import { Language, ScreenType, AppointmentRequest } from '../types';

interface RequestReceivedScreenProps {
  appointment: AppointmentRequest;
  language: Language;
  onNavigate: (screen: ScreenType) => void;
}

export const RequestReceivedScreen: React.FC<RequestReceivedScreenProps> = ({
  appointment,
  language,
  onNavigate,
}) => {
  const isRtl = language === 'ar';
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [calendarToast, setCalendarToast] = useState<boolean>(false);

  const copyReference = () => {
    navigator.clipboard.writeText(appointment.refNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2200);
  };

  const handleAddToCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NABSHÉ Beauty & Wellness//NABSHE App//EN
BEGIN:VEVENT
SUMMARY:${appointment.treatmentTitleEn} at NABSHÉ
DESCRIPTION:Appointment at NABSHÉ Beauty & Wellness. Ref: ${appointment.refNumber}. Specialist: ${appointment.specialist}.
LOCATION:NABSHÉ Beauty & Wellness, Al Wasl Road, Jumeirah, Dubai
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nabshe-${appointment.refNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCalendarToast(true);
    setTimeout(() => setCalendarToast(false), 2600);
  };

  return (
    <div className={`flex flex-col w-full max-w-4xl mx-auto pb-28 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Toast Feedback */}
      {calendarToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#201f21] border border-[#f2ca50]/60 text-[#e5e1e4] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">event_available</span>
          <span>{isRtl ? 'تم تنزيل موعد التقويم بنجاح' : 'Calendar event downloaded & saved'}</span>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center justify-between py-2 border-b border-[#353437]/40 mb-3">
        <span className="font-sans text-[11px] text-[#f2ca50] uppercase tracking-wider font-bold">
          {isRtl ? 'تأكيد استلام الطلب' : 'Request Confirmation'}
        </span>
        <button
          onClick={() => onNavigate('home')}
          className="text-[#d0c5af] hover:text-[#e5e1e4] text-[12px] font-sans font-semibold flex items-center gap-1"
          type="button"
        >
          <span>{isRtl ? 'إغلاق' : 'Done'}</span>
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      {/* Celebration Header */}
      <div className="flex flex-col items-center text-center py-4">
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] flex items-center justify-center shadow-[0_0_35px_rgba(242,202,80,0.4)]">
            <span className="material-symbols-outlined text-[32px]">verified</span>
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#47ea7a] ring-2 ring-[#131315] flex items-center justify-center text-[10px] text-[#003915] font-bold">
            ✓
          </span>
        </div>

        <h1 className="font-serif text-[24px] sm:text-[28px] text-[#e5e1e4] font-semibold tracking-tight">
          {isRtl ? 'تم استلام طلبك بنجاح' : 'Request Received Successfully'}
        </h1>
        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-[#201f21] border border-[#f2ca50]/30">
          <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse"></span>
          <span className="text-[12px] font-sans font-semibold text-[#f2ca50]">
            {isRtl ? 'تم الإرسال، بانتظار التأكيد' : 'Sent, awaiting confirmation'}
          </span>
        </div>
        <p className="font-sans text-[13px] text-[#d0c5af] max-w-sm mt-2 leading-relaxed">
          {isRtl
            ? 'سيتواصل معك فريق الصالون عبر واتساب لتأكيد موعدك وتفاصيل الزيارة.'
            : 'Our salon team will contact you via WhatsApp to confirm your appointment time.'}
        </p>

        {/* Ref Code Pill */}
        <button
          onClick={copyReference}
          className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#201f21] border border-[#f2ca50]/40 text-[#f2ca50] font-sans text-[12px] font-bold tracking-wider hover:bg-[#2a2a2c] transition-all"
          type="button"
          title="Click to copy reference code"
        >
          <span>{appointment.refNumber}</span>
          <span className="material-symbols-outlined text-[15px]">
            {copiedRef ? 'done' : 'content_copy'}
          </span>
          {copiedRef && (
            <span className="text-[10px] text-[#47ea7a]">
              {isRtl ? 'تم النسخ' : 'Copied'}
            </span>
          )}
        </button>
      </div>

      {/* Dispatch Timeline */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-md my-3">
        <h3 className="font-serif text-[16px] font-semibold text-[#e5e1e4] mb-3">
          {isRtl ? 'مراحل متابعة الموعد' : 'Booking Progress'}
        </h3>

        <div className="flex flex-col gap-3 relative">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#47ea7a] text-[#003915] flex items-center justify-center text-[12px] font-bold shrink-0">
              ✓
            </span>
            <div className="flex flex-col">
              <span className="font-sans text-[12px] font-bold text-[#e5e1e4]">
                {isRtl ? 'تم استلام وتوثيق الطلب' : 'Request Received & Logged'}
              </span>
              <span className="font-sans text-[11px] text-[#d0c5af]">
                {isRtl ? 'تم تسجيل بياناتك وحجز الخانة المبدئية' : 'Your request is in our salon booking schedule'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#f2ca50] text-[#241a00] flex items-center justify-center text-[12px] font-bold shrink-0 animate-pulse">
              ●
            </span>
            <div className="flex flex-col">
              <span className="font-sans text-[12px] font-bold text-[#f2ca50]">
                {isRtl ? 'تأكيد الموعد عبر واتساب (خلال 15 دقيقة)' : 'Confirmation via WhatsApp (within 15 minutes)'}
              </span>
              <span className="font-sans text-[11px] text-[#d0c5af]">
                {isRtl ? 'سيتم إرسال بطاقة الموعد ورابط تقسيم الدفع' : 'We will send final schedule confirmation and payment options'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 opacity-60">
            <span className="w-6 h-6 rounded-full bg-[#353437] text-[#d0c5af] flex items-center justify-center text-[12px] font-bold shrink-0">
              3
            </span>
            <div className="flex flex-col">
              <span className="font-sans text-[12px] font-semibold text-[#e5e1e4]">
                {isRtl ? 'تجهيز الجناح والأخصائية' : 'Suite & Specialist Preparation'}
              </span>
              <span className="font-sans text-[11px] text-[#d0c5af]">
                {isRtl ? 'تجهيز المستحضرات ومواد العناية للجلسة' : 'Products and treatment room prepared prior to arrival'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmed Overview Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-md my-2 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img
            src={appointment.treatmentImage}
            alt={appointment.treatmentTitleEn}
            className="w-16 h-16 rounded-xl object-cover border border-[#353437]/50 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[11px] text-[#f2ca50] font-semibold">
              {appointment.duration} {isRtl ? 'دقيقة' : 'min'}
            </span>
            <h2 className="font-serif text-[16px] md:text-[18px] font-semibold text-[#e5e1e4] truncate">
              {isRtl ? appointment.treatmentTitleAr : appointment.treatmentTitleEn}
            </h2>
            <span className="font-sans text-[14px] font-bold text-[#f2ca50]">
              AED {appointment.totalPrice}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#353437]/40 grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px] font-sans">
          <div className="flex flex-col">
            <span className="text-[#d0c5af] text-[11px]">{isRtl ? 'الموعد' : 'Date & Time'}</span>
            <span className="text-[#e5e1e4] font-semibold">{appointment.dateStr}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#d0c5af] text-[11px]">{isRtl ? 'الأخصائية' : 'Specialist'}</span>
            <span className="text-[#e5e1e4] font-semibold">{appointment.specialist}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#d0c5af] text-[11px]">{isRtl ? 'الضيفة' : 'Guest'}</span>
            <span className="text-[#e5e1e4] font-semibold truncate">{appointment.clientName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#d0c5af] text-[11px]">{isRtl ? 'الهاتف' : 'Phone'}</span>
            <span className="text-[#e5e1e4] font-semibold truncate">{appointment.clientPhone}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 mt-3">
        <a
          href={`https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20I%20have%20submitted%20booking%20request%20${encodeURIComponent(appointment.refNumber)}%20for%20${encodeURIComponent(appointment.treatmentTitleEn)}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 rounded-full bg-[#25D366] text-[#003915] font-sans text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>{isRtl ? 'متابعة عبر محادثة واتساب' : 'Chat on WhatsApp'}</span>
        </a>

        <button
          onClick={handleAddToCalendar}
          className="w-full h-12 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#e5e1e4] border border-[#353437]/50 font-sans text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[19px] text-[#f2ca50]">calendar_add_on</span>
          <span>{isRtl ? 'إضافة إلى تقويم الهاتف' : 'Add to Calendar'}</span>
        </button>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onNavigate('requests')}
            className="flex-1 py-2.5 rounded-full bg-transparent hover:bg-[#201f21] text-[#f2ca50] text-[12px] font-sans font-bold transition-colors"
            type="button"
          >
            {isRtl ? 'عرض جميع طلباتي' : 'View My Requests'}
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 py-2.5 rounded-full bg-transparent hover:bg-[#201f21] text-[#d0c5af] text-[12px] font-sans transition-colors"
            type="button"
          >
            {isRtl ? 'العودة للرئيسية' : 'Return to Home'}
          </button>
        </div>
      </div>
    </div>
  );
};
