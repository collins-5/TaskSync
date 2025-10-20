import * as SwitchPrimitives from '@rn-primitives/switch';
import * as React from 'react';
import { Platform, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useColorScheme } from '~/styles/useColorScheme';

function SwitchWeb({
  className,
  label,
  id,
  ...props
}: SwitchPrimitives.RootProps & {
  ref?: React.RefObject<SwitchPrimitives.RootRef>;
  label: string;
  id: string;
}) {
  console.warn('The web version has not been implemented and will not be implemented.');
  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer h-6 w-11 shrink-0 cursor-pointer flex-row items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed',
        props.checked ? 'bg-primary' : 'bg-input',
        props.disabled && 'opacity-50',
        className
      )}
      {...props}>
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-md shadow-foreground/5 ring-0 transition-transform',
          props.checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  );
}

const RGB_COLORS = {
  light: {
    primary: 'rgb(24, 24, 27)',
    input: 'rgb(228, 228, 231)',
  },
  dark: {
    primary: 'rgb(250, 250, 250)',
    input: 'rgb(39, 39, 42)',
  },
} as const;

function SwitchNative({
  className,
  label,
  id,
  ...props
}: SwitchPrimitives.RootProps & {
  ref?: React.RefObject<SwitchPrimitives.RootRef>;
  label: string;
  id: string;
}) {
  const { colorScheme } = useColorScheme();
  const translateX = useDerivedValue(() => (props.checked ? 18 : 0));
  const animatedRootStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [0, 18],
        [RGB_COLORS[colorScheme].input, RGB_COLORS[colorScheme].primary]
      ),
    };
  });
  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(translateX.value, { duration: 200 }) }],
  }));

  return (
    <View className="flex-row items-center gap-2">
      <Animated.View
        style={animatedRootStyle}
        className={cn('h-6 w-[38px] rounded-full', props.disabled && 'opacity-50')}>
        <SwitchPrimitives.Root
          aria-labelledby={id}
          className={cn(
            'h-6 w-[38px] shrink-0 flex-row items-center rounded-full border-2 border-transparent',
            props.checked ? 'bg-primary' : 'bg-input',
            className
          )}
          {...props}>
          <Animated.View style={animatedThumbStyle}>
            <SwitchPrimitives.Thumb
              className={'h-5 w-5 rounded-full bg-background shadow-md shadow-foreground/25 ring-0'}
            />
          </Animated.View>
        </SwitchPrimitives.Root>
      </Animated.View>
      <Label nativeID={id}>{label}</Label>
    </View>
  );
}

const Switch = Platform.select({
  web: SwitchWeb,
  default: SwitchNative,
});

export { Switch };
