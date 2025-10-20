import ActionSheet, { Route, RouteDefinition, SheetDefinition } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { threeQuartersHeightActionSheetProps } from '~/lib/constants';

import EmailOrPhoneNumberRoute from './email-or-phone-number-route';
import ResetPasswordRoute from './reset-password-route';

const ResetPasswordBottomSheet = () => {
  const insets = useSafeAreaInsets();

  return (
    <ActionSheet
      // {...threeQuartersHeightActionSheetProps}
      containerStyle={{
        paddingBottom: insets.bottom + 20,
        paddingTop: 20,
        paddingHorizontal: 20,
        gap: 20,
        height: '75%',
      }}
      routes={routes}
      initialRoute={'email-or-phone-number'}
      id="reset-password"
    />
  );
};

const routes: Route[] = [
  {
    name: 'email-or-phone-number',
    component: EmailOrPhoneNumberRoute,
  },
  {
    name: 'reset-password',
    component: ResetPasswordRoute,
  },
];

export type ResetPasswordSheetDefinition = SheetDefinition<{
  routes: {
    'email-or-phone-number': RouteDefinition;
    'reset-password': RouteDefinition;
  };
}>;

export default ResetPasswordBottomSheet;
