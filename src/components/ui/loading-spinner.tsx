// import { useEffect } from 'react';
// import { View } from 'react-native';
// import Animated, {
//   Easing,
//   useAnimatedStyle,
//   useSharedValue,
//   withRepeat,
//   withTiming,
// } from 'react-native-reanimated';

// import Icon from '@/components/ui/icon';
// import { cn } from '~/lib/utils';

// export function LoadingSpinner({
//   containerClassName,
//   iconClassName,
//   iconSize = 20,
// }: {
//   containerClassName?: string;
//   iconClassName?: string;
//   iconSize?: number;
// }) {
//   const rotation = useSharedValue(0);

//   useEffect(() => {
//     rotation.value = withRepeat(
//       withTiming(360, { duration: 580, easing: Easing.linear }),
//       -1,
//       false
//     );
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           rotate: `${rotation.value % 360}deg`,
//         },
//       ],
//     };
//   });

//   return (
//     <View>
//       <Animated.View style={[animatedStyle]} className={cn(containerClassName)}>
//         <Icon name="loading" className={cn(iconClassName)} size={iconSize}></Icon>
//       </Animated.View>
//     </View>
//   );
// }
