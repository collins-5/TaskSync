import type { TextInputProps } from 'react-native';

import * as React from 'react';
import { JSX } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

import Icon, { IconProps } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * A customizable input component for React Native, supporting labels, descriptions, error messages, and optional icons.
 *
 * @param className - Additional class names for the input field.
 * @param placeholderClassName - Additional class names for the placeholder text.
 * @param label - Optional label displayed above the input.
 * @param description - Optional description displayed below the input when there is no error.
 * @param error - Optional error message displayed below the input.
 * @param iconComponent - Optional custom icon component to display inside the input. Recommended size is 20.
 * @param iconProps - Optional props for the default icon component.
 * @param secureTextEntry - If true, the input will mask the text (for passwords).
 * @param ref - Optional ref to the underlying TextInput.
 * @param props - Additional props passed to the underlying TextInput.
 *
 * @returns A styled input field with optional label, icon, description, and error message.
 */
function Input({
  className,
  placeholderClassName,
  label,
  description,
  error,
  iconComponent,
  iconProps,
  secureTextEntry: initialSecureTextEntry,
  ref,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput | null>;
  label?: string;
  description?: string;
  error?: string;
  iconComponent?: JSX.Element | null;
  iconProps?: IconProps;
}) {
  const id = props.id ?? label;

  let IconComponent = null;

  if (iconComponent) {
    IconComponent = iconComponent;
  } else if (iconProps) {
    IconComponent = <Icon {...{ ...iconProps, size: 20 }}></Icon>;
  }

  const [isFocused, setIsFocused] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const localRef = React.useRef<TextInput>(null);
  const inputRef = ref || localRef;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const placeholder = typeof props.placeholder === 'string' ? props.placeholder : '';

  const isPasswordInput = !!initialSecureTextEntry;
  const effectiveSecureTextEntry = isPasswordInput && !isPasswordVisible;

  return (
    <View className="flex flex-col">
      {label && <Label accessibilityLabelledBy={id}>{label}</Label>}
      <View
        className={`flex-row items-center rounded-md border-2 border-border bg-background ${isFocused && 'border-primary'}`}>
        {IconComponent && <View className="pl-3 text-muted-foreground">{IconComponent}</View>}
        <TextInput
          ref={inputRef}
          nativeID={id}
          className={cn(
            'h-11 flex-1 px-3 text-base leading-[1.25] text-foreground focus:outline-none',
            props.editable === false && 'cursor-not-allowed opacity-50',
            className
          )}
          placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={effectiveSecureTextEntry}
          {...props}
        />
        {isPasswordInput && (
          <TouchableOpacity onPress={togglePasswordVisibility} className="pr-3">
            <Icon name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} className='text-black' />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {description && !error && (
          <Text className="text-sm text-muted-foreground">{description}</Text>
        )}
        {error && <Text className="text-sm text-destructive">{error}</Text>}
      </View>
    </View>
  );
}

export { Input };
