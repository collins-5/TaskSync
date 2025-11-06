import React from 'react';
import { View } from 'react-native';

interface SkeletonListProps {
  skeletonComponent: React.FC;
  count: number;
}

const SkeletonList: React.FC<SkeletonListProps> = ({
  skeletonComponent: SkeletonComponent,
  count,
}) => {
  return (
    <View className="gap-2">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </View>
  );
};

export default SkeletonList;
