import * as RadioGroupPrimitive from '@rn-primitives/radio-group';
import { createContext, ReactNode, useContext } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

import { Label } from './label';
import { TextClassContext } from './text';

const RadioContext = createContext('');

function useRadioContext() {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadioContext cannot be used outside a RadioContext Provider.');
  }
  return context;
}

function RadioGroup({
  className,
  children,
  ...props
}: RadioGroupPrimitive.RootProps & {
  ref?: React.RefObject<RadioGroupPrimitive.RootRef>;
}) {
  return (
    <RadioGroupPrimitive.Root className={cn('gap-2 web:grid', className)} {...props}>
      <RadioContext.Provider value={props.value ?? ''}>{children}</RadioContext.Provider>
    </RadioGroupPrimitive.Root>
  );
}

function RadioGroupItem({
  className,
  ...props
}: RadioGroupPrimitive.ItemProps & {
  ref?: React.RefObject<RadioGroupPrimitive.ItemRef>;
}) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'native:h-5 native:w-5 aspect-square h-4 w-4 items-center justify-center rounded-full border border-primary text-primary web:ring-offset-background web:focus:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        props.disabled && 'opacity-50 web:cursor-not-allowed',
        className
      )}
      {...props}>
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <View className="native:h-[10] native:w-[10] aspect-square h-[9px] w-[9px] rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <View className={'flex-row items-center gap-2'}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}

function RadioGroupItemWithChildren<T>({
  className,
  children,
  value,
  onLabelPress,
  textClassName,
  ...props
}: RadioGroupPrimitive.ItemProps & {
  onLabelPress: () => void;
  disabled?: boolean | undefined;
  value: string;
  textClassName: string | undefined;
  children: ReactNode;
}) {
  const context = useRadioContext();
  const isActive = context === value;

  return (
    <TextClassContext value={cn(textClassName, isActive && 'text-primary')}>
      <View
        className={cn(
          'border border-border web:ring-offset-background web:focus:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
          props.disabled && 'opacity-50 web:cursor-not-allowed',
          isActive && 'border-primary text-primary',
          className
        )}>
        <RadioGroupPrimitive.Item value={value} {...props}>
          {children}
        </RadioGroupPrimitive.Item>
      </View>
    </TextClassContext>
  );
}

export { RadioGroup, RadioGroupItem, RadioGroupItemWithChildren, RadioGroupItemWithLabel };
