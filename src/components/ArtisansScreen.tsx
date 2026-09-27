import React from 'react';
import { Language, ScreenType, Treatment } from '../types';
import { TREATMENTS } from '../data/mockData';

interface ArtisansScreenProps {
  language: Language;
  onNavigate: (screen: ScreenType) => void;
  onSelectSpecialistToBook: (specialistName: string, treatment: Treatment) => void;
}

export const ArtisansScreen: React.FC<ArtisansScreenProps> = ({
  language,
  onNavigate,
  onSelectSpecialistToBook,
}) => {
  const isRtl = language === 'ar';

  const specialists = [
    {
      nameEn: 'Sarah Al-Hassan',
      nameAr: 'سارة الحسن',
      roleEn: 'Lead Aesthetician & Skincare Specialist',
      roleAr: 'كبيرة خبيرات العناية بالبشرة',
      experienceEn: '12 Years Experience · Paris Certified',
      experienceAr: '12 عاماً من الخبرة · شهادة معتمدة من باريس',
      specialtyEn: 'Facial treatments and cellular hydration therapy',
      specialtyAr: 'جلسات العناية بالوجه والترطيب العميق',
      bioEn: 'Extensive dermatology and aesthetic training in Paris and premier clinics in Dubai.',
      bioAr: 'تدريب متقدم في العناية بالبشرة وتقنيات النضارة في باريس وأبرز مراكز دبي.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBZDwYEDZ_lYkEaYquFX8Mr59XuZZ-BQetk4ssD6ccBzbMnn9n0lqHGiIdAaqbM-Of-qinCd6sjXXHi_gLRQRQQCrMg1JRki5SbCNQl12C7HjrKE0K-MjuR1XayBpxuua0SWyfvO-mJGNSdpdLOUBuisIwhDKnjatsJFoORMFa9TEYv7jKLA0jPENLXmIsnkOq0-NGQktetGOtxtjQoHxXFfzCd0yX8LVw6x427AoURsFCOvGDCLKz2',
      matchedTreatment: TREATMENTS.find(t => t.id === 'facial-24k-gold') || TREATMENTS[0],
    },
    {
      nameEn: 'Layla Mansour',
      nameAr: 'ليلى منصور',
      roleEn: 'Senior Hair Stylist & Colorist',
      roleAr: 'أخصائية أولى في تصفيف وصبغ الشعر',
      experienceEn: '10 Years Experience · London Academy',
      experienceAr: '10 أعوام من الخبرة · أكاديمية لندن',
      specialtyEn: 'Precision styling, peptide smoothing, and color techniques',
      specialtyAr: 'قص وتصفيف دقيق وعلاجات البروتين وتلوين الشعر',
      bioEn: 'Specializes in Japanese silk treatments, restorative conditioning, and contemporary balayage.',
      bioAr: 'متخصصة في علاجات الحرير والبروتين واستعادة صحة الشعر وصبغات البالاياتش الحديثة.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAQufVJwV7JGRKs7KQPrJwz6BZeJpVOeKJRYm4wlsvk7XktlxBC2C7peS-xpFjSqJNahywjq0vDXteIRj6LuaIBiWwHIGXsCyS13qs0R2qbvRNYg0vO5mc3qkub_JBay15FbUnM70le7buAWGWTcrn0_yZ_-C3DxmpPwxIBFUM1U58UF7BXzG1bPKDJn-rJChIhEbqAUhb2eBLGMHhxdPk7_xycRiQVVP8fOugOKAv4X0hrMxmvsaiM',
      matchedTreatment: TREATMENTS.find(t => t.id === 'hair-caviar-peptide') || TREATMENTS[1],
    },
    {
      nameEn: 'Amina Belkacem',
      nameAr: 'أمينة بلقاسم',
      roleEn: 'Senior Hammam Specialist',
      roleAr: 'أخصائية أولى في الحمام المغربي التقليدي',
      experienceEn: '15 Years Experience · Fez Heritage',
      experienceAr: '15 عاماً من الخبرة · فاس المغربية',
      specialtyEn: 'Authentic Moroccan bath, eucalyptus beldi, and exfoliating therapies',
      specialtyAr: 'الحمام المغربي الأصيل، صابون اليوكالبتوس، والتقشير العميق',
      bioEn: 'Trained in traditional Moroccan bath therapies utilizing pure organic olive soap and certified herbal extracts.',
      bioAr: 'خبرة عريقة في جلسات الحمام المغربي والتقشير بالأعشاب الطبيعية والزيوت العضوية.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Mj4j3cseMegjNMtAIA5Zb3OUFrCiKPWugI6Fi6toSMwsaHPS92yFneorLziCHTW5PyTzcae0UJr6apnrau0AjRP7H8JaHjLjYoxaCsvduwFi8HKfKaP5_dfpwUavMHMimg_ByiAwR1IYeoTjNXMHFaCUUz4QGrquoWo_LdcPOevUCzgj9dm8dEUhWSDo4kFd2TUjaoVt7WjsfVtoOLoXaO-PtWAs1rdRqPj8-etfa2SMWk8EyWfE',
      matchedTreatment: TREATMENTS.find(t => t.id === 'hammam-imperial-oud') || TREATMENTS[2],
    },
    {
      nameEn: 'Maria Santos',
      nameAr: 'ماريا سانتوس',
      roleEn: 'Nail Care & Reflexology Specialist',
      roleAr: 'أخصائية العناية بالأظافر والمساج الانعكاسي',
      experienceEn: '9 Years Experience · Milan Certified',
      experienceAr: '9 أعوام من الخبرة · معتمدة من ميلانو',
      specialtyEn: 'Manicure, pedicure, and reflexology hand and foot massage',
      specialtyAr: 'العناية باليدين والقدمين وتدليك نقاط الضغط المريح',
      bioEn: 'Certified nail technician and reflexologist focusing on natural nail wellness and therapeutic relaxation.',
      bioAr: 'أخصائية معتمدة في صحة الأظافر والباديكير والتدليك الانعكاسي لليدين والقدمين.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAY1JPArjEgjYHn4degqwH6VMS84e3RONxgpjoaOxXvxqeQESEJEJ6OhhM-MGtyyU70zYf76dvwZYJZfaUxRXkRkEfirzZaKZhyOeFQXIQzWrguWHQlXp_4WCTAlgrHksAxcNR0gp4hoYP5caTe9blI5CVQdJkJmcAmQcSPJx4HQ0VIa9Wi7BMWaGGCzK1zSXLWuVOFZEFs7w_hI48J9l5coNH2wZAc52uYtXSriCiIHkY7dchBYPXO',
      matchedTreatment: TREATMENTS.find(t => t.id === 'nails-gold-pedicure' || t.id === 'nails-russian-biab') || TREATMENTS[3],
    },
    {
      nameEn: 'Nour Al-Sabah',
      nameAr: 'نور الصباح',
      roleEn: 'Master Massage & Holistic Body Therapist',
      roleAr: 'أخصائية أولى في المساج والعلاج الطبيعي للجسم',
      experienceEn: '11 Years Experience · Swiss Wellness Institute',
      experienceAr: '11 عاماً من الخبرة · معهد العافية السويسري',
      specialtyEn: 'Deep tissue, lymphatic drainage, and warm basalt stone therapy',
      specialtyAr: 'التدليك العميق، التصريف اللمفاوي، وعلاج الأحجار البركانية',
      bioEn: 'Specializes in therapeutic muscle tension release, posture restoration, and detoxifying aromatherapy rituals.',
      bioAr: 'متخصصة في تخفيف الإجهاد العضلي، استعادة الحيوية، وجلسات العلاج بالزيوت العطرية العضوية.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDSFYMFvnZR-91IsQ9bw9Pc5f1UNBam5kedU-jBWMFKMOUhO6MykqydYhdx5NOcdzNxeE2IOdo9MmhwH5RvGbtLuwYcRdbZXPLZcpn_ZTtPVNmGFSqMuKhY25XkB0shVlHIQrjns3hIO1ktsO7xUJJVc2hwDkdZ9NyTtxA1AHtF5pFCLDMxjfseNFEigPdquEx1hQbqtXMTNvNLG5-rOSIprZ23-ZVXflkSHik6Di_4mBBCW6brUWcU',
      matchedTreatment: TREATMENTS.find(t => t.id === 'massage-hot-stone' || t.category === 'massage') || TREATMENTS[2],
    },
    {
      nameEn: 'Elena Rostova',
      nameAr: 'إيلينا روستوفا',
      roleEn: 'Cellular Aesthetician & Brow Architect',
      roleAr: 'خبيرة العناية الخلوية وتصميم الحواجب والرموش',
      experienceEn: '8 Years Experience · Beverly Hills Certified',
      experienceAr: '8 أعوام من الخبرة · معتمدة من بيفرلي هيلز',
      specialtyEn: 'Micro-current contouring, lash cashmere lifting, and collagen boosters',
      specialtyAr: 'شد الملامح الدقيق، رفع رموش الكشمير، وتنشيط الكولاجين الطبيعي',
      bioEn: 'Expert in non-invasive skin lifting, cellular contouring, and customized high-definition brow shaping.',
      bioAr: 'خبيرة متمرسة في شد وتحديد ملامح الوجه وتكثيف الرموش وتصميم الحواجب الهندسي الطبيعي.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUbgVFb8oN-xrWrebbCYImw6s-yWitfFPUrhH1TyDLGpcy3Oc-lqnMv1NBVe9mijN_soBL0dswbVZsUT7FnYeFJy5lPIJU4DsABmkHSNEaQISKjBRIOX-fM_vqBcLVqVrJUFKWwTKZqxwo6if3T886xO6j24WwC6j0XvzJGNLbk13QPrAnUR7Sg-9VGTkYomDufVVmdZ7uhy2cYp_6h_IPAsfop67JwpnRlqZO8vuZWgfQ74mIe_Aa',
      matchedTreatment: TREATMENTS.find(t => t.id === 'facial-cellular-lift' || t.id === 'facial-24k-gold') || TREATMENTS[0],
    },
  ];

  return (
    <div className={`flex flex-col w-full max-w-7xl mx-auto pb-32 pt-2 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
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
          {isRtl ? 'الأخصائيات' : 'Our Team'}
        </span>
      </div>

      {/* Screen Title */}
      <section className="pt-1 pb-3 flex flex-col gap-1">
        <div className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]"></span>
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#f2ca50]">
            {isRtl ? 'فريق العمل المعتمد' : 'Certified Professionals'}
          </span>
        </div>
        <h1 className="font-serif text-[26px] sm:text-[30px] md:text-[36px] text-[#e5e1e4] font-semibold tracking-tight">
          {isRtl ? 'أخصائيات نابشيه' : 'Our Specialists'}
        </h1>
        <p className="font-sans text-[13px] md:text-[14px] text-[#d0c5af] leading-relaxed max-w-2xl">
          {isRtl
            ? 'فريق من أخصائيات التجميل والعناية المعتمدات لتنفيذ خدماتك بأعلى معايير الجودة والراحة.'
            : 'Accredited therapists and hair stylists dedicated to attentive, professional salon service.'}
        </p>
      </section>

      {/* Specialists Cards Grid - 3x2 on desktop, 2-col on tablet, 1-col on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 my-3">
        {specialists.map((specialist, idx) => (
          <article
            key={idx}
            className="reveal-on-scroll p-4 sm:p-5 rounded-2xl bg-[#1b1b1d] border border-[#353437]/50 shadow-md flex flex-col justify-between gap-3 luxury-card-hover group cursor-pointer"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <img
                  src={specialist.imageUrl}
                  alt={specialist.nameEn}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#f2ca50]/60 shadow-md shrink-0 bg-[#201f21]"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-[17px] text-[#e5e1e4] font-semibold truncate">
                    {isRtl ? specialist.nameAr : specialist.nameEn}
                  </h3>

                  <span className="font-sans text-[12px] text-[#f2ca50] font-medium block">
                    {isRtl ? specialist.roleAr : specialist.roleEn}
                  </span>

                  <span className="font-sans text-[11px] text-[#99907c] block mt-0.5">
                    {isRtl ? specialist.experienceAr : specialist.experienceEn}
                  </span>
                </div>
              </div>

              <p className="font-sans text-[12px] text-[#d0c5af] leading-relaxed mt-3">
                {isRtl ? specialist.bioAr : specialist.bioEn}
              </p>

              <div className="mt-2.5 p-2 rounded-xl bg-[#201f21] border border-[#353437]/30 text-[11px] font-sans text-[#d0c5af]">
                <span className="text-[#f2ca50] font-semibold">{isRtl ? 'التخصص: ' : 'Specialty: '}</span>
                <span>{isRtl ? specialist.specialtyAr : specialist.specialtyEn}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#353437]/40 flex items-center justify-between">
              <span className="font-sans text-[11px] text-[#99907c]">
                {isRtl ? 'متاحة للحجز في الصالون' : 'Available for booking'}
              </span>

              <button
                onClick={() => onSelectSpecialistToBook(specialist.nameEn, specialist.matchedTreatment)}
                className="px-4 py-2 rounded-full bg-[#f2ca50] hover:bg-[#ffe088] text-[#241a00] font-sans text-[11px] font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1"
                type="button"
              >
                <span>{isRtl ? `احجزي مع ${specialist.nameAr.split(' ')[0]}` : `Book with ${specialist.nameEn.split(' ')[0]}`}</span>
                <span className="material-symbols-outlined text-[15px]">
                  {isRtl ? 'arrow_back' : 'arrow_forward'}
                </span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
