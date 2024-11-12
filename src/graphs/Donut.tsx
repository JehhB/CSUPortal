import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Circle, Path, Svg, Text } from "react-native-svg";
import { RopaSansRegular, theme } from "@/shared/constants/themes";
import Animated, {
  clamp,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import createArcPath from "./helper/createArcPath";

export type DonutProps = {
  progress?: number;
  diameter?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  content?: string;
  subContent?: string;
};

const DEFAULT_DIAMETER = 128;
const DEFAULT_RING_WIDTH = 16;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function Donut(props: DonutProps) {
  const progress = clamp(0.001, props.progress ?? 0, 0.999);

  const d = props.diameter ?? DEFAULT_DIAMETER;
  const r = d / 2;
  const viewBox = `${-r} ${-r} ${d} ${d}`;

  const strokeWidth = props.strokeWidth ?? DEFAULT_RING_WIDTH;

  const angleEnd = useSharedValue(-90);

  const arcProp = useAnimatedProps(() => {
    const path = createArcPath({
      r: r - strokeWidth / 2,
      angleStart: -90,
      angleEnd: angleEnd.value,
    });
    return {
      d: path,
    };
  });

  useEffect(() => {
    const target = -90 + 360 * progress;
    angleEnd.value = withTiming(target, { duration: 300 });
  }, [angleEnd, progress]);

  return (
    <Svg width={d} height={d} viewBox={viewBox} style={[props.style]}>
      <Circle
        r={r}
        stroke={theme.colors.outline}
        strokeWidth={1}
        fill="transparent"
      />
      <Circle
        r={r - strokeWidth}
        stroke={theme.colors.outline}
        strokeWidth={1}
        fill="transparent"
      />
      {props.content && (
        <Text
          y={-4}
          textAnchor="middle"
          fontFamily={RopaSansRegular}
          fontSize={24}
          fill={theme.colors.primary}
        >
          {props.content}
        </Text>
      )}
      {props.subContent && (
        <Text
          y={16}
          textAnchor="middle"
          fontFamily={RopaSansRegular}
          fill={"#44403c"}
        >
          {props.subContent}
        </Text>
      )}

      <AnimatedPath
        stroke={theme.colors.primary}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="transparent"
        animatedProps={arcProp}
      />
    </Svg>
  );
}
