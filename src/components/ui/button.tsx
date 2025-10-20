import { useEffect } from "react";
import { ActivityIndicator, Pressable, TextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import Icon, { IconProps } from "@/components/ui/icon";
import { Text, TextClassContext } from "@/components/ui/text";
import { cn, withModifiedProps } from "@/lib/utils";

const buttonVariants = cva(
  "group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary web:hover:opacity-90 active:opacity-90",
        destructive: "bg-destructive web:hover:opacity-90 active:opacity-90",
        outline:
          "border-2 border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        secondary: "bg-secondary web:hover:opacity-80 active:opacity-80",
        ghost:
          "web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        link: "web:underline-offset-4 web:hover:underline web:focus:underline",
      },
      size: {
        default: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
        sm: "h-9 px-3",
        lg: "h-11 px-8 native:h-14",
        icon: "p-[8px]",
      },
      width: {
        default: "w-fit",
        full: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "default",
    },
  }
);

const buttonTextVariants = cva(
  "web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors",
  {
    variants: {
      variant: {
        default: "text-primary-foreground", 
        destructive: "text-destructive-foreground",
        outline: "group-active:text-accent-foreground",
        secondary:
          "text-secondary-foreground group-active:text-secondary-foreground",
        ghost: "group-active:text-accent-foreground",
        link: "text-primary group-active:underline",
      },
      size: {
        default: "",
        sm: "",
        lg: "native:text-lg",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    text?: string;
    leftIcon?: React.ReactElement<IconProps>;
    rightIcon?: React.ReactElement<IconProps>;
    iconProps?: IconProps;
    loading?: boolean;
  };

function Button({
  ref,
  className,
  variant,
  text,
  width,
  size,
  iconProps,
  leftIcon,
  loading,
  rightIcon,
  ...props
}: ButtonProps) {
  const ButtonIconsProps = {
    size: 22,
  };

  const isVectorIcon = iconProps && "name" in iconProps;

  return (
    <TextClassContext.Provider
      value={cn(
        "web:pointer-events-none",
        buttonTextVariants({ variant, size }),
        className
      )}
    >
      <Pressable
        className={cn(
          "flex-row gap-2",
          buttonVariants({ variant, size, width }),
          className,
          props.disabled && "opacity-50 web:pointer-events-none"
        )}
        ref={ref}
        role="button"
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              variant === "default" || variant === "secondary" ? "#fff" : "#000"
            }
          />
        ) : (
          <>
            {leftIcon &&
              withModifiedProps<IconProps>(leftIcon, ButtonIconsProps)}
            {text && <Text>{text}</Text>}
            {rightIcon &&
              withModifiedProps<IconProps>(rightIcon, ButtonIconsProps)}
            {iconProps && isVectorIcon ? (
              <Icon {...{ ...ButtonIconsProps, className, ...iconProps }} />
            ) : (
              <Icon {...{ className, ...iconProps }} />
            )}
          </>
        )}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
