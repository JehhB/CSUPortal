import React, { useId } from "react";
import { StudentGwaNormalized } from "@/student/gwa/normalizeGwa";
import { GridHandle } from "./Grid";
import { ClipPath, Defs, G, Rect, Text } from "react-native-svg";
import { RopaSansRegular } from "@/shared/constants/themes";
import { ColorValue, Platform } from "react-native";
import Bar from "./Bar";

export type BarColors = Map<number | "summer" | "__default__", ColorValue>;

export type GwaBarProp = {
  gwa: StudentGwaNormalized;
  row: number;
  grid: GridHandle;
  barColors: BarColors;
  onPress: (gwa: StudentGwaNormalized) => void;
};

const FONT_SIZE = 16;
const BAR_SPACE_RATIO = 0.5;

export default function GwaBar({
  gwa,
  row,
  grid,
  barColors,
  onPress,
}: GwaBarProp) {
  const rowDimension = grid.getRowDimension(row);
  const clipId = useId();

  if (rowDimension === null) return null;

  const textPaddingY = (rowDimension.h - FONT_SIZE) / 2;
  const textBaseline = rowDimension.y + textPaddingY + FONT_SIZE;

  const x = rowDimension.x + 1;

  const unitHeight = rowDimension.h / gwa.sems.length;
  const barHeight = unitHeight * BAR_SPACE_RATIO;
  const paddingY = (unitHeight - barHeight) / 2;
  const barY = (index: number) =>
    unitHeight * index + paddingY + rowDimension.y;
  const barWidth = (gwa: number) => (gwa / 100) * rowDimension.w;

  return (
    <>
      <Text
        x={rowDimension.x - 8}
        y={textBaseline}
        textAnchor="end"
        fontFamily={RopaSansRegular}
        fontSize={FONT_SIZE}
        fill={"#44403c"}
      >
        {gwa.label}
      </Text>
      <G>
        {gwa.sems.map((sem, index) => (
          <Bar
            key={sem.sem}
            x={x}
            y={barY(index)}
            width={barWidth(sem.gwa ?? 0)}
            height={barHeight}
            fill={
              barColors.get(sem.sem) ??
              barColors.get("__default__") ??
              "#000000"
            }
            clipPath={Platform.OS === "web" ? `url(#${clipId})` : undefined}
          />
        ))}
        {Platform.OS === "web" && (
          <Defs>
            <ClipPath id={clipId}>
              <Rect
                x={x}
                y={rowDimension.y}
                width={rowDimension.w}
                height={rowDimension.h}
              />
            </ClipPath>
          </Defs>
        )}
        <Rect
          onPress={() => onPress(gwa)}
          opacity={0.0}
          x={x}
          y={rowDimension.y}
          width={rowDimension.w}
          height={rowDimension.h}
        />
      </G>
    </>
  );
}
