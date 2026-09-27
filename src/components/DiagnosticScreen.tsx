import React, { useState } from 'react';
import { Language, ScreenType, Treatment } from '../types';
import { TREATMENTS } from '../data/mockData';

interface DiagnosticScreenProps {
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  onSelectTreatmentToBook: (treatment: Treatment) => void;
}

export const DiagnosticScreen: React.FC<DiagnosticScreenProps> = ({
  language,
  onNavigate,
  onSelectTreatmentToBook,
}) => {
  const isRtl = language === 'ar';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedGoal, setSelectedGoal] = useState<string>('radiance');
  const [selectedCondition, setSelectedCondition] = useState<string>('dehydrated');
  const [selectedDuration, setSelectedDuration] = useState<string>('90');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const goals = [
    {
      id: 'radiance',
      titleEn: 'Cellular Radiance & Hydration',
      titleAr: 'نضارة البشرة والترطيب العميق',
      descEn: 'Collagen boost, fine-line softening, and deep dermal hydration.',
      descAr: 'تحفيز الكولاجين، تنعيم الخطوط، وترطيب عميق لأنسجة البشرة.',
      icon: 'auto_awesome',
    },
    {
      id: 'hammam',
      titleEn: 'Deep Cleansing & Relaxation',
      titleAr: 'تنظيف عميق واسترخاء تام',
      descEn: 'Steam exfoliation, eucalyptus beldi massage, and full body reset.',
      descAr: 'تقشير بالبخار، تدليك بالصابون المغربي الأسود، واسترخاء للجسم بالكامل.',
      icon: 'hot_tub',
    },
    {
      id: 'hair',
      titleEn: 'Hair Smoothing & Scalp Health',
      titleAr: 'تنعيم الشعر وصحة فروة الرأس',
      descEn: 'Deep lipid restoration, frizz reduction, and healthy shine.',
      descAr: 'ترميم ألياف الشعر، علاج التقصف والنفشة، ولمعان صحي طبيعي.',
      icon: 'content_cut',
    },
    {
      id: 'couture',
      titleEn: 'Hand & Foot Pampering',
      titleAr: 'عناية فائقة باليدين والقدمين',
      descEn: 'Reflexology massage, gold leaf care, and nail cuticle grooming.',
      descAr: 'تدليك مريح، عناية بالذهب، وتجديد ونظافة كاملة للأظافر.',
      icon: 'pan_tool',
    },
    {
      id: 'massage',
      titleEn: 'Muscular Tension & Deep Relief',
      titleAr: 'تخفيف التوتر العضلي والاسترخاء العميق',
      descEn: 'Magnesium therapy, volcanic hot stone glides, and therapeutic release.',
      descAr: 'علاج بالمغنيسيوم، حجارة بركانية دافئة، وإرخاء عميق لتشنجات العضلات.',
      icon: 'spa',
    },
  ];

  const conditions = [
    {
      id: 'dehydrated',
      labelEn: 'Dehydrated or Sun-Fatigued',
      labelAr: 'بشرة جافة أو مجهدة من الطقس الحار',
    },
    {
      id: 'sensitive',
      labelEn: 'Sensitive & Easily Reddened',
      labelAr: 'حساسة وسريعة الاحمرار',
    },
    {
      id: 'stress',
      labelEn: 'Tense Muscles & Fatigue',
      labelAr: 'شد عضلي وإرهاق عام',
    },
    {
      id: 'balanced',
      labelEn: 'Balanced / Seeking Special Occasion Glow',
      labelAr: 'متوازنة / تبحث عن تألق وإشراقة مناسبة خاصة',
    },
  ];

  const durations = [
    { id: '60', labelEn: 'Express (60 min)', labelAr: 'سريعة (60 دقيقة)' },
    { id: '90', labelEn: 'Standard (90 min)', labelAr: 'قياسية متكاملة (90 دقيقة)' },
    { id: '120', labelEn: 'Extended Session (120+ min)', labelAr: 'جلسة ممتدة (120+ دقيقة)' },
  ];

  // Derive recommended treatment
  const getRecommendation = (): Treatment => {
    if (selectedGoal === 'hammam') {
      return TREATMENTS.find(t => t.category === 'hammam') || TREATMENTS[0];
    }
    if (selectedGoal === 'hair') {
      return TREATMENTS.find(t => t.category === 'hair') || TREATMENTS[0];
    }
    if (selectedGoal === 'couture') {
      return TREATMENTS.find(t => t.category === 'nails') || TREATMENTS[0];
    }
    if (selectedGoal === 'massage') {
      return TREATMENTS.find(t => t.category === 'massage') || TREATMENTS[0];
    }
    return TREATMENTS.find(t => t.category === 'facials') || TREATMENTS[0];
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCalculated(true);
    }
  };

  const recommendedTreatment = getRecommendation();

  return (
    <div className={`flex flex-col w-full max-w-5xl mx-auto pb-32 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between py-2 border-b border-[#353437]/40 mb-3">
        <button
          onClick={() => {
            if (isCalculated) {
              setIsCalculated(false);
              setCurrentStep(3);
            } else if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
            } else {
              onNavigate('services');
            }
          }}
          className="flex items-center gap-1.5 text-[#d0c5af] hover:text-[#f2ca50] text-[12px] font-sans font-semibold transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isRtl ? 'arrow_forward' : 'arrow_back'}
          </span>
          <span>{isRtl ? 'السابق' : 'Back'}</span>
        </button>
        <span className="font-sans text-[11px] text-[#f2ca50] uppercase tracking-wider font-bold">
          {isRtl ? 'استشارة الخدمة' : 'Service Consultation'}
        </span>
      </div>

      {!isCalculated ? (
        <>
          {/* Step Counter */}
          <div className="flex items-center justify-between my-2">
            <span className="font-sans text-[11px] text-[#99907c] uppercase tracking-widest font-bold">
              {isRtl ? `الخطوة ${currentStep} من 3` : `Step ${currentStep} of 3`}
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((step) => (
                <span
                  key={step}
                  className={`w-7 h-1 rounded-full transition-all ${
                    step <= currentStep ? 'bg-[#f2ca50]' : 'bg-[#353437]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Goal */}
          {currentStep === 1 && (
            <div className="space-y-4 my-2">
              <div className="flex flex-col gap-1">
                <h2 className="font-serif text-[22px] md:text-[28px] text-[#e5e1e4] font-semibold">
                  {isRtl ? 'ما هو هدفك الأساسي من الزيارة؟' : 'What is your primary beauty focus?'}
                </h2>
                <p className="font-sans text-[12px] md:text-[14px] text-[#d0c5af]">
                  {isRtl
                    ? 'اختاري النتيجة التي تطمحين إليها لاقتراح الخدمة الأنسب.'
                    : 'Select your desired outcome to match the most suitable service.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      selectedGoal === g.id
                        ? 'bg-[#2a2a2c] border-[#f2ca50] shadow-md ring-1 ring-[#f2ca50]/40'
                        : 'bg-[#1b1b1d] border-[#353437]/50 hover:border-[#f2ca50]/30'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedGoal === g.id
                          ? 'bg-[#f2ca50] text-[#241a00]'
                          : 'bg-[#201f21] text-[#f2ca50]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{g.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-[15px] font-semibold text-[#e5e1e4]">
                        {isRtl ? g.titleAr : g.titleEn}
                      </h3>
                      <p className="font-sans text-[12px] text-[#d0c5af] mt-1 leading-relaxed">
                        {isRtl ? g.descAr : g.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Skin/Condition */}
          {currentStep === 2 && (
            <div className="space-y-4 my-2">
              <div className="flex flex-col gap-1">
                <h2 className="font-serif text-[22px] md:text-[28px] text-[#e5e1e4] font-semibold">
                  {isRtl ? 'كيف تصفين حالة بشرتك أو جسمك اليوم؟' : 'How does your skin or body feel today?'}
                </h2>
                <p className="font-sans text-[12px] md:text-[14px] text-[#d0c5af]">
                  {isRtl
                    ? 'يساعدنا هذا في اختيار المنتجات اللطيفة ودرجة الحرارة المناسبة.'
                    : 'This allows us to select suitable oils and comfortable massage pressure.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {conditions.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCondition(c.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedCondition === c.id
                        ? 'bg-[#2a2a2c] border-[#f2ca50] shadow-md ring-1 ring-[#f2ca50]/40'
                        : 'bg-[#1b1b1d] border-[#353437]/50 hover:border-[#f2ca50]/30'
                    }`}
                  >
                    <span className="font-sans text-[13px] font-semibold text-[#e5e1e4]">
                      {isRtl ? c.labelAr : c.labelEn}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedCondition === c.id
                          ? 'border-[#f2ca50] bg-[#f2ca50]'
                          : 'border-[#4d4635]'
                      }`}
                    >
                      {selectedCondition === c.id && (
                        <span className="w-2 h-2 rounded-full bg-[#241a00]"></span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Duration */}
          {currentStep === 3 && (
            <div className="space-y-4 my-2">
              <div className="flex flex-col gap-1">
                <h2 className="font-serif text-[22px] md:text-[28px] text-[#e5e1e4] font-semibold">
                  {isRtl ? 'كم من الوقت تفضلين تخصيصه لجلستك؟' : 'How much time do you prefer to spend?'}
                </h2>
                <p className="font-sans text-[12px] md:text-[14px] text-[#d0c5af]">
                  {isRtl
                    ? 'جميع الخيارات تشمل مشروب ترحيبي وفترة راحة هادئة.'
                    : 'All sessions include a welcoming herbal drink and unhurried rest.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {durations.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDuration(d.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedDuration === d.id
                        ? 'bg-[#2a2a2c] border-[#f2ca50] shadow-md ring-1 ring-[#f2ca50]/40'
                        : 'bg-[#1b1b1d] border-[#353437]/50 hover:border-[#f2ca50]/30'
                    }`}
                  >
                    <span className="font-sans text-[13px] font-semibold text-[#e5e1e4]">
                      {isRtl ? d.labelAr : d.labelEn}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedDuration === d.id
                          ? 'border-[#f2ca50] bg-[#f2ca50]'
                          : 'border-[#4d4635]'
                      }`}
                    >
                      {selectedDuration === d.id && (
                        <span className="w-2 h-2 rounded-full bg-[#241a00]"></span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="mt-6">
            <button
              onClick={handleNext}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              type="button"
            >
              <span>{currentStep === 3 ? (isRtl ? 'عرض النتيجة والتوصية' : 'View Recommended Service') : (isRtl ? 'المتابعة' : 'Next Step')}</span>
              <span className="material-symbols-outlined text-[18px]">
                {isRtl ? 'arrow_back' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </>
      ) : (
        /* Result Screen */
        <div className="space-y-4 my-2 animate-in fade-in zoom-in-95 duration-300">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#2a2a2c] via-[#201f21] to-[#1b1b1d] border border-[#f2ca50]/50 shadow-xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">recommend</span>
              <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]">
                {isRtl ? 'الخدمة المقترحة لك' : 'Your Recommended Service'}
              </span>
            </div>

            <div className="w-full h-48 md:h-56 rounded-xl overflow-hidden relative border border-[#353437]/60">
              <img
                src={recommendedTreatment.imageUrl}
                alt={recommendedTreatment.titleEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-transparent to-transparent"></div>
              <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[#e5e1e4]">
                <div>
                  <span className="font-sans text-[11px] text-[#f2ca50] font-semibold block">
                    {recommendedTreatment.duration} {isRtl ? 'دقيقة' : 'min'}
                  </span>
                  <h3 className="font-serif text-[18px] md:text-[20px] font-semibold">
                    {isRtl ? recommendedTreatment.titleAr : recommendedTreatment.titleEn}
                  </h3>
                </div>
                <span className="font-sans text-[18px] md:text-[20px] font-bold text-[#f2ca50]">
                  AED {recommendedTreatment.price}
                </span>
              </div>
            </div>

            <p className="font-sans text-[12px] md:text-[13px] text-[#d0c5af] leading-relaxed">
              {isRtl ? recommendedTreatment.descriptionAr : recommendedTreatment.descriptionEn}
            </p>

            <div className="p-3 rounded-xl bg-[#131315]/80 border border-[#353437]/50 text-[11px] font-sans text-[#f2ca50] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>
                {isRtl
                  ? 'تم اختيار هذه الخدمة لتلائم هدفك المفضل ومستوى الترطيب المطلوب.'
                  : 'Selected based on your personal preference and chosen time duration.'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 mt-4">
            <button
              onClick={() => onSelectTreatmentToBook(recommendedTreatment)}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#ffe088] text-[#241a00] font-sans text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>{isRtl ? 'حجز هذه الخدمة الآن' : 'Book Recommended Service'}</span>
            </button>

            <a
              href="https://wa.me/971509196975?text=Hello%20NABSH%C3%89,%20I%20completed%20the%20beauty%20consultation%20and%20got%20matched%20with%20this%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#47ea7a] font-sans text-[12px] font-semibold border border-[#353437]/50 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>{isRtl ? 'التواصل عبر واتساب للاستفسار' : 'Inquire on WhatsApp'}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
