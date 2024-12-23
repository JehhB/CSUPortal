import { useEffect } from "react";
import { ColorValue } from "react-native";
import {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { Rect } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type BarProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: ColorValue;
  clipPath?: string;
};

export default function Bar(props: BarProps) {
  const width = useSharedValue(0);

  const { width: targetWidth, ...rectProps } = props;

  useEffect(() => {
    width.value = withTiming(targetWidth, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [width, targetWidth]);

  const animatedProps = useAnimatedProps(() => ({
    width: width.value,
  }));

  return <AnimatedRect {...rectProps} animatedProps={animatedProps} />;
}
