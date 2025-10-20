import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import * as React from 'react';
import { View } from 'react-native';

import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

import { Label } from './label';
import { Text } from './text'; // Assuming you use the same Text component as in `Input`

function Checkbox({
  className,
  label,
  id,
  error,
  ...props
}: CheckboxPrimitive.RootProps & {
  ref?: React.RefObject<CheckboxPrimitive.RootRef>;
  label: string;
  id: string;
  error?: string;
}) {
  return (
    <View className="flex flex-col gap-1">
      <View className="flex-row items-center gap-2">
        <CheckboxPrimitive.Root
          className={cn(
            'web:peer native:h-[20] native:w-[20] native:rounded h-4 w-4 shrink-0 rounded-sm border border-primary disabled:cursor-not-allowed disabled:opacity-50 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
            props.checked && 'bg-primary',
            error && 'border-destructive',
            className
          )}
          {...props}
          aria-labelledby={id}>
          <CheckboxPrimitive.Indicator className="flex h-full w-full items-center justify-center">
            <Icon name="check-bold" className="text-white" size={12} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <Label nativeID={id}>{label}</Label>
      </View>
      {error && <Text className="text-sm text-destructive">{error}</Text>}
    </View>
  );
}

export { Checkbox };

