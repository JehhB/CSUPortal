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
import {
  Button,
  Divider,
  Text as MaterialText,
  Portal,
} from "react-native-paper";
import { Svg, Text } from "react-native-svg";
import { Dimension, getDimension } from "./helper/getDimension";
import Grid from "./helper/Grid";
import GwaBar from "./helper/GwaBar";
import {
  RopaSansRegular,
  RopaSansRegularItalic,
  theme,
} from "@/shared/constants/themes";
import minByFn from "./helper/minByFn";
import toOrdinal from "@/util/toOrdinal";
import Dialog from "@/shared/components/Dialog";
import clamp from "lodash/clamp";

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
  if (sem === "summer") return "Summer";
  return toOrdinal(sem) + " Semester";
}

const FACTORS_100 = [1, 2, 4, 5, 10, 20, 50, 100];
const TARGET_GRID_WIDTH = 50;
const LABEL_WIDTH = 75;
const TICKS_HEIGHT = 24;
const TICK_FONTSIZE = 12;

export default function GwaBarGraph(props: GwaBarGraphProps) {
  const [dialogShown, showDialog] = useState(false);
  const [dialogGwa, setDialogGwa] = useState<StudentGwaNormalized | null>(null);

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
    getDimension(targetWidth, containerWidth),
    minWidth,
    maxWidth,
  );
  const height = clamp(width * aspectRatio, minHeight, maxHeight);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    if (e.nativeEvent.layout.width === 0) return;
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const gridWidth = width - LABEL_WIDTH - 1 - 12;
  const gridHeight = height - TICKS_HEIGHT - 1;

  const numberOfTicks = minByFn(FACTORS_100, (val) => {
    return Math.abs(TARGET_GRID_WIDTH - gridWidth / val);
  });

  const tickInterval = 100 / numberOfTicks;
  const tickLabels = Array(numberOfTicks + 1)
    .fill(1)
    .map((_, i) => tickInterval * i);

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
    <>
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
            insets={[0, 0, -5, 0]}
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
                    onPress={(gwa) => {
                      showDialog(true);
                      setDialogGwa(gwa);
                    }}
                  />
                ))}
                {tickLabels.map((tick, i) => {
                  const col = grid.getColDimension(i);
                  if (col === null) return null;

                  return (
                    <Text
                      key={tick}
                      y={col.y + col.h + 4 + TICK_FONTSIZE}
                      x={col.x}
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
      <Portal>
        <Dialog
          visible={dialogShown && dialogGwa !== null}
          onDismiss={() => showDialog(false)}
        >
          {dialogGwa && (
            <>
              <Dialog.Title>
                {dialogGwa.label} General Weighted Average
              </Dialog.Title>

              <Dialog.Content>
                {dialogGwa.sems.length > 0 ? (
                  <>
                    {dialogGwa.sems.map((sem) => (
                      <View
                        key={`${dialogGwa.year}-${sem.sem}`}
                        style={styles.details}
                      >
                        <View
                          style={[
                            styles.legendColor,
                            {
                              backgroundColor:
                                SEM_COLORS.get(sem.sem) ??
                                SEM_COLORS.get("__default__"),
                            },
                          ]}
                        />
                        <MaterialText
                          variant="titleMedium"
                          style={styles.detailsLabel}
                        >
                          {getSemLabel(sem.sem)}:
                        </MaterialText>
                        <MaterialText
                          variant="titleMedium"
                          style={styles.detailsInfo}
                        >
                          {sem.gwa === null || sem.gwa === 0
                            ? "No grade yet"
                            : sem.gwa.toFixed(2)}{" "}
                          ({sem.units} units)
                        </MaterialText>
                      </View>
                    ))}
                    <Divider />
                    <View style={styles.details}>
                      <MaterialText
                        variant="titleMedium"
                        style={styles.detailsTotal}
                      >
                        Year Average:
                      </MaterialText>
                      <MaterialText
                        variant="titleMedium"
                        style={styles.detailsInfo}
                      >
                        {dialogGwa.yearAverage === null ||
                        dialogGwa.yearAverage === 0
                          ? "No grades yet"
                          : dialogGwa.yearAverage.toFixed(2)}{" "}
                        ({dialogGwa.totalUnits} units earned)
                      </MaterialText>
                    </View>
                  </>
                ) : (
                  <MaterialText
                    variant="titleMedium"
                    style={styles.detailsInfo}
                  >
                    No grade information yet
                  </MaterialText>
                )}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => showDialog(false)}>Dismiss</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
    </>
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
  details: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  detailsLabel: {
    marginStart: 8,
  },
  detailsInfo: {
    fontFamily: RopaSansRegularItalic,
    color: "#44403c",
    marginStart: 8,
  },
  detailsTotal: {
    marginStart: 20,
  },
});
