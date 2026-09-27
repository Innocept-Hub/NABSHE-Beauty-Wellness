import { Treatment } from '../types';
import { FACIAL_TREATMENTS } from './treatments/facials';
import { HAIR_TREATMENTS } from './treatments/hair';
import { HAMMAM_TREATMENTS } from './treatments/hammam';
import { NAIL_TREATMENTS } from './treatments/nails';
import { MASSAGE_TREATMENTS } from './treatments/massage';

export {
  FACIAL_TREATMENTS,
  HAIR_TREATMENTS,
  HAMMAM_TREATMENTS,
  NAIL_TREATMENTS,
  MASSAGE_TREATMENTS,
};

// Complete 60-Service Taxonomy for NABSHÉ Beauty & Wellness
// 12 Facials & Skincare + 12 Hair Care & Couture + 12 Hammam & Body Rituals + 12 Nails & Pedicure + 12 Massage & Body Therapies = 60 Total Services
export const ALL_TREATMENTS: Treatment[] = [
  ...FACIAL_TREATMENTS,
  ...HAIR_TREATMENTS,
  ...HAMMAM_TREATMENTS,
  ...NAIL_TREATMENTS,
  ...MASSAGE_TREATMENTS,
];
