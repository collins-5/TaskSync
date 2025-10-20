import React, { ReactNode } from 'react';

import { cn } from '~/lib/utils';

import View from '../ui/view';

interface ScreenWrapperProps {
  children: ReactNode;
  className?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, className }) => {
  return <View className={cn('mx-3 my-2 flex-1', className)}>{children}</View>;
};
