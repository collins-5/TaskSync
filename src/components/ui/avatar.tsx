import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { cn, getInitials } from '@/lib/utils';

const AvatarVariants = cva('rounded-full overflow-hidden relative flex shrink-0', {
  variants: {
    size: {
      sm: 'h-[40] w-[40]',
      md: 'h-[50] w-[50]',
      lg: 'h-[80] w-[80]',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

const AvatarTextVariant = cva('font-bold text-teal-900', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-4xl',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

type AvatarProps = {
  resourceURL: string;
  alt?: string;
  hasProfilePicture?: boolean;
  first_name?: string;
  last_name?: string;
  params?: Record<string, string>;
  className?: string;
  refetchTriggerKey?: string | number | null;
} & VariantProps<typeof AvatarVariants>;

const Avatar: React.FC<AvatarProps> = ({
  resourceURL,
  alt = 'profile picture',
  hasProfilePicture,
  first_name,
  last_name,
  params,
  className,
  size,
  refetchTriggerKey,
  ...props
}) => {
  return (
    <View className={cn(AvatarVariants({ size }), className)} {...props}>
      {resourceURL.length > 0 || hasProfilePicture ? (
        <Image
          className={cn('aspect-square h-full w-full', className)}
          source={{ uri: resourceURL }}
          contentFit="cover"
          accessibilityLabel={alt}
          cachePolicy={refetchTriggerKey ? 'none' : (params?.cachePolicy as any) || 'disk'}
          key={refetchTriggerKey}
        />
      ) : (
        <View
          className={cn(
            'flex h-full w-full items-center justify-center rounded-full bg-primary/20',
            className
          )}
          {...props}>
          <Text className={cn(AvatarTextVariant({ size }))}>
            {getInitials(first_name ?? last_name ?? '')}
          </Text>
        </View>
      )}
    </View>
  );
};

export { Avatar };
