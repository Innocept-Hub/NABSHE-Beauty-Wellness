import React, { useState, useMemo } from 'react';
import { Language, ScreenType, Treatment, AppointmentRequest, UserProfile } from '../types';
import { BOUTIQUE_PRODUCTS } from '../data/mockData';

interface BookingFlowScreenProps {
  treatment: Treatment;
  initialAddonIds: string[];
  initialPrice: number;
  initialSpecialist?: string | null;
  userProfile: UserProfile;
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  onBookingConfirmed: (appointment: AppointmentRequest) => void;
}

export const BookingFlowScreen: React.FC<BookingFlowScreenProps> = ({
  treatment,
  initialAddonIds,
  initialPrice,
  initialSpecialist,
  userProfile,
  language,
  onNavigate,
  onBookingConfirmed,
}) => {
  const isRtl = language === 'ar';

  // Current anchor date
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // Selected date state (defaults to today)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);
  const [hasUserSelectedDate, setHasUserSelectedDate] = useState<boolean>(false);

  // Calendar browsing month/year
  const [viewYear, setViewYear] = useState<number>(currentYear);
  const [viewMonth, setViewMonth] = useState<number>(currentMonth);

  // Formatted date translations
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const dayNamesShortEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesShortAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const getFormattedDate = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day);
    const dayName = isRtl ? dayNamesShortAr[d.getDay()] : dayNamesShortEn[d.getDay()];
    const monthName = isRtl ? monthNamesAr[month] : monthNamesEn[month].substring(0, 3);
    return isRtl
      ? `${dayName}، ${day} ${monthName} ${year}`
      : `${dayName}, ${day} ${monthName} ${year}`;
  };

  const selectedDate = getFormattedDate(selectedYear, selectedMonth, selectedDay);

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeError, setTimeError] = useState<string | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>(
    initialSpecialist || 'Layla Mansour'
  );

  // Selected products state initialized with incoming add-on IDs if any
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialAddonIds || []);
  const [showAllProducts, setShowAllProducts] = useState<boolean>(false);

  // Pre-fill user profile if available
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  // Calendar Calculation Helpers
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const blankDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isDayDisabled = (day: number) => {
    const target = new Date(viewYear, viewMonth, day, 23, 59, 59);
    const startOfToday = new Date(currentYear, currentMonth, currentDay, 0, 0, 0);
    return target < startOfToday;
  };

  const isDayToday = (day: number) => {
    return viewYear === currentYear && viewMonth === currentMonth && day === currentDay;
  };

  const isDaySelected = (day: number) => {
    return viewYear === selectedYear && viewMonth === selectedMonth && day === selectedDay;
  };

  const canGoPrev = viewYear > currentYear || (viewYear === currentYear && viewMonth > currentMonth);

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // 14 Available Time Slots
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM',
  ];

  // Specialists List
  const specialists = [
    {
      id: 'Any Available Specialist',
      nameEn: 'Any Available Specialist',
      nameAr: 'أي أخصائية متاحة',
      roleEn: 'NABSHÉ Team',
      roleAr: 'فريق صالون نبشي',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'Sarah Al-Hassan',
      nameEn: 'Sarah Al-Hassan',
      nameAr: 'سارة الحسن',
      roleEn: 'Lead Skin Aesthetician',
      roleAr: 'أخصائية أولى في العناية بالبشرة',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZDwYEDZ_lYkEaYquFX8Mr59XuZZ-BQetk4ssD6ccBzbMnn9n0lqHGiIdAaqbM-Of-qinCd6sjXXHi_gLRQRQQCrMg1JRki5SbCNQl12C7HjrKE0K-MjuR1XayBpxuua0SWyfvO-mJGNSdpdLOUBuisIwhDKnjatsJFoORMFa9TEYv7jKLA0jPENLXmIsnkOq0-NGQktetGOtxtjQoHxXFfzCd0yX8LVw6x427AoURsFCOvGDCLKz2',
    },
    {
      id: 'Layla Mansour',
      nameEn: 'Layla Mansour',
      nameAr: 'ليلى منصور',
      roleEn: 'Senior Hair Stylist & Colorist',
      roleAr: 'أخصائية الشعر والصبغات',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQufVJwV7JGRKs7KQPrJwz6BZeJpVOeKJRYm4wlsvk7XktlxBC2C7peS-xpFjSqJNahywjq0vDXteIRj6LuaIBiWwHIGXsCyS13qs0R2qbvRNYg0vO5mc3qkub_JBay15FbUnM70le7buAWGWTcrn0_yZ_-C3DxmpPwxIBFUM1U58UF7BXzG1bPKDJn-rJChIhEbqAUhb2eBLGMHhxdPk7_xycRiQVVP8fOugOKAv4X0hrMxmvsaiM',
    },
    {
      id: 'Amina Belkacem',
      nameEn: 'Amina Belkacem',
      nameAr: 'أمينة بلقاسم',
      roleEn: 'Senior Hammam Specialist',
      roleAr: 'خبيرة الحمام المغربي والطقوس الملكية',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Mj4j3cseMegjNMtAIA5Zb3OUFrCiKPWugI6Fi6toSMwsaHPS92yFneorLziCHTW5PyTzcae0UJr6apnrau0AjRP7H8JaHjLjYoxaCsvduwFi8HKfKaP5_dfpwUavMHMimg_ByiAwR1IYeoTjNXMHFaCUUz4QGrquoWo_LdcPOevUCzgj9dm8dEUhWSDo4kFd2TUjaoVt7WjsfVtoOLoXaO-PtWAs1rdRqPj8-etfa2SMWk8EyWfE',
    },
    {
      id: 'Maria Santos',
      nameEn: 'Maria Santos',
      nameAr: 'ماريا سانتوس',
      roleEn: 'Nail & Reflexology Specialist',
      roleAr: 'أخصائية العناية بالأظافر والرفلكسولوجي',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY1JPArjEgjYHn4degqwH6VMS84e3RONxgpjoaOxXvxqeQESEJEJ6OhhM-MGtyyU70zYf76dvwZYJZfaUxRXkRkEfirzZaKZhyOeFQXIQzWrguWHQlXp_4WCTAlgrHksAxcNR0gp4hoYP5caTe9blI5CVQdJkJmcAmQcSPJx4HQ0VIa9Wi7BMWaGGCzK1zSXLWuVOFZEFs7w_hI48J9l5coNH2wZAc52uYtXSriCiIHkY7dchBYPXO',
    },
    {
      id: 'Nour Al-Sabah',
      nameEn: 'Nour Al-Sabah',
      nameAr: 'نور الصباح',
      roleEn: 'Master Massage Therapist',
      roleAr: 'أخصائية أولى في المساج والعافية',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSFYMFvnZR-91IsQ9bw9Pc5f1UNBam5kedU-jBWMFKMOUhO6MykqydYhdx5NOcdzNxeE2IOdo9MmhwH5RvGbtLuwYcRdbZXPLZcpn_ZTtPVNmGFSqMuKhY25XkB0shVlHIQrjns3hIO1ktsO7xUJJVc2hwDkdZ9NyTtxA1AHtF5pFCLDMxjfseNFEigPdquEx1hQbqtXMTNvNLG5-rOSIprZ23-ZVXflkSHik6Di_4mBBCW6brUWcU',
    },
    {
      id: 'Elena Rostova',
      nameEn: 'Elena Rostova',
      nameAr: 'إيلينا روستوفا',
      roleEn: 'Cellular Aesthetician & Brows',
      roleAr: 'خبيرة العناية الخلوية وتصميم الحواجب',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUbgVFb8oN-xrWrebbCYImw6s-yWitfFPUrhH1TyDLGpcy3Oc-lqnMv1NBVe9mijN_soBL0dswbVZsUT7FnYeFJy5lPIJU4DsABmkHSNEaQISKjBRIOX-fM_vqBcLVqVrJUFKWwTKZqxwo6if3T886xO6j24WwC6j0XvzJGNLbk13QPrAnUR7Sg-9VGTkYomDufVVmdZ7uhy2cYp_6h_IPAsfop67JwpnRlqZO8vuZWgfQ74mIe_Aa',
    },
  ];

  // Dynamic 2 to 3 Recommended Products for this Treatment
  const recommendedProducts = useMemo(() => {
    // 1. Check if treatment has curated recommended products
    const matched = treatment.recommendedProducts
      ? treatment.recommendedProducts
          .map(rp => BOUTIQUE_PRODUCTS.find(bp => bp.id === rp.id))
          .filter((bp): bp is typeof BOUTIQUE_PRODUCTS[0] => Boolean(bp))
      : [];

    // 2. Add top category products to ensure at least 3 relevant recommendations
    const others = BOUTIQUE_PRODUCTS.filter(
      bp => !matched.some(m => m.id === bp.id)
    );

    return [...matched, ...others].slice(0, 3);
  }, [treatment]);

  // Extended boutique products for "Browse More"
  const extendedProducts = useMemo(() => {
    const recommendedIds = new Set(recommendedProducts.map(p => p.id));
    return BOUTIQUE_PRODUCTS.filter(p => !recommendedIds.has(p.id)).slice(0, 4);
  }, [recommendedProducts]);

  const handleToggleProduct = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Selected products details and calculations
  const selectedProducts = useMemo(() => {
    return BOUTIQUE_PRODUCTS.filter(p => selectedProductIds.includes(p.id));
  }, [selectedProductIds]);

  // Integer Fils currency math to prevent floating-point rounding errors
  const treatmentFils = Math.round(treatment.price * 100);
  const productsTotalFils = selectedProducts.reduce((sum, p) => sum + Math.round(p.price * 100), 0);
  const preVatSubtotalFils = treatmentFils + productsTotalFils;
  const vatAmountFils = Math.round(preVatSubtotalFils * 0.05);
  const currentTotalFils = preVatSubtotalFils + vatAmountFils;

  const productsTotal = productsTotalFils / 100;
  const preVatSubtotal = preVatSubtotalFils / 100;
  const vatAmount = vatAmountFils / 100;
  const currentTotal = currentTotalFils / 100;

  const validatePhone = (num: string) => {
    const clean = num.replace(/[\s\-\(\)]/g, '');
    if (!clean) {
      return isRtl ? 'يرجى إدخال رقم الهاتف (+971)' : 'Please enter your phone number (+971 ... ....)';
    }
    const isUaePrefix = clean.startsWith('+971') || clean.startsWith('00971') || clean.startsWith('971') || clean.startsWith('05') || clean.startsWith('5');
    if (!isUaePrefix || clean.length < 8) {
      return isRtl ? 'يرجى إدخال رقم هاتف إماراتي صالح (+971)' : 'Please enter a valid UAE phone number (+971 ... ....)';
    }
    return null;
  };

  const handleBookingSubmit = (e: React.FormEvent, viaWhatsApp: boolean = true) => {
    e.preventDefault();

    let hasError = false;
    let firstErrorElementId: string | null = null;
    const missingItems: string[] = [];

    // 1. Validate Time
    if (!selectedTime) {
      setTimeError(isRtl ? 'يرجى اختيار الوقت المناسب' : 'Please select an available time slot');
      missingItems.push(isRtl ? 'الوقت' : 'Time Slot');
      hasError = true;
      if (!firstErrorElementId) firstErrorElementId = 'step-time-section';
    } else {
      setTimeError(null);
    }

    // 2. Validate Guest Name
    if (!clientName.trim()) {
      setNameError(isRtl ? 'يرجى إدخال اسمك' : 'Please enter your full name');
      missingItems.push(isRtl ? 'الاسم' : 'Your Name');
      hasError = true;
      if (!firstErrorElementId) firstErrorElementId = 'client-name-input';
    } else {
      setNameError(null);
    }

    // 3. Validate Guest Phone
    const phoneErr = validatePhone(clientPhone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      missingItems.push(isRtl ? 'رقم الهاتف' : 'Phone Number');
      hasError = true;
      if (!firstErrorElementId) firstErrorElementId = 'client-phone-input';
    } else {
      setPhoneError(null);
    }

    if (hasError) {
      const bannerMsg = isRtl
        ? `يرجى إكمال الحقول المطلوبة: ${missingItems.join('، ')}`
        : `Please complete required details first: ${missingItems.join(', ')}`;
      setSubmitErrorMessage(bannerMsg);

      if (firstErrorElementId) {
        const el = document.getElementById(firstErrorElementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (firstErrorElementId === 'client-name-input' || firstErrorElementId === 'client-phone-input') {
            (el as HTMLInputElement).focus();
          }
        }
      }
      return;
    }

    setSubmitErrorMessage(null);
    setIsSubmitting(true);

    const newRef = `NAB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApt: AppointmentRequest = {
      id: `apt-${crypto.randomUUID()}`,
      refNumber: newRef,
      treatmentTitleEn: treatment.titleEn,
      treatmentTitleAr: treatment.titleAr,
      treatmentImage: treatment.imageUrl,
      dateStr: `${selectedDate} · ${selectedTime}`,
      timeStr: selectedTime,
      specialist: selectedSpecialist,
      duration: treatment.duration,
      price: treatment.price,
      statusEn: 'Sent, awaiting confirmation',
      statusAr: 'تم الإرسال، بانتظار التأكيد',
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      addOns: selectedProducts.map(p => `${p.titleEn} (${p.volumeEn}) — AED ${p.price}`),
      totalPrice: currentTotal,
    };

    // Format clean WhatsApp message for salon
    let whatsappMessage = '';
    if (selectedProducts.length > 0) {
      const productsListEn = selectedProducts
        .map(p => `• 1x ${p.titleEn} (${p.volumeEn}) — AED ${p.price}`)
        .join('\n');
      const productsListAr = selectedProducts
        .map(p => `• 1x ${p.titleAr} (${p.volumeAr}) — ${p.price} درهم`)
        .join('\n');

      if (isRtl) {
        whatsappMessage =
          `*مرحباً نبشي بيوتي (NABSHÉ Beauty)،*\n` +
          `أود تأكيد حجز موعدي:\n` +
          `✦ الخدمة: ${treatment.titleAr}\n` +
          `✦ الموعد: ${selectedDate} • ${selectedTime}\n` +
          `✦ الأخصائية: ${selectedSpecialist}\n` +
          `✦ الضيفة: ${clientName.trim()} (${clientPhone.trim()})\n` +
          (clientNotes.trim() ? `✦ ملاحظات: ${clientNotes.trim()}\n` : '') +
          `----------------------------\n` +
          `✦ المنتجات لتجهيزها لزيارتي:\n` +
          `${productsListAr}\n\n` +
          `الإجمالي: ${currentTotal.toFixed(2)} درهم (الخدمة: ${treatment.price} درهم | المنتجات: ${productsTotal} درهم | ضريبة 5%: ${vatAmount.toFixed(2)} درهم)\n` +
          `الاستلام: [الاستلام من الصالون]`;
      } else {
        whatsappMessage =
          `*Hello NABSHÉ Beauty,*\n` +
          `I would like to confirm my appointment:\n` +
          `✦ Service: ${treatment.titleEn}\n` +
          `✦ Date & Time: ${selectedDate} at ${selectedTime}\n` +
          `✦ Specialist: ${selectedSpecialist}\n` +
          `✦ Guest: ${clientName.trim()} (${clientPhone.trim()})\n` +
          (clientNotes.trim() ? `✦ Notes: ${clientNotes.trim()}\n` : '') +
          `----------------------------\n` +
          `✦ Products to prepare for my visit:\n` +
          `${productsListEn}\n\n` +
          `Total: AED ${currentTotal.toFixed(2)} (Service: AED ${treatment.price} | Products: AED ${productsTotal} | VAT 5%: AED ${vatAmount.toFixed(2)})\n` +
          `Fulfillment: [Pick Up at Salon]`;
      }
    } else {
      if (isRtl) {
        whatsappMessage =
          `*مرحباً نبشي بيوتي (NABSHÉ Beauty)،*\n` +
          `أود تأكيد حجز موعدي:\n` +
          `✦ الخدمة: ${treatment.titleAr}\n` +
          `✦ الموعد: ${selectedDate} • ${selectedTime}\n` +
          `✦ الأخصائية: ${selectedSpecialist}\n` +
          `✦ الضيفة: ${clientName.trim()} (${clientPhone.trim()})\n` +
          (clientNotes.trim() ? `✦ ملاحظات: ${clientNotes.trim()}\n` : '') +
          `----------------------------\n` +
          `الإجمالي: ${currentTotal.toFixed(2)} درهم (الخدمة: ${treatment.price} درهم | ضريبة 5%: ${vatAmount.toFixed(2)} درهم)\n` +
          `الاستلام: [حجز في الصالون]`;
      } else {
        whatsappMessage =
          `*Hello NABSHÉ Beauty,*\n` +
          `I would like to confirm my appointment:\n` +
          `✦ Service: ${treatment.titleEn}\n` +
          `✦ Date & Time: ${selectedDate} at ${selectedTime}\n` +
          `✦ Specialist: ${selectedSpecialist}\n` +
          `✦ Guest: ${clientName.trim()} (${clientPhone.trim()})\n` +
          (clientNotes.trim() ? `✦ Notes: ${clientNotes.trim()}\n` : '') +
          `----------------------------\n` +
          `Total: AED ${currentTotal.toFixed(2)} (Service: AED ${treatment.price} | VAT 5%: AED ${vatAmount.toFixed(2)})\n` +
          `Fulfillment: [Salon Appointment]`;
      }
    }

    const whatsappUrl = `https://wa.me/971509196975?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp SYNCHRONOUSLY to prevent popup blockers
    if (viaWhatsApp) {
      try {
        const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          const tempAnchor = document.createElement('a');
          tempAnchor.href = whatsappUrl;
          tempAnchor.target = '_blank';
          tempAnchor.rel = 'noopener noreferrer';
          document.body.appendChild(tempAnchor);
          tempAnchor.click();
          document.body.removeChild(tempAnchor);
        }
      } catch (err) {
        window.location.href = whatsappUrl;
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onBookingConfirmed(newApt);
    }, 450);
  };

  return (
    <div className={`flex flex-col w-full max-w-5xl mx-auto pb-44 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-[#353437]/40 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('treatment-detail')}
            className="w-9 h-9 rounded-full bg-[#201f21] flex items-center justify-center text-[#e5e1e4] hover:text-[#f2ca50]"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isRtl ? 'arrow_forward' : 'arrow_back'}
            </span>
          </button>
          <div className="flex flex-col">
            <span className="font-sans text-[10px] text-[#f2ca50] uppercase tracking-wider font-bold">
              {isRtl ? 'حجز موعد' : 'Appointment Booking'}
            </span>
            <h1 className="font-serif text-[18px] md:text-[20px] text-[#e5e1e4] font-semibold">
              {isRtl ? treatment.titleAr : treatment.titleEn}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-sans text-[11px] text-[#d0c5af] hidden sm:inline">
            {treatment.duration} min
          </span>
          <span className="font-serif text-[15px] sm:text-[17px] font-bold text-[#f2ca50]">
            AED {treatment.price}
          </span>
        </div>
      </div>

      <form onSubmit={(e) => handleBookingSubmit(e, true)} className="space-y-6">
        {/* Step 1 & 2: Calendar & Available Time Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Column 1: Step 1 Select Date */}
          <div className="flex flex-col h-full">
            <label className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#e5e1e4] flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#f2ca50] text-[#241a00] text-[10px] flex items-center justify-center font-bold">1</span>
                <span>{isRtl ? 'اختاري التاريخ' : 'Select Date'}</span>
              </span>
              <span className="text-[#f2ca50] text-[11px] font-semibold normal-case">
                {selectedDate}
              </span>
            </label>

            {/* Interactive Luxury Calendar Card */}
            <div className="bg-[#201f21] rounded-2xl border border-[#353437]/50 p-3.5 sm:p-4 shadow-md flex flex-col justify-between flex-1 h-full gap-2.5">
              {/* Month Header & Controls */}
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={!canGoPrev}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border transition-all ${
                    canGoPrev
                      ? 'bg-[#2a2a2c] text-[#e5e1e4] border-[#353437]/60 hover:border-[#f2ca50]/50 hover:text-[#f2ca50] active:scale-95'
                      : 'opacity-25 text-[#666] border-transparent cursor-not-allowed'
                  }`}
                  aria-label="Previous month"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isRtl ? 'chevron_right' : 'chevron_left'}
                  </span>
                </button>

                <h3 className="font-sans text-[12px] sm:text-[13px] font-bold tracking-widest uppercase text-[#e5e1e4]">
                  {isRtl ? `${monthNamesAr[viewMonth]} ${viewYear}` : `${monthNamesEn[viewMonth]} ${viewYear}`}
                </h3>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#2a2a2c] text-[#e5e1e4] border border-[#353437]/60 hover:border-[#f2ca50]/50 hover:text-[#f2ca50] flex items-center justify-center transition-all active:scale-95"
                  aria-label="Next month"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isRtl ? 'chevron_left' : 'chevron_right'}
                  </span>
                </button>
              </div>

              {/* Day of Week Row */}
              <div className="grid grid-cols-7 text-center border-b border-[#353437]/40 pb-1.5 pt-0.5">
                {(isRtl
                  ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
                  : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
                ).map((dName, idx) => (
                  <span
                    key={dName}
                    className={`font-sans text-[10px] sm:text-[10.5px] font-bold tracking-wider ${
                      idx === 5 || idx === 6 ? 'text-[#f2ca50]/90' : 'text-[#99907c]'
                    }`}
                  >
                    {dName}
                  </span>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {blankDays.map(b => (
                  <div key={`blank-${b}`} className="w-7 h-7 sm:w-8 sm:h-8 mx-auto" />
                ))}
                {monthDays.map(day => {
                  const disabled = isDayDisabled(day);
                  const isSelected = hasUserSelectedDate && isDaySelected(day);
                  const isTodayOutlined = isDayToday(day) && !isSelected;

                  return (
                    <div key={`day-cell-${day}`} className="flex items-center justify-center py-0.5">
                      <button
                        key={`day-${day}`}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          if (!disabled) {
                            setHasUserSelectedDate(true);
                            setSelectedYear(viewYear);
                            setSelectedMonth(viewMonth);
                            setSelectedDay(day);
                          }
                        }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full aspect-square font-sans text-[11px] sm:text-[12px] flex items-center justify-center transition-all mx-auto ${
                          isSelected
                            ? 'bg-[#f2ca50] text-[#241a00] font-bold shadow-[0_2px_10px_rgba(242,202,80,0.4)] scale-105 z-10'
                            : isTodayOutlined
                            ? 'border-[0.75px] border-white/85 text-white font-medium hover:border-white hover:bg-white/10'
                            : disabled
                            ? 'text-[#888594] font-normal cursor-not-allowed select-none'
                            : 'text-[#e5e1e4] hover:bg-[#2a2a2c] hover:text-[#f2ca50]'
                        }`}
                      >
                        {day}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Advance Booking Subtitle & Legend */}
              <div className="pt-1.5 flex items-center justify-between text-[10px] sm:text-[10.5px] text-[#99907c] border-t border-[#353437]/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full border-[0.75px] border-white/85" />
                    <span>{isRtl ? 'اليوم' : 'Today'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f2ca50]" />
                    <span>{isRtl ? 'المختار' : 'Selected'}</span>
                  </div>
                </div>
                <span className="text-[#d0c5af] font-sans">
                  {isRtl ? 'الحجز المسبق متاح' : 'Advance bookings available'}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Step 2 Select Time */}
          <div id="step-time-section" className="flex flex-col h-full scroll-mt-20">
            <label className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#e5e1e4] flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#f2ca50] text-[#241a00] text-[10px] flex items-center justify-center font-bold">2</span>
                <span>{isRtl ? 'اختاري الوقت' : 'Select Time'}</span>
              </span>
              {selectedTime ? (
                <span className="text-[#f2ca50] text-[11px] font-semibold normal-case">
                  {selectedTime}
                </span>
              ) : null}
            </label>

            <div className={`bg-[#201f21] rounded-2xl border p-3.5 sm:p-4 shadow-md flex flex-col justify-between flex-1 h-full gap-2.5 transition-all ${
              timeError ? 'border-[#ff5e5e] ring-2 ring-[#ff5e5e]/40' : 'border-[#353437]/50'
            }`}>
              <div className="flex items-center justify-between px-1">
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#d0c5af]">
                  {isRtl ? 'المواعيد المتاحة (14 توقيت)' : 'Available Slots (14 Times)'}
                </span>
                {timeError && (
                  <span className="font-sans text-[10.5px] text-[#ff5e5e] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">warning</span>
                    <span>{timeError}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-1.5 sm:gap-2 my-auto">
                {timeSlots.map(time => {
                  const isActive = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setSelectedTime(time);
                        if (timeError) setTimeError(null);
                        if (submitErrorMessage) setSubmitErrorMessage(null);
                      }}
                      className={`h-8 sm:h-8.5 px-1.5 sm:px-2 rounded-lg sm:rounded-xl font-sans text-[10.5px] sm:text-[11px] font-semibold transition-all border flex items-center justify-center active:scale-95 ${
                        isActive
                          ? 'bg-[#f2ca50] text-[#241a00] border-[#f2ca50] font-bold shadow-sm'
                          : 'bg-[#1b1b1d] text-[#e5e1e4] border-[#353437]/40 hover:bg-[#2a2a2c] hover:border-[#f2ca50]/40'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] text-[#99907c] block text-center pt-1.5 border-t border-[#353437]/30">
                {isRtl ? 'ساعات الصالون: 9:00 صباحاً – 10:00 مساءً' : 'Salon hours: 9:00 AM – 10:00 PM'}
              </span>
            </div>
          </div>
        </div>

        {/* Step 3: Select Specialist */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#e5e1e4] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#f2ca50] text-[#241a00] text-[10px] flex items-center justify-center font-bold">3</span>
              <span>{isRtl ? 'اختاري الأخصائية' : 'Select Specialist'}</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {specialists.map(spec => {
              const isActive = selectedSpecialist === spec.id;
              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => setSelectedSpecialist(spec.id)}
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all border ${
                    isRtl ? 'text-right' : 'text-left'
                  } ${
                    isActive
                      ? 'bg-[#2a2a2c] border-[#f2ca50] ring-1 ring-[#f2ca50]'
                      : 'bg-[#201f21] border-[#353437]/40 hover:border-[#f2ca50]/40'
                  }`}
                >
                  <img
                    src={spec.img}
                    alt={spec.nameEn}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80';
                    }}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#353437]/50"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-sans text-[12.5px] font-bold text-[#e5e1e4] truncate">
                      {isRtl ? spec.nameAr : spec.nameEn}
                    </span>
                    <span className="font-sans text-[10.5px] text-[#d0c5af] truncate">
                      {isRtl ? spec.roleAr : spec.roleEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: RECOMMENDED ESSENTIALS */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#e5e1e4] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#f2ca50] text-[#241a00] text-[10px] flex items-center justify-center font-bold">4</span>
              <span>{isRtl ? 'المستحضرات المقترحة' : 'RECOMMENDED ESSENTIALS'}</span>
            </label>
          </div>

          {/* Curated 2-3 Recommended Products Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recommendedProducts.map(product => {
              const isSelected = selectedProductIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#241e12] to-[#1c1b18] border-[#f2ca50] shadow-md'
                      : 'bg-[#201f21] border-[#353437]/50 hover:border-[#f2ca50]/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.titleEn}
                      className="w-14 h-14 rounded-xl object-cover bg-[#131315] border border-[#353437]/50 shrink-0"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-sans text-[12.5px] font-bold text-[#e5e1e4] leading-snug line-clamp-2">
                        {isRtl ? product.titleAr : product.titleEn}
                      </span>
                      <span className="font-sans text-[11px] text-[#d0c5af] mt-0.5">
                        {isRtl ? product.volumeAr : product.volumeEn}
                      </span>
                      <span className="font-serif text-[14px] font-bold text-[#f2ca50] mt-1">
                        AED {product.price}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleProduct(product.id)}
                    className={`w-full py-1.5 px-3 rounded-xl font-sans text-[11px] font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-[#f2ca50] text-[#241a00] shadow-[0_2px_8px_rgba(242,202,80,0.3)]'
                        : 'bg-[#1b1b1d] text-[#e5e1e4] hover:bg-[#2a2a2c] hover:text-[#f2ca50] border border-[#353437]/60'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        <span>{isRtl ? 'تمت الإضافة للزيارة' : 'ADDED TO VISIT'}</span>
                      </>
                    ) : (
                      <span>{isRtl ? '+ إضافة للزيارة' : '+ ADD TO VISIT'}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Toggle to browse more products */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAllProducts(prev => !prev)}
              className="text-[#f2ca50] hover:text-[#ffe088] font-sans text-[11.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {showAllProducts ? 'expand_less' : 'expand_more'}
              </span>
              <span>
                {showAllProducts
                  ? (isRtl ? 'إخفاء المستحضرات' : 'Show Fewer Products')
                  : (isRtl ? '+ تصفح المزيد من المستحضرات' : '+ Browse More Products')}
              </span>
            </button>

            {showAllProducts && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3 animate-in fade-in duration-200">
                {extendedProducts.map(product => {
                  const isSelected = selectedProductIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#241e12] to-[#1c1b18] border-[#f2ca50] shadow-md'
                          : 'bg-[#201f21] border-[#353437]/50 hover:border-[#f2ca50]/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.titleEn}
                          className="w-14 h-14 rounded-xl object-cover bg-[#131315] border border-[#353437]/50 shrink-0"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-sans text-[12.5px] font-bold text-[#e5e1e4] leading-snug line-clamp-2">
                            {isRtl ? product.titleAr : product.titleEn}
                          </span>
                          <span className="font-sans text-[11px] text-[#d0c5af] mt-0.5">
                            {isRtl ? product.volumeAr : product.volumeEn}
                          </span>
                          <span className="font-serif text-[14px] font-bold text-[#f2ca50] mt-1">
                            AED {product.price}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleProduct(product.id)}
                        className={`w-full py-1.5 px-3 rounded-xl font-sans text-[11px] font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-[#f2ca50] text-[#241a00] shadow-[0_2px_8px_rgba(242,202,80,0.3)]'
                            : 'bg-[#1b1b1d] text-[#e5e1e4] hover:bg-[#2a2a2c] hover:text-[#f2ca50] border border-[#353437]/60'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <span className="material-symbols-outlined text-[15px]">check_circle</span>
                            <span>{isRtl ? 'تمت الإضافة للزيارة' : 'ADDED TO VISIT'}</span>
                          </>
                        ) : (
                          <span>{isRtl ? '+ إضافة للزيارة' : '+ ADD TO VISIT'}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Step 5: Guest Details (No login or OTP step) */}
        <div id="step-guest-details" className="flex flex-col gap-3 scroll-mt-24">
          <div className="flex items-center justify-between">
            <label className="font-sans text-[12px] font-bold uppercase tracking-wider text-[#e5e1e4] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#f2ca50] text-[#241a00] text-[10px] flex items-center justify-center font-bold">5</span>
              <span>{isRtl ? 'معلومات الضيفة' : 'Guest Details'}</span>
            </label>
            <span className="font-sans text-[11px] text-[#ff5e5e]">
              * {isRtl ? 'حقول مطلوبة' : 'Required to confirm'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="client-name-input" className="block text-[11px] text-[#d0c5af] mb-1 font-sans">
                {isRtl ? 'الاسم الكامل' : 'Full Name'} <span className="text-[#ff5e5e]">*</span>
              </label>
              <input
                id="client-name-input"
                type="text"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  if (nameError) setNameError(null);
                  if (submitErrorMessage) setSubmitErrorMessage(null);
                }}
                placeholder={isRtl ? 'اسمك' : 'Your Name'}
                required
                className={`w-full bg-[#201f21] border rounded-xl px-4 py-3 text-[13px] text-[#e5e1e4] placeholder:text-[#99907c] focus:outline-none transition-all ${
                  nameError
                    ? 'border-[#ff5e5e] ring-2 ring-[#ff5e5e]/40'
                    : 'border-[#353437]/50 focus:border-[#f2ca50]'
                }`}
              />
              {nameError && (
                <p className="text-[11px] text-[#ff5e5e] mt-1 font-sans flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[13px]">warning</span>
                  <span>{nameError}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="client-phone-input" className="block text-[11px] text-[#d0c5af] mb-1 font-sans">
                {isRtl ? 'رقم الهاتف' : 'Phone Number'} <span className="text-[#ff5e5e]">*</span>
              </label>
              <input
                id="client-phone-input"
                type="tel"
                value={clientPhone}
                onChange={(e) => {
                  setClientPhone(e.target.value);
                  if (phoneError) setPhoneError(null);
                  if (submitErrorMessage) setSubmitErrorMessage(null);
                }}
                placeholder="+971 -- --- ----"
                required
                className={`w-full bg-[#201f21] border rounded-xl px-4 py-3 text-[13px] text-[#e5e1e4] placeholder:text-[#99907c] focus:outline-none transition-all ${
                  phoneError
                    ? 'border-[#ff5e5e] ring-2 ring-[#ff5e5e]/40'
                    : 'border-[#353437]/50 focus:border-[#f2ca50]'
                }`}
              />
              {phoneError && (
                <p className="text-[11px] text-[#ff5e5e] mt-1 font-sans flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[13px]">warning</span>
                  <span>{phoneError}</span>
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] text-[#d0c5af] mb-1 font-sans">
                {isRtl ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
              </label>
              <textarea
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                rows={2}
                placeholder={isRtl ? 'أي حساسية، تفضيلات، أو طلبات خاصة...' : 'Allergies, sensitivities, preferences...'}
                className="w-full bg-[#201f21] border border-[#353437]/50 rounded-xl px-4 py-2.5 text-[13px] text-[#e5e1e4] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Cost & VAT breakdown */}
        <div className="p-3.5 rounded-xl bg-[#201f21] border border-[#353437]/40 space-y-1.5 text-[12px] font-sans">
          <div className="flex justify-between text-[#d0c5af]">
            <span>{isRtl ? 'الخدمة (الموعد)' : 'Service (Appointment)'}</span>
            <span className="text-[#e5e1e4] font-medium">AED {treatment.price}</span>
          </div>

          {productsTotal > 0 && (
            <div className="flex justify-between text-[#d0c5af]">
              <span>{isRtl ? 'مستحضرات الزيارة' : 'Visit Products'} ({selectedProducts.length})</span>
              <span className="text-[#e5e1e4] font-medium">AED {productsTotal}</span>
            </div>
          )}

          <div className="flex justify-between text-[#d0c5af]">
            <span>{isRtl ? 'ضريبة القيمة المضافة (5%)' : 'VAT (5%)'}</span>
            <span className="text-[#e5e1e4] font-medium">AED {vatAmount.toFixed(2)}</span>
          </div>

          <div className="pt-2 border-t border-[#353437]/40 flex justify-between items-baseline font-bold">
            <span className="text-[#e5e1e4] text-[13px]">{isRtl ? 'الإجمالي (شامل الضريبة)' : 'Total (incl. 5% VAT)'}</span>
            <span className="text-[#f2ca50] text-[16px]">AED {currentTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Flexible Payment & Tabby split preview */}
        <div className="p-3 rounded-xl bg-[#201f21] border border-[#353437]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="bg-[#2bee98] text-[#052b1b] font-bold text-[10.5px] px-2 py-0.5 rounded font-sans tracking-wide">
              tabby
            </span>
            <span className="font-sans text-[11.5px] text-[#e5e1e4]">
              {isRtl
                ? `4 دفعات بقيمة AED ${(currentTotal / 4).toFixed(2)} — بدون فوائد`
                : `4 payments of AED ${(currentTotal / 4).toFixed(2)} — 0% interest`}
            </span>
          </div>
          <span className="font-sans text-[10.5px] text-[#99907c] shrink-0">
            {isRtl ? 'تسوية في الصالون أو عند تأكيد الحجز' : 'Settled at salon visit'}
          </span>
        </div>

        {/* Fixed Bottom Booking Confirmation Dock */}
        <div className="fixed bottom-0 inset-x-0 z-50 bg-[#161618]/95 backdrop-blur-2xl border-t border-[#353437]/70 py-2.5 sm:py-3 px-4 sm:px-6 shadow-[0_-10px_35px_rgba(0,0,0,0.7)] pb-safe">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            {/* Prominent Error Notice Banner in Bottom Dock */}
            {submitErrorMessage && (
              <div className="w-full bg-[#3d181a] border border-[#ff5e5e]/80 rounded-xl px-3 sm:px-4 py-2 text-[#ffd4d4] text-[11.5px] sm:text-[12px] font-sans flex items-center justify-between gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#ff5e5e] shrink-0">error</span>
                  <span className="font-semibold">{submitErrorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitErrorMessage(null)}
                  className="text-[#ffd4d4] hover:text-white text-[15px] leading-none shrink-0 px-1 font-bold cursor-pointer"
                  aria-label="Dismiss notice"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-6">
              {/* Left Column / Summary: Schedule & Total */}
              <div className="flex items-center justify-between md:justify-start md:gap-6">
                <div className="flex flex-col">
                  <span className="font-sans text-[9.5px] sm:text-[10px] tracking-widest text-[#99907c] font-semibold uppercase leading-none">
                    {isRtl ? 'الموعد المختار' : 'Selected Schedule'}
                  </span>
                  <span className="font-sans text-[12px] sm:text-[13px] font-medium text-[#e5e1e4] mt-1">
                    {selectedDate} {selectedTime ? `• ${selectedTime}` : ''}
                  </span>
                  {selectedProducts.length > 0 && (
                    <span className="font-sans text-[10.5px] text-[#f2ca50] font-medium mt-0.5">
                      +{selectedProducts.length} {isRtl ? 'مستحضرات مضافة للزيارة' : `product${selectedProducts.length > 1 ? 's' : ''} added`}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end md:items-start md:border-l md:border-[#353437]/60 md:pl-6">
                  <span className="font-sans text-[9.5px] sm:text-[10px] tracking-widest text-[#99907c] font-semibold uppercase leading-none">
                    {isRtl ? 'الإجمالي (شامل الضريبة)' : 'TOTAL'}
                  </span>
                  <span className="font-serif text-[16px] sm:text-[18px] font-bold text-[#f2ca50] leading-tight mt-0.5">
                    AED {currentTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Right Column: Two Buttons Across */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full md:w-auto md:min-w-[380px]">
                {/* Button 1: Book via WhatsApp */}
                <button
                  type="button"
                  onClick={(e) => handleBookingSubmit(e, true)}
                  disabled={isSubmitting}
                  className="h-9.5 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#241a00] font-sans text-[11px] sm:text-[11.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_2px_12px_rgba(242,202,80,0.22)] active:scale-95 transition-all cursor-pointer"
                >
                {isSubmitting ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5 fill-[#241a00] shrink-0"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>{isRtl ? 'واتساب' : 'WHATSAPP'}</span>
                  </>
                )}
              </button>

              {/* Button 2: Direct Call to Salon Reception */}
              <a
                href="tel:+971509196975"
                className="h-9.5 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] hover:border-[#f2ca50]/50 text-[#e5e1e4] font-sans text-[11px] sm:text-[11.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#353437]/70 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#f2ca50] shrink-0">call</span>
                <span>{isRtl ? 'اتصال مباشر' : 'DIRECT CALL'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      </form>
    </div>
  );
};
