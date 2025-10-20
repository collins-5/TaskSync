import { ActionSheetProps, ActionSheetRef } from 'react-native-actions-sheet';

const sharedActionSheetProps: ActionSheetProps & React.RefAttributes<ActionSheetRef> = {
  containerStyle: { padding: 20, gap: 20 },
  snapPoints: [50, 100],
  initialSnapIndex: 1,
  isModal: false,
  gestureEnabled: true,
  indicatorStyle: {
    backgroundColor: 'teal',
  },
};

export const explicitBackAndCloseActionSheetProps: ActionSheetProps &
  React.RefAttributes<ActionSheetRef> = {
  closable: false,
  enableRouterBackNavigation: false,
  closeOnTouchBackdrop: false,
  closeOnPressBack: false,
};

export const quarterHeightActionSheetProps: ActionSheetProps & React.RefAttributes<ActionSheetRef> =
  {
    ...sharedActionSheetProps,
    containerStyle: { ...sharedActionSheetProps.containerStyle, height: '25%' },
  };

export const halfHeightActionSheetProps: ActionSheetProps & React.RefAttributes<ActionSheetRef> = {
  ...sharedActionSheetProps,
  containerStyle: { ...sharedActionSheetProps.containerStyle, height: '50%' },
};

export const threeQuartersHeightActionSheetProps: ActionSheetProps &
  React.RefAttributes<ActionSheetRef> = {
  ...sharedActionSheetProps,
  containerStyle: { ...sharedActionSheetProps.containerStyle, height: '75%' },
};

export const fullHeightActionSheetProps: ActionSheetProps & React.RefAttributes<ActionSheetRef> = {
  ...sharedActionSheetProps,
  containerStyle: { ...sharedActionSheetProps.containerStyle, height: '100%' },
};

export const bookingActionSheetProps = {
  ...fullHeightActionSheetProps,
  ...explicitBackAndCloseActionSheetProps,
};
