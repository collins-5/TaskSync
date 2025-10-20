import type { VariantProps } from 'class-variance-authority';

import * as Slot from '@rn-primitives/slot';
import { cva } from 'class-variance-authority';
import { View, ViewProps } from 'react-native';

import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'web:inline-flex items-center rounded-full border border-border px-2.5 py-0.5 web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'border-transparent bg-primary web:hover:opacity-80 active:opacity-80',
        secondary: 'border-transparent bg-secondary web:hover:opacity-80 active:opacity-80',
        destructive: 'border-transparent bg-destructive web:hover:opacity-80 active:opacity-80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

const badgeTextVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      primary: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

type BadgeProps = ViewProps & {
  asChild?: boolean;
  text?: string;
} & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, text, ...props }: BadgeProps) {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props}>
        {text && (
          <Text numberOfLines={1} ellipsizeMode="tail">
            {text}
          </Text>
        )}
      </Component>
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
