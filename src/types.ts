export type Language = 'en' | 'ar';

export type ScreenType = 
  | 'home'                // S01: Home Screen
  | 'services'            // S02: Services / Treatments
  | 'treatment-detail'    // S03: Service Detail
  | 'packages'            // S04: Packages
  | 'booking'             // S05-S08: Booking Flow (Date & Time, Specialist, Add-ons, Guest Info)
  | 'request-received'    // S09: Request Received Confirmation
  | 'shop'                // S10: Shop / Boutique Catalog
  | 'product-detail'      // S11: Product Detail
  | 'bag'                 // S12: Bag Screen / Sheet ("Bag", never "Cart")
  | 'checkout'            // S13: Delivery & Checkout Details
  | 'order-confirmation'  // S14: Order Received Confirmation
  | 'requests'            // S15: My Requests & Activity
  | 'search'              // S16: Dual-State Search
  | 'profile'             // S17: Guest Profile
  | 'saved'               // Wishlist: Saved treatments & boutique products
  | 'vip'
  | 'story'
  | 'artisans'
  | 'diagnostic';

export interface Treatment {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  duration: number; // in minutes
  price: number; // in AED (Price, never Investment)
  category: 'facials' | 'hair' | 'hammam' | 'nails' | 'massage';
  imageUrl: string;
  descriptionEn: string;
  descriptionAr: string;
  applicationEn: string;
  applicationAr: string;
  suiteEn: string;
  suiteAr: string;
  steps: {
    number: string;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
  }[];
  recommendedProducts: {
    id: string;
    nameEn: string;
    nameAr: string;
    specEn: string;
    specAr: string;
    price: number;
    imageUrl: string;
  }[];
}

export interface ServicePackage {
  id: string;
  titleEn: string;
  titleAr: string;
  tagEn: string;
  tagAr: string;
  duration: number; // in minutes
  price: number;
  originalPrice?: number;
  savings?: number;
  tabbySplit: number;
  descriptionEn: string;
  descriptionAr: string;
  inclusions: {
    titleEn: string;
    titleAr: string;
    duration: string;
    icon: string;
  }[];
  imageUrl: string;
  specialNoteEn?: string;
  specialNoteAr?: string;
}

// Backwards compatibility alias
export type CuratedPackage = ServicePackage;

export interface BoutiqueProduct {
  id: string;
  titleEn: string;
  titleAr: string;
  volumeEn: string;
  volumeAr: string;
  tagEn?: string;
  tagAr?: string;
  price: number;
  tabbyInstallment: number;
  inStock: boolean;
  category: 'serums' | 'hair' | 'fragrance' | 'tools' | 'body';
  imageUrl: string;
  descriptionEn: string;
  descriptionAr: string;
  ingredientsEn?: string;
  ingredientsAr?: string;
  usageEn?: string;
  usageAr?: string;
}

export interface BagItem {
  product: BoutiqueProduct;
  quantity: number;
}

// Backwards compatibility alias
export type CartItem = BagItem;

export interface UserProfile {
  name: string;
  phone: string;
  area: string;
  address?: string;
  preferredLanguage: Language;
  loyaltyNumber: string;
  whatsappConsent: boolean;
}

export interface AppointmentRequest {
  id: string;
  refNumber: string;
  treatmentTitleEn: string;
  treatmentTitleAr: string;
  treatmentImage: string;
  dateStr: string;
  timeStr: string;
  specialist: string;
  duration: number;
  price: number;
  statusEn: 'Sent, awaiting confirmation';
  statusAr: 'تم الإرسال، بانتظار التأكيد';
  clientName: string;
  clientPhone: string;
  addOns?: string[];
  totalPrice: number;
}

export interface BoutiqueOrder {
  id: string;
  orderNumber: string;
  itemsCount: number;
  totalPrice: number;
  statusEn: 'Sent, awaiting confirmation';
  statusAr: 'تم الإرسال، بانتظار التأكيد';
  packagingEn: string;
  packagingAr: string;
  deliveryArea?: string;
  deliveryAddress?: string;
  items: {
    titleEn: string;
    titleAr: string;
    volume: string;
    qty: number;
    price: number;
    imageUrl: string;
  }[];
}
