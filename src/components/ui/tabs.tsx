import type { RootProps } from '@rn-primitives/tabs';

import * as TabsPrimitive from '@rn-primitives/tabs';
import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const PrimitiveTabs = TabsPrimitive.Root;

function Tabs({ className, ...props }: RootProps) {
  return (
    <PrimitiveTabs
      className={cn('mx-auto w-full max-w-[400px] flex-col items-center gap-1.5', className)}
      {...props}
    />
  );
}

const VariantContext = React.createContext<VariantProps<typeof tabListVariants> | null>(null);

const useVariantContext = () => {
  const context = React.useContext(VariantContext);

  if (!context) {
    throw new Error('useVariantContext must be used within a VariantContextProvider ');
  }

  return context;
};

const tabListVariants = cva(
  'native:h-12 native:px-1.5 h-10 flex-row items-center p-1 web:inline-flex',
  {
    variants: {
      variant: {
        pills: 'rounded-full bg-muted ',
        noPills: '',
      },
      align: {
        center: 'self-center',
        start: 'self-start',
      },
    },
    defaultVariants: {
      variant: 'pills',
      align: 'center',
    },
  }
);

function TabsList({
  className,
  variant,
  align,
  ...props
}: TabsPrimitive.ListProps & {
  ref?: React.RefObject<TabsPrimitive.ListRef>;
} & VariantProps<typeof tabListVariants>) {
  const alignment = variant === 'noPills' && !align ? 'start' : align;
  return (
    <VariantContext.Provider value={{ variant }}>
      <TabsPrimitive.List
        className={cn(tabListVariants({ variant, align: alignment }), className)}
        {...props}
      />
    </VariantContext.Provider>
  );
}

const tabTriggerVariants = cva(
  'inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium shadow-none web:whitespace-nowrap web:ring-offset-background web:transition-all web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        pills: 'rounded-full',
        noPills: ' bg-none',
      },
      disabled: {
        true: 'opacity-50 web:pointer-events-none',
      },
      active: {
        true: 'shadow-lg shadow-foreground/10',
      },
    },
    compoundVariants: [
      {
        variant: 'pills',
        active: true,
        class: 'bg-primary',
      },
      {
        variant: 'noPills',
        active: true,
        class: 'border-b-2 border-primary text-black',
      },
    ],
    defaultVariants: {
      variant: 'pills',
      active: false,
    },
  }
);

const tabTriggerTextVariants = cva(
  'text-sm native:text-base font-medium text-muted-foreground web:transition-all',
  {
    variants: {
      variant: {
        pills: '',
        noPills: '',
      },
      active: {
        true: 'text-primary shadow-lg shadow-foreground/10',
      },
    },
    compoundVariants: [
      {
        variant: 'pills',
        active: true,
        class: 'bg-primary text-primary-foreground',
      },
      {
        variant: 'noPills',
        active: true,
        class: 'text-primary',
      },
    ],
    defaultVariants: {
      variant: 'pills',
      active: false,
    },
  }
);

function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.TriggerProps & {
  ref?: React.RefObject<TabsPrimitive.TriggerRef>;
}) {
  const { value } = TabsPrimitive.useRootContext();
  const { variant } = useVariantContext();

  const disabled = props.disabled;
  const active = props.value === value;
  return (
    <TextClassContext.Provider value={cn(tabTriggerTextVariants({ variant, active }))}>
      <TabsPrimitive.Trigger
        className={cn(tabTriggerVariants({ variant, disabled, active }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.ContentProps & {
  ref?: React.RefObject<TabsPrimitive.ContentRef>;
}) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
