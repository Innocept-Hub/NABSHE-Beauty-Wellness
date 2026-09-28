import React, { useState, useEffect } from 'react';
import { Language, CartItem, UserProfile, BoutiqueOrder, ScreenType } from '../types';

export interface LinkedAppointment {
  serviceNameEn: string;
  serviceNameAr: string;
  dateTimeStr: string;
  price: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  userProfile: UserProfile;
  language: Language;
  onOrderConfirmed: (newOrder: BoutiqueOrder) => void;
  currentScreen?: ScreenType;
  onNavigate?: (screen: ScreenType) => void;
  linkedAppointment?: LinkedAppointment | null;
  onUnlinkAppointment?: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  userProfile,
  language,
  onOrderConfirmed,
  currentScreen = 'shop',
  onNavigate,
  linkedAppointment,
  onUnlinkAppointment,
}) => {
  if (!isOpen) return null;

  const isRtl = language === 'ar';
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(true);
  const [selectedArea, setSelectedArea] = useState<string>(userProfile.area || 'Al Wasl');
  const [phone, setPhone] = useState<string>(userProfile.phone || '+971 50 919 6975');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [isAppointmentIncluded, setIsAppointmentIncluded] = useState<boolean>(Boolean(linkedAppointment));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // Synchronize appointment inclusion when linkedAppointment prop changes
  useEffect(() => {
    setIsAppointmentIncluded(Boolean(linkedAppointment));
  }, [linkedAppointment]);

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

  // Combined order logic with integer Fils currency math to prevent floating-point rounding errors
  const hasCombined = Boolean(isAppointmentIncluded && linkedAppointment);
  const productsSubtotalFils = cart.reduce((sum, item) => sum + Math.round(item.product.price * 100) * item.quantity, 0);
  const servicePriceFils = hasCombined && linkedAppointment ? Math.round(linkedAppointment.price * 100) : 0;

  // 5% UAE VAT calculation in integer Fils
  const preVatSubtotalFils = (hasCombined ? servicePriceFils : 0) + productsSubtotalFils;
  const vatAmountFils = Math.round(preVatSubtotalFils * 0.05);

  const productsSubtotal = productsSubtotalFils / 100;
  const servicePrice = servicePriceFils / 100;
  const preVatSubtotal = preVatSubtotalFils / 100;
  const vatAmount = vatAmountFils / 100;

  // Delivery fee calculation
  const deliveryFeeFils = hasCombined || fulfillmentMethod === 'pickup'
    ? 0
    : productsSubtotal >= 300 || productsSubtotal === 0 ? 0 : 3500;
  const deliveryFee = deliveryFeeFils / 100;

  const totalFils = preVatSubtotalFils + vatAmountFils + deliveryFeeFils;
  const total = totalFils / 100;

  const handleValidateAndSubmit = () => {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone.startsWith('+971') && !cleanPhone.startsWith('05') && !cleanPhone.startsWith('971')) {
      setPhoneError(
        isRtl
          ? 'يرجى إدخال رقم هاتف إماراتي صالح (+971)'
          : 'Please enter a valid UAE phone number starting with +971'
      );
      return;
    }
    setPhoneError(null);
    setIsSubmitting(true);

    const orderNumber = `NB-${Math.floor(4000 + Math.random() * 5000)}`;
    const newOrder: BoutiqueOrder = {
      id: `ord-${crypto.randomUUID()}`,
      orderNumber,
      itemsCount: cart.reduce((s, i) => s + i.quantity, 0) + (hasCombined ? 1 : 0),
      totalPrice: total,
      statusEn: 'Sent, awaiting confirmation',
      statusAr: 'تم الإرسال، بانتظار التأكيد',
      packagingEn: 'Complimentary Luxury Packaging',
      packagingAr: 'تغليف فاخر مجاني',
      deliveryArea: fulfillmentMethod === 'pickup' || hasCombined ? 'NABSHÉ Al Wasl Salon' : selectedArea,
      items: cart.map(item => ({
        titleEn: item.product.titleEn,
        titleAr: item.product.titleAr,
        volume: item.product.volumeEn,
        qty: item.quantity,
        price: Math.round(item.product.price * item.quantity * 100) / 100,
        imageUrl: item.product.imageUrl,
      })),
    };

    // Format WhatsApp message strictly matching the requested flow
    let whatsappMessage = '';

    if (hasCombined && linkedAppointment) {
      // 1. Combined (Services + Products) WhatsApp format
      const productsListEn = cart
        .map(i => `• ${i.quantity}x ${i.product.titleEn} (${i.product.volumeEn}) — AED ${((Math.round(i.product.price * 100) * i.quantity) / 100).toFixed(2)}`)
        .join('\n');

      const productsListAr = cart
        .map(i => `• ${i.quantity}x ${i.product.titleAr} (${i.product.volumeAr}) — ${((Math.round(i.product.price * 100) * i.quantity) / 100).toFixed(2)} درهم`)
        .join('\n');

      if (isRtl) {
        whatsappMessage =
          `*مرحباً نبشي بيوتي (NABSHÉ Beauty)،*\n` +
          `أود تأكيد حجز موعدي:\n` +
          `✦ الخدمة: ${linkedAppointment.serviceNameAr}\n` +
          `✦ الموعد: ${linkedAppointment.dateTimeStr}\n` +
          `----------------------------\n` +
          `✦ المنتجات لتجهيزها لزيارتي:\n` +
          `${productsListAr}\n\n` +
          `الإجمالي: ${total.toFixed(2)} درهم (الخدمة: ${servicePrice.toFixed(2)} درهم | المنتجات: ${productsSubtotal.toFixed(2)} درهم | ضريبة 5%: ${vatAmount.toFixed(2)} درهم)\n` +
          `الاستلام: [الاستلام من الصالون]`;
      } else {
        whatsappMessage =
          `*Hello NABSHÉ Beauty,*\n` +
          `I would like to confirm my appointment:\n` +
          `✦ Service: ${linkedAppointment.serviceNameEn}\n` +
          `✦ Date & Time: ${linkedAppointment.dateTimeStr}\n` +
          `----------------------------\n` +
          `✦ Products to prepare for my visit:\n` +
          `${productsListEn}\n\n` +
          `Total: AED ${total.toFixed(2)} (Service: AED ${servicePrice.toFixed(2)} | Products: AED ${productsSubtotal.toFixed(2)} | VAT 5%: AED ${vatAmount.toFixed(2)})\n` +
          `Fulfillment: [Pick Up at Salon]`;
      }
    } else {
      // 2. Products Only WhatsApp format
      const productsListEn = cart
        .map(i => `• ${i.quantity}x ${i.product.titleEn} (${i.product.volumeEn}) — AED ${((Math.round(i.product.price * 100) * i.quantity) / 100).toFixed(2)}`)
        .join('\n');

      const productsListAr = cart
        .map(i => `• ${i.quantity}x ${i.product.titleAr} (${i.product.volumeAr}) — ${((Math.round(i.product.price * 100) * i.quantity) / 100).toFixed(2)} درهم`)
        .join('\n');

      const fulfillmentLabelEn =
        fulfillmentMethod === 'pickup' ? '[Pick Up at Salon]' : `[Delivery - ${selectedArea}, Dubai]`;
      const fulfillmentLabelAr =
        fulfillmentMethod === 'pickup' ? '[الاستلام من الصالون]' : `[توصيل سريع - ${selectedArea}، دبي]`;

      if (isRtl) {
        whatsappMessage =
          `*مرحباً نبشي بيوتي (NABSHÉ Beauty)،*\n` +
          `أود طلب المنتجات التالية:\n` +
          `✦ المنتجات:\n` +
          `${productsListAr}\n` +
          `----------------------------\n` +
          `الإجمالي: ${total.toFixed(2)} درهم (المنتجات: ${productsSubtotal.toFixed(2)} درهم | ضريبة 5%: ${vatAmount.toFixed(2)} درهم${deliveryFee > 0 ? ` | التوصيل: ${deliveryFee.toFixed(2)} درهم` : ''})\n` +
          `طريقة الاستلام: ${fulfillmentLabelAr}`;
      } else {
        whatsappMessage =
          `*Hello NABSHÉ Beauty,*\n` +
          `I would like to order:\n` +
          `✦ Products:\n` +
          `${productsListEn}\n` +
          `----------------------------\n` +
          `Total: AED ${total.toFixed(2)} (Products: AED ${productsSubtotal.toFixed(2)} | VAT 5%: AED ${vatAmount.toFixed(2)}${deliveryFee > 0 ? ` | Delivery: AED ${deliveryFee.toFixed(2)}` : ''})\n` +
          `Fulfillment: ${fulfillmentLabelEn}`;
      }
    }

    const whatsappUrl = `https://wa.me/971509196975?text=${encodeURIComponent(whatsappMessage)}`;

    setIsSubmitting(false);
    try {
      const tempAnchor = document.createElement('a');
      tempAnchor.href = whatsappUrl;
      tempAnchor.target = '_blank';
      tempAnchor.rel = 'noopener noreferrer';
      document.body.appendChild(tempAnchor);
      tempAnchor.click();
      document.body.removeChild(tempAnchor);
    } catch {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    onOrderConfirmed(newOrder);
    onClose();
  };

  const handleGatewayClick = (gateway: 'Ziina' | 'Telr') => {
    setPaymentNotice(
      isRtl
        ? `سيتم تحويلك إلى بوابة الدفع الآمنة ${gateway} لسداد ${total.toFixed(2)} درهم إماراتي. جاري تجهيز رابط الدفع المباشر...`
        : `Connecting to secure ${gateway} payment gateway for AED ${total.toFixed(2)}. Preparing instant payment link...`
    );
    setTimeout(() => {
      setPaymentNotice(
        isRtl
          ? `بوابة دفع ${gateway} قيد الفحص المالي المباشر. يرجى الضغط على "الطلب عبر الواتساب" للتأكيد الفوري واستلام رابط الدفع من الصالون.`
          : `${gateway} gateway is ready. You can also tap "ORDER VIA WHATSAPP" to receive a direct Apple Pay / Card link from NABSHÉ WhatsApp.`
      );
    }, 1800);
  };

  const isFromServices = currentScreen === 'services' || currentScreen === 'packages';
  const backButtonLabel = isRtl
    ? (isFromServices ? 'العودة إلى الخدمات' : 'العودة إلى المتجر')
    : (isFromServices ? 'BACK TO SERVICES' : 'BACK TO SHOP');

  const handleBackNavigation = () => {
    onClose();
    if (onNavigate) {
      if (isFromServices) {
        onNavigate('services');
      } else {
        onNavigate('shop');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-[#0e0e10]/85 backdrop-blur-md transition-opacity p-0 sm:p-4">
      <div
        className={`w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] flex flex-col bg-[#1b1b1d] border border-[#353437] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 pb-safe ${
          isRtl ? 'text-right' : 'text-left'
        }`}
      >
        {/* Grab bar for mobile */}
        <div className="w-12 h-1 rounded-full bg-[#353437] mx-auto mt-3 shrink-0 sm:hidden"></div>

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#353437]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">shopping_bag</span>
            <h2 className="font-serif text-[18px] text-[#e5e1e4] font-semibold">
              {isRtl ? 'حقيبة التسوق' : 'Shopping Bag'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#201f21] flex items-center justify-center text-[#d0c5af] hover:text-[#e5e1e4]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* PWA Install Banner */}
          {showPwaBanner && (
            <div className="p-3 rounded-2xl bg-[#201f21] border border-[#f2ca50]/40 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <img
                  src="/nabshe-logo.webp"
                  width={32}
                  height={32}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/nabshe-logo.png';
                  }}
                  alt="NABSHÉ Logo"
                  className="w-8 h-8 object-contain p-1 rounded-xl bg-[#131315] border border-[#353437]/50"
                />
                <div className="flex flex-col">
                  <span className="font-sans text-[11.5px] font-bold text-[#e5e1e4]">
                    {isRtl ? 'تطبيق صالون نبشي' : 'NABSHÉ Salon & Spa'}
                  </span>
                  <span className="font-sans text-[10.5px] text-[#d0c5af]">
                    {isRtl ? 'حجز المواعيد واستلام المنتجات في الصالون' : 'Appointments & salon boutique pick-up'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowPwaBanner(false)}
                  className="w-6 h-6 rounded-full text-[#99907c] hover:text-[#e5e1e4] flex items-center justify-center"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 1: Attached Salon Appointment (If combined) */}
          {linkedAppointment && (
            <div className="rounded-2xl border border-[#f2ca50]/50 bg-gradient-to-br from-[#241d0e] via-[#1e1c18] to-[#171719] p-3.5 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse"></span>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#f2ca50]">
                    {isRtl ? 'موعد الصالون المحدد' : 'SCHEDULED APPOINTMENT'}
                  </span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAppointmentIncluded}
                    onChange={(e) => {
                      setIsAppointmentIncluded(e.target.checked);
                      if (e.target.checked) setFulfillmentMethod('pickup');
                    }}
                    className="w-4 h-4 rounded accent-[#f2ca50] cursor-pointer"
                  />
                  <span className="font-sans text-[11px] text-[#e5e1e4] font-medium">
                    {isRtl ? 'دمج مع الطلب' : 'Include in visit'}
                  </span>
                </label>
              </div>

              {isAppointmentIncluded ? (
                <div className="flex items-center justify-between bg-[#151416]/80 p-2.5 rounded-xl border border-[#f2ca50]/20">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-serif text-[13.5px] font-semibold text-[#e5e1e4] truncate">
                      {isRtl ? linkedAppointment.serviceNameAr : linkedAppointment.serviceNameEn}
                    </span>
                    <span className="font-sans text-[11px] text-[#d0c5af] flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">calendar_month</span>
                      {linkedAppointment.dateTimeStr}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-sans text-[13px] font-bold text-[#f2ca50]">
                      AED {linkedAppointment.price}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="font-sans text-[11px] text-[#99907c] italic">
                  {isRtl
                    ? 'تم فصل الموعد، الطلب الحالي يقتصر على المنتجات فقط.'
                    : 'Appointment unlinked. Bag currently contains products only.'}
                </p>
              )}
            </div>
          )}

          {/* Section 2: Bag Items List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#d0c5af]">
                {isRtl ? 'منتجات الجمال المختارة' : 'SELECTED BEAUTY PRODUCTS'}
              </span>
              <span className="font-sans text-[11px] text-[#99907c]">
                {cart.reduce((s, i) => s + i.quantity, 0)} {isRtl ? 'منتج' : 'items'}
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-3 bg-[#201f21] rounded-2xl border border-[#353437]/40">
                <div className="w-12 h-12 rounded-full bg-[#1b1b1d] flex items-center justify-center text-[#99907c]">
                  <span className="material-symbols-outlined text-[26px]">production_quantity_limits</span>
                </div>
                <h3 className="font-serif text-[15px] text-[#e5e1e4]">
                  {isRtl ? 'حقيبتك فارغة حالياً' : 'Your bag is empty'}
                </h3>
                <button
                  type="button"
                  onClick={handleBackNavigation}
                  className="px-4 py-1.5 rounded-xl bg-[#f2ca50] text-[#241a00] font-sans text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {isRtl ? 'arrow_forward' : 'arrow_back'}
                  </span>
                  <span>{backButtonLabel}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cart.map(item => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-xl bg-[#201f21] border border-[#353437]/40 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.titleEn}
                      loading="lazy"
                      decoding="async"
                      width={52}
                      height={52}
                      className="w-13 h-13 rounded-lg object-cover bg-[#131315] border border-[#353437]/50 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-sans text-[13px] font-semibold text-[#e5e1e4] truncate">
                        {isRtl ? item.product.titleAr : item.product.titleEn}
                      </h4>
                      <span className="font-sans text-[11px] text-[#d0c5af] block">
                        {isRtl ? item.product.volumeAr : item.product.volumeEn}
                      </span>
                      <span className="font-sans text-[13px] font-bold text-[#f2ca50] mt-0.5 block">
                        AED {((Math.round(item.product.price * 100) * item.quantity) / 100).toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity Adjustment Controls */}
                    <div className="flex items-center gap-1.5 bg-[#1b1b1d] px-2 py-1 rounded-full border border-[#353437]/40 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-5 h-5 rounded-full text-[#d0c5af] hover:text-[#f2ca50] flex items-center justify-center active:scale-90"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">remove</span>
                      </button>
                      <span className="font-sans text-[11.5px] font-bold text-[#e5e1e4] min-w-[14px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-5 h-5 rounded-full text-[#d0c5af] hover:text-[#f2ca50] flex items-center justify-center active:scale-90"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="w-6 h-6 text-[#99907c] hover:text-[#ff5e5e] flex items-center justify-center transition-colors"
                      type="button"
                      title="Remove item"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Fulfillment Selector: [ PICK UP AT SALON ] vs [ DELIVERY ] */}
          {cart.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#d0c5af]">
                  {isRtl ? 'طريقة الاستلام' : 'Collection / Fulfillment'}
                </label>

                {/* 2 Segments: [ PICK UP AT SALON ] [ DELIVERY ] */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#141416] rounded-xl border border-[#353437]/60">
                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod('pickup')}
                    className={`py-2 px-3 rounded-lg text-[11.5px] font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      fulfillmentMethod === 'pickup' || hasCombined
                        ? 'bg-[#f2ca50] text-[#241a00] shadow-sm'
                        : 'text-[#d0c5af] hover:text-[#e5e1e4]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">storefront</span>
                    <span>{isRtl ? 'استلام من الصالون' : 'PICK UP AT SALON'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!hasCombined) {
                        setFulfillmentMethod('delivery');
                      }
                    }}
                    disabled={hasCombined}
                    className={`py-2 px-3 rounded-lg text-[11.5px] font-sans font-bold flex items-center justify-center gap-1.5 transition-all ${
                      fulfillmentMethod === 'delivery' && !hasCombined
                        ? 'bg-[#f2ca50] text-[#241a00] shadow-sm cursor-pointer'
                        : hasCombined
                        ? 'opacity-40 text-[#666] cursor-not-allowed'
                        : 'text-[#d0c5af] hover:text-[#e5e1e4] cursor-pointer'
                    }`}
                    title={hasCombined ? (isRtl ? 'المنتجات مدمجة مع زيارتك في الصالون' : 'Products are prepared for your salon visit') : ''}
                  >
                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    <span>{isRtl ? 'توصيل بالبريد السريع' : 'DELIVERY'}</span>
                  </button>
                </div>

                {/* Fulfillment Detail Note */}
                {fulfillmentMethod === 'pickup' || hasCombined ? (
                  <div className="p-3 rounded-xl bg-[#201f21] border border-[#353437]/40 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#f2ca50] text-[18px] shrink-0 mt-0.5">location_on</span>
                    <div className="flex flex-col">
                      <span className="font-sans text-[12px] font-semibold text-[#e5e1e4]">
                        {isRtl ? 'صالون نبشي للتجميل والعافية — شارع الوصل، دبي' : 'NABSHÉ Salon & Spa — Al Wasl Road, Dubai'}
                      </span>
                      <span className="font-sans text-[11px] text-[#47ea7a] font-medium mt-0.5">
                        {hasCombined
                          ? (isRtl ? '✓ تجهيز المنتجات لتسليمها خلال موعدك' : '✓ Prepared for collection during your appointment')
                          : (isRtl ? '✓ استلام مجاني من مكتب الاستقبال خلال 30 دقيقة' : '✓ Complimentary collection at reception (Ready in 30 mins)')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-sans text-[11px] text-[#99907c]">
                        {isRtl ? 'اختر منطقة التوصيل في الإمارات' : 'Select Delivery Area across UAE'}
                      </span>
                      <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="w-full bg-[#201f21] border border-[#353437]/50 rounded-xl px-3.5 py-2 text-[12.5px] text-[#e5e1e4] focus:outline-none focus:border-[#f2ca50]"
                      >
                        {areas.map(area => (
                          <option key={area} value={area} className="bg-[#1b1b1d] text-[#e5e1e4]">
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone with Inline Validation */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#d0c5af]">
                  {isRtl ? 'رقم الهاتف للتأكيد والتواصل' : 'Contact Phone for WhatsApp Confirmation'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError(null);
                  }}
                  placeholder="+971 50 919 6975"
                  className={`w-full bg-[#201f21] border rounded-xl px-3.5 py-2 text-[12.5px] text-[#e5e1e4] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50] ${
                    phoneError ? 'border-[#ff5e5e]' : 'border-[#353437]/50'
                  }`}
                />
                {phoneError && (
                  <span className="font-sans text-[11px] text-[#ff5e5e]">
                    {phoneError}
                  </span>
                )}
              </div>

              {/* Payment Notice / Feedback Banner */}
              {paymentNotice && (
                <div className="p-3 rounded-xl bg-[#2a2415] border border-[#f2ca50]/50 flex items-start gap-2.5 text-[11.5px] text-[#ffe699] font-sans">
                  <span className="material-symbols-outlined text-[16px] text-[#f2ca50] shrink-0 mt-0.5">info</span>
                  <div className="flex-1">{paymentNotice}</div>
                  <button
                    type="button"
                    onClick={() => setPaymentNotice(null)}
                    className="text-[#d0c5af] hover:text-[#fff]"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </div>
              )}

              {/* Cost Summary Breakdown - EXACTLY requested order:
                  Service (Appointment)		AED 420
                  Products Subtotal			AED 770
                  VAT (5%)					AED 59.50 (calculated 5% VAT included in Total)
                  Collection				NABSHÉ Al Wasl Salon (Free)
              */}
              <div className="p-3.5 rounded-xl bg-[#201f21] border border-[#353437]/40 space-y-2 text-[12px] font-sans">
                {hasCombined && (
                  <div className="flex justify-between text-[#d0c5af]">
                    <span>{isRtl ? 'الخدمة (الموعد)' : 'Service (Appointment)'}</span>
                    <span className="text-[#e5e1e4] font-medium">AED {servicePrice}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#d0c5af]">
                  <span>{isRtl ? 'المجموع الفرعي للمنتجات' : 'Products Subtotal'}</span>
                  <span>AED {productsSubtotal}</span>
                </div>

                <div className="flex justify-between text-[#d0c5af]">
                  <span>{isRtl ? 'ضريبة القيمة المضافة (5%)' : 'VAT (5%)'}</span>
                  <span className="text-[#e5e1e4] font-medium">AED {vatAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#d0c5af]">
                  <span>{isRtl ? 'الاستلام' : 'Collection'}</span>
                  <span className="text-[#47ea7a] font-medium">
                    {fulfillmentMethod === 'pickup' || hasCombined
                      ? (isRtl ? 'صالون نبشي الوصل (مجاني)' : 'NABSHÉ Al Wasl Salon (Free)')
                      : deliveryFee === 0
                      ? (isRtl ? 'مجاني' : 'Complimentary')
                      : `AED ${deliveryFee}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#353437]/40 flex justify-between items-baseline font-bold">
                  <span className="text-[#e5e1e4] text-[13px]">
                    {hasCombined
                      ? (isRtl ? 'الإجمالي (الخدمة + المنتجات)' : 'Total (Service + Products)')
                      : (isRtl ? 'الإجمالي' : 'Total')}
                  </span>
                  <span className="text-[#f2ca50] text-[17px]">
                    AED {total.toFixed(2)}
                  </span>
                </div>

                <div className="text-[11px] text-[#47ea7a] flex items-center justify-between pt-1">
                  <span>{isRtl ? 'أقساط تابي:' : 'Tabby split:'}</span>
                  <span className="font-semibold">4x AED {(total / 4).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        {cart.length > 0 && (
          <div className="p-3.5 sm:p-4 border-t border-[#353437]/50 bg-[#171719] shrink-0">
            {/* Subtotal header line */}
            <div className="flex justify-between items-baseline mb-2.5 px-1">
              <span className="font-sans text-[12px] text-[#99907c] font-medium">
                {hasCombined
                  ? (isRtl ? 'الإجمالي (الخدمة + المنتجات)' : 'Total (Service + Products)')
                  : (isRtl ? 'الإجمالي' : 'Total')}
              </span>
              <span className="font-serif text-[17px] sm:text-[19px] font-bold text-[#f2ca50]">
                AED {total.toFixed(2)}
              </span>
            </div>

            {/* ACTION BUTTONS LOGIC:
                1. If Combined (Services + Products):
                   - [ CONFIRM VIA WHATSAPP ]
                   - Ziina & Telr are NOT shown / inactive for appointment combos
                2. If Products Only:
                   - [ ORDER VIA WHATSAPP ]
                   - [ PAY WITH ZIINA ]  [ PAY WITH TELR ]  (both active)
            */}
            {hasCombined ? (
              // CASE 1: Combined Services + Products
              <div className="space-y-2 mb-2">
                <button
                  onClick={handleValidateAndSubmit}
                  disabled={isSubmitting}
                  className="w-full h-10 sm:h-10.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#073819] font-sans text-[12px] sm:text-[13px] font-bold tracking-wider flex items-center justify-center gap-2 shadow-[0_3px_12px_rgba(37,211,102,0.25)] active:scale-[0.99] transition-all cursor-pointer"
                  type="button"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[17px] animate-spin">progress_activity</span>
                      <span>{isRtl ? 'جاري التحويل للواتساب...' : 'CONNECTING TO WHATSAPP...'}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4.5 h-4.5 fill-[#073819] shrink-0" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>{isRtl ? 'تأكيد عبر الواتساب' : 'CONFIRM VIA WHATSAPP'}</span>
                    </>
                  )}
                </button>
                <p className="font-sans text-[10.5px] text-[#99907c] text-center">
                  {isRtl
                    ? 'يتم تأكيد الموعد ومستحضرات الزيارة مباشرة عبر الواتساب وتسويتها أثناء الزيارة.'
                    : 'Appointments and visit products are confirmed via WhatsApp and settled at your visit.'}
                </p>
              </div>
            ) : (
              // CASE 2: Products Only in Bag -> 3 Active Buttons: [ORDER VIA WHATSAPP], [PAY WITH ZIINA], [PAY WITH TELR]
              <div className="space-y-2 mb-2">
                {/* 1. Primary Action: Order via WhatsApp */}
                <button
                  onClick={handleValidateAndSubmit}
                  disabled={isSubmitting}
                  className="w-full h-10 sm:h-10.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#073819] font-sans text-[12px] sm:text-[13px] font-bold tracking-wider flex items-center justify-center gap-2 shadow-[0_3px_12px_rgba(37,211,102,0.22)] active:scale-[0.99] transition-all cursor-pointer"
                  type="button"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[17px] animate-spin">progress_activity</span>
                      <span>{isRtl ? 'جاري التحويل للواتساب...' : 'CONNECTING TO WHATSAPP...'}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4.5 h-4.5 fill-[#073819] shrink-0" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>{isRtl ? 'الطلب عبر الواتساب' : 'ORDER VIA WHATSAPP'}</span>
                    </>
                  )}
                </button>

                {/* 2. Side-by-Side: [PAY WITH ZIINA] and [PAY WITH TELR] (Both Active) */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleGatewayClick('Ziina')}
                    className="h-9 sm:h-9.5 rounded-xl bg-[#0d2249] hover:bg-[#123068] text-[#9bb7e5] hover:text-[#fff] border border-[#214382]/60 font-sans text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">credit_card</span>
                    <span>{isRtl ? 'الدفع عبر زينة' : 'PAY WITH ZIINA'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGatewayClick('Telr')}
                    className="h-9 sm:h-9.5 rounded-xl bg-[#0b4d37] hover:bg-[#0f684a] text-[#8dd4b6] hover:text-[#fff] border border-[#1b7a59]/60 font-sans text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">lock</span>
                    <span>{isRtl ? 'الدفع عبر تلر' : 'PAY WITH TELR'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tabby 4 Payments Installment Card */}
            <div className="rounded-xl border border-[#353437]/60 bg-[#201f21] px-3 py-1.5 flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="bg-[#00FFC2] text-[#063b2c] font-black text-[10px] px-1.5 py-0.5 rounded font-sans tracking-tight shrink-0">
                  tabby
                </span>
                <span className="font-sans text-[11.5px] text-[#e5e1e4] truncate font-medium">
                  {isRtl
                    ? `4 دفعات بقيمة AED ${(total / 4).toFixed(2)} — بدون فوائد`
                    : `4 payments of AED ${(total / 4).toFixed(2)} — 0% interest`}
                </span>
              </div>
              <span className="text-[#99907c] text-[10.5px] shrink-0 font-sans">
                {isRtl ? 'بدون رسوم' : 'Split in 4'}
              </span>
            </div>

            {/* Contextual Navigation Button */}
            <button
              type="button"
              onClick={handleBackNavigation}
              className="w-full h-8.5 rounded-xl border border-[#353437] hover:border-[#f2ca50]/50 bg-transparent hover:bg-[#201f21] text-[#d0c5af] hover:text-[#e5e1e4] font-sans text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">
                {isRtl ? 'arrow_forward' : 'arrow_back'}
              </span>
              <span>{backButtonLabel}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
