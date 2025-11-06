import * as React from "react";
import { Animated } from "react-native";
import { cn } from "@/lib/utils";

const duration = 800;

function Skeleton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Animated.View>) {
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ opacity }, { pointerEvents: "none" }]}
      className={cn("rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
