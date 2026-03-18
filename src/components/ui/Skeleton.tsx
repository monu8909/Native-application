import React from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export function Skeleton({ className = "" }: { className?: string }) {
  const o = useSharedValue(0.35);
  React.useEffect(() => {
    o.value = withRepeat(withTiming(0.75, { duration: 900, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [o]);

  const style = useAnimatedStyle(() => ({ opacity: o.value }));

  return (
    <Animated.View
      style={style}
      className={["rounded-2xl bg-white/10 border border-white/5", className].join(" ")}
    />
  );
}

