import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, ImageProps } from 'expo-image';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type IconNames = Extract<
  keyof typeof MaterialCommunityIcons.glyphMap,
  | 'magnify'
  | 'information-outline'
  | 'eye-outline'
  | 'eye-off-outline'
  | 'check'
  | 'filter-variant'
  | 'timetable'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-up'
  | 'account-multiple-plus'
  | 'bell'
  | 'chevron-down'
  | 'card-account-details'
  | 'chevron-left'
  | 'chevron-right'
  | 'share-variant-outline'
  | 'heart-outline'
  | 'heart'
  | 'stethoscope'
  | 'map-marker-radius-outline'
  | 'close'
  | 'close-circle'
  | 'doctor'
  | 'earth'
  | 'arrow-top-right'
  | 'alert-outline'
  | 'download'
  | 'dots-vertical'
  | 'dots-horizontal'
  | 'file-outline'
  | 'filter-outline'
  | 'folder-plus-outline'
  | 'folder'
  | 'email-outline'
  | 'account-edit'
  | 'phone-outline'
  | 'lock-outline'
  | 'check-bold'
  | 'loading'
  | 'home-variant-outline'
  | 'folder-text-outline'
  | 'cog-outline'
  | 'account-switch-outline'
  | 'account-outline'
  | 'calendar'
  | 'hospital-building'
  | 'clock-outline'
  | 'cart-plus'
  | 'delete-outline'
  | 'check-circle-outline'
  | 'account-cog-outline'
  | 'email-open-outline'
  | 'video-plus-outline'
  | 'video-outline'
  | 'receipt'
  | 'send'
  | 'pulse'
  | 'send'
  | 'cash'
  | 'access-point'
  | 'medical-bag'
  | 'test-tube'
  | 'clipboard-list-outline'
  | 'clipboard-check-outline'
  | 'clipboard-account-outline'
  | 'Occupational Therapist'
  | 'close-circle-outline'
  | 'account-group'
  | 'account-question'
  | 'food-apple'
  | 'arm-flex'
  | 'brain'
  | 'clipboard-text'
  | 'wheelchair-accessibility'
  | 'account-question'
  | 'shield-check-outline'
  | 'home-heart'
  | 'shield-outline'
  | 'account-injury'
  | 'nutrition'
  | 'mother-nurse'
  | 'human-wheelchair'
  | 'plus-box-outline'
  | 'file-lock-outline'
  | 'bell-outline'
  | 'comment-alert-outline'
  | 'image'
  | 'camera'
  | 'share-variant'
  | 'calendar-clock'
  | 'bookmark-outline'
  | 'bookmark'
  | 'upload'
  | 'paperclip'
  | 'plus'
  | 'message-outline'
  | 'view-list'
  | 'view-module'
  | 'microphone'
  | 'microphone-off'
  | 'attachment'
  | 'send'
  | 'menu'
  
>;

type ImageIconProps = {
  name: IconNames;
  size?: number;
  className?: string;
};
export type IconProps = ImageIconProps | ImageProps;

export default function Icon({ className, ...props }: IconProps) {
  const isVectorIcon = 'name' in props;
  const isImageIcon = 'source' in props;

  // @ts-ignore TODO: Try fix this typescript error
  const { width = 24, height = 24 } = props;

  return (
    <>
      {isVectorIcon && (
        <Text className={cn(className)}>
          <MaterialCommunityIcons {...props} />
        </Text>
      )}
      {isImageIcon && (
        <Image
          {...(props as ImageProps)}
          style={{
            width,
            height,
          }}
        />
      )}
    </>
  );
}
