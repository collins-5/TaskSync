import { IconNames } from '~/components/ui/icon';

import {
  bookingActionSheetProps,
  explicitBackAndCloseActionSheetProps,
  fullHeightActionSheetProps,
  halfHeightActionSheetProps,
  quarterHeightActionSheetProps,
  threeQuartersHeightActionSheetProps,
} from './action-sheets-props';
// import { slideData } from './slideData';

export const NAV_THEME = {
  // Should be kept in sync with the global.css colors.
  light: {
    background: 'hsl(165 67% 99%)', // background
    border: 'hsl(214.3 31.8% 91.4%)', // border
    card: 'hsl(171 47% 97%)', // card
    notification: 'hsl(0 100% 50%)', // destructive
    primary: 'hsl(177 97% 26%)', // primary
    text: 'hsl(210 40% 98%)', // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};

export const PAGINATION_LIMIT = 10;


export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSSSSS Z';
export const TIME_FORMAT = 'HH:mm:ss';

// https://day.js.org/docs/en/display/format
export const HUMAN_READABLE_DATE_FORMAT = 'LL';
export const HUMAN_READABLE_DATE_TIME_FORMAT = 'lll';

export const HUMAN_READABLE_TIME_FORMAT = 'LT';

export const VERIFICATION_CODE_LENGTH = 6;

export const BUSINESS_NUMBER = '4701356';

export const CUSTOMER_CARE_PHONE_NUMBER = '0707494978';

export const SERVICE_ICONS: Record<string, IconNames> = {
  Doctor: 'doctor',
  Nurse: 'mother-nurse',
  Nutritionist: 'nutrition',
  Physiotherapist: 'account-injury',
  Other: 'plus-box-outline',
  'Clinical psychologist': 'brain',
  'Clinical Officer': 'medical-bag',
  'Occupational Therapist': 'human-wheelchair',
};

export const offlineErrorMessage = 'Please check your internet connection and try again';

export {
  quarterHeightActionSheetProps,
  halfHeightActionSheetProps,
  threeQuartersHeightActionSheetProps,
  fullHeightActionSheetProps,
  bookingActionSheetProps,
  explicitBackAndCloseActionSheetProps,
  // slideData,
};
