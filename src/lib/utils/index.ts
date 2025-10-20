import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Alert, Platform } from 'react-native';
import { twMerge } from 'tailwind-merge';

// import { CURRENCIES_SYMBOLS } from '../constants';
// import {
//   formatBackendDateTimeToHumanReadableLongDate,
//   formatBackendDateToHumanReadableShortDate,
//   formatBackendDateToHumanReadableTime,
//   parseBackendDateToDate,
//   parseDateToBackendDate,
// } from './day';

export const storage = {
  setItem: async (k: string, v: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(k, v);
    } else {
      await SecureStore.setItemAsync(k, v.toString());
    }
  },
  getItem: async (k: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(k);
    } else {
      return await SecureStore.getItemAsync(k);
    }
  },
  removeItem: async (k: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(k);
    } else {
      await SecureStore.deleteItemAsync(k);
    }
  },
};


export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Returns a new React element with the specified props merged into the original component's props.
 *
 * @typeParam T - The investigationType of the component's props.
 * @param component - The React element to clone and modify.
 * @param propsToAdd - An object containing the props to add or override on the component.
 * @returns A new React element with the merged props.
 *
 * @example
 * // TypeScript usage:
 * investigationType ButtonProps = { title: string; disabled?: boolean };
 * const Button: React.FC<ButtonProps> = (props) => (
 *   <button disabled={props.disabled}>{props.title}</button>
 * );
 * const original = <Button title="Click me" />;
 * const modified = withModifiedProps<ButtonProps>(original, { title: "Updated", disabled: true });
 * // modified will render a button with "Updated" as the title and disabled state set to true
 */
export function withModifiedProps<T>(
  component: React.ReactElement<T>,
  propsToAdd: Partial<T>
): React.ReactElement<T> {
  return React.cloneElement(component, {
    ...component.props,
    ...propsToAdd,
  });
}

// export const getServiceImageMapKey = (serviceName: string) => {
//   return serviceName.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
// };

// export const getInitials = (name: string): string => {
//   return name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
// };

// export const convertFromSnakeToTitleCase = (code: string): string => {
//   let result = code.replace(/_/g, ' ');

//   result = result
//     .split(' ')
//     .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
//     .join(' ');

//   return result;
// };

// export const confirmCancelBookingProcess = (onPress: () => void) => {
//   Alert.alert('Hold on!', 'Are you sure you want to go back? You will lose your booking progress', [
//     {
//       text: 'Cancel',
//       onPress: () => null,
//       style: 'cancel',
//     },
//     { text: 'YES', onPress },
//   ]);
//   return true;
// };

// export const getIconName = (value: string) => {
//   switch (value) {
//     case 'VIRTUAL':
//       return 'video-outline';
//     case 'CLINIC_VISIT':
//       return 'hospital-building';
//     case 'HOME_VISIT':
//       return 'home-variant-outline';
//     default:
//       return 'heart-outline';
//   }
// };

// export {
//   formatBackendDateTimeToHumanReadableLongDate,
//   formatBackendDateToHumanReadableShortDate,
//   formatBackendDateToHumanReadableTime,
//   parseBackendDateToDate,
//   parseDateToBackendDate,
// };
