import React from "react";
import { StudentGwaNormalized } from "@/student/gwa/normalizeGwa";
import { useState } from "react";
import {
  ColorValue,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Text as MaterialText } from "react-native-paper";
import { Svg, Text } from "react-native-svg";
import { Dimension, getDimension } from "./helper/getDimension";
import { clamp } from "./helper/clamp";
import Grid from "./helper/Grid";
import GwaBar from "./helper/GwaBar";
import { RopaSansRegular, theme } from "@/shared/constants/themes";
import minByFn from "./helper/minByFn";
import toOrdinal from "@/util/toOrdinal";

export type GwaBarGraphProps = {
  gwa: StudentGwaNormalized[];
  width?: Dimension;
  aspectRatio?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

const SEM_COLORS = new Map<number | "summer" | "__default__", ColorValue>([
  [1, theme.colors.primary],
  [2, theme.colors.secondary],
  ["summer", theme.colors.tertiary],
  ["__default__", theme.colors.error],
]);

function getSemLabel(sem: number | "summer"): string {
  if (sem == "summer") return "Summer";
  return toOrdinal(sem);
}

const FACTORS_100 = [1, 2, 4, 5, 10, 20, 50, 100];
const TARGET_GRID_WIDTH = 50;
const LABEL_WIDTH = 75;
const TICKS_HEIGHT = 24;
const TICK_FONTSIZE = 12;

export default function GwaBarGraph(props: GwaBarGraphProps) {
  const {
    gwa,
    width: targetWidth = "100%",
    aspectRatio = 3 / 4,
    minWidth = 0,
    maxWidth = Number.MAX_SAFE_INTEGER,
    minHeight = 0,
    maxHeight = Number.MAX_SAFE_INTEGER,
  } = props;

  const [containerWidth, setContainerWidth] = useState(0);

  const width = clamp(
    minWidth,
    getDimension(targetWidth, containerWidth),
    maxWidth,
  );
  const height = clamp(minHeight, width * aspectRatio, maxHeight);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const gridWidth = width - LABEL_WIDTH - 1 - 12;
  const gridHeight = height - TICKS_HEIGHT - 1;

  const numberOfTicks = minByFn(FACTORS_100, (val) => {
    return Math.abs(TARGET_GRID_WIDTH - gridWidth / val);
  });

  const tickInterval = 100 / numberOfTicks;
  const tickLabels = Array(numberOfTicks)
    .fill(1)
    .map((_, i) => tickInterval * (i + 1));

  const legends = new Set<number | "summer">();
  gwa.forEach((g) => {
    g.sems.forEach((sem) => {
      legends.add(sem.sem);
    });
  });
  const orderedLegends = [...legends];
  orderedLegends.sort((a, b) => {
    if (a === b) return 0;
    if (a === "summer") return 1;
    if (b === "summer") return -1;

    return a - b;
  });

  return (
    <View
      onLayout={onContainerLayout}
      style={[styles.container, props.containerStyle]}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Grid
          w={gridWidth}
          h={gridHeight}
          x={LABEL_WIDTH}
          y={1}
          rows={gwa.length}
          rowWeight={gwa.map((v) => v.sems.length)}
          cols={numberOfTicks}
        >
          {(grid) => (
            <>
              {gwa.map((g, i) => (
                <GwaBar
                  key={g.year}
                  gwa={g}
                  row={i}
                  grid={grid}
                  barColors={SEM_COLORS}
                />
              ))}
              {tickLabels.map((tick, i) => {
                const col = grid.getColDimension(i);
                if (col === null) return null;

                return (
                  <Text
                    key={tick}
                    y={col.y + col.h + 4 + TICK_FONTSIZE}
                    x={col.x + col.w}
                    textAnchor="middle"
                    fontSize={TICK_FONTSIZE}
                    fontFamily={RopaSansRegular}
                    fill={"#44403c"}
                  >
                    {tick}
                  </Text>
                );
              })}
            </>
          )}
        </Grid>
      </Svg>
      <View style={[styles.legends, { maxWidth }]}>
        {orderedLegends.map((legend) => (
          <View key={legend} style={styles.legend}>
            <View
              style={[
                styles.legendColor,
                {
                  backgroundColor:
                    SEM_COLORS.get(legend) ?? SEM_COLORS.get("__default__"),
                },
              ]}
            />
            <MaterialText variant="labelLarge" style={styles.legendLabel}>
              {getSemLabel(legend)}
            </MaterialText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  legends: {
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  legend: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    flexWrap: "nowrap",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 9999,
    borderColor: "#44403c",
    borderStyle: "solid",
    borderWidth: 1,
  },
  legendLabel: {
    lineHeight: 14,
    fontSize: 14,
  },
});
