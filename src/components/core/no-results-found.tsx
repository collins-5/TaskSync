import { RefreshControl, ScrollView } from 'react-native';

import { Button } from '../ui/button';
import { Text } from '../ui/text';
import View from '../ui/view';

interface NoResultFoundProps {
  title?: string;
  message: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  showClearButton?: boolean;
  onClear?: () => void;
  clearButtonText?: string;
  showSecondButton?: boolean;
  onSecondButtonPress?: () => void;
  secondButtonText?: string;
  secondButtonVariant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  secondButtonLoading?: boolean;
  icon?: React.ReactNode;
}

const NoResultFound = ({
  title = 'No Results Found',
  message,
  refreshing = false,
  onRefresh,
  showClearButton = false,
  onClear,
  clearButtonText = 'Clear Filters',
  showSecondButton = false,
  onSecondButtonPress,
  secondButtonText = 'Request Discharge Summary',
  secondButtonVariant = 'default',
  secondButtonLoading = false,
  icon,
}: NoResultFoundProps) => {
  const content = (
    <View className="flex-1 items-center border border-primary/10 bg-muted-foreground/5 rounded-lg justify-center px-6 py-8">
      <View className="mb-6 size-28 rounded-full flex items-center justify-center bg-muted">
        {icon}
      </View>
      <Text className="text-xl font-bold text-foreground mb-3 text-center">{title}</Text>
      <Text className="text-center text-muted-foreground mb-8 max-w-xs leading-6">{message}</Text>

      <View className="flex-col items-center gap-3 w-full max-w-xs">
        {showClearButton && onClear && (
          <Button
            text={clearButtonText}
            variant="outline"
            onPress={onClear}
            className="px-8 text-center w-full"
          />
        )}

        {showSecondButton && onSecondButtonPress && (
          <Button
            text={secondButtonText}
            variant={secondButtonVariant}
            onPress={onSecondButtonPress}
            loading={secondButtonLoading}
            className="w-full text-center"
          />
        )}
      </View>
    </View>
  );

  if (onRefresh) {
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#888" />
        }>
        {content}
      </ScrollView>
    );
  }

  return content;
};

export default NoResultFound;
