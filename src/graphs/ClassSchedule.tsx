import React, { useMemo, useState } from "react";
import { SubjectSchedule } from "@/student/schedule/scheduleService";
import { Svg, Text } from "react-native-svg";
import { Dimension, getDimension } from "./helper/getDimension";
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import clamp from "lodash/clamp";
import Grid from "./helper/Grid";
import { RopaSansRegular, theme } from "@/shared/constants/themes";
import ScheduleBlock from "./helper/ScheduleBlock";
import scheduleColor from "./helper/scheduleColor";
import { Schedule } from "@/student/schedule/parseSchedString";

export type ClassScheduleProps = {
  classSchedule?: SubjectSchedule[] | null | undefined;
  width?: Dimension;
  aspectRatio?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

const MARGIN_TOP = 32;
const MARGIN_LEFT = 48;
const GRID_INSETS: [number, number, number, number] = [-12, 0, -8, -16];

const GRID_ROWS = 12;
const GRID_COLS = 6;
const GRID_ROW_WEIGHTS = Array(GRID_ROWS).fill(60);

const X_LABEL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const Y_LABEL = [
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
];
const X_LABEL_FONTSIZE = 16;
const Y_LABEL_FONTSIZE = 12;
const SVG_WIDHT = 400;
const SVG_HEIGHT = 640;

export default function ClassSchedule(props: ClassScheduleProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const {
    classSchedule,
    width: targetWidth = "100%",
    aspectRatio = 16 / 10,
    minWidth = 0,
    maxWidth = Number.MAX_SAFE_INTEGER,
    minHeight = 0,
    maxHeight = Number.MAX_SAFE_INTEGER,
  } = props;

  const onContainerLayout = (e: LayoutChangeEvent) => {
    if (e.nativeEvent.layout.width === 0) return;
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const width = clamp(
    getDimension(targetWidth, containerWidth),
    minWidth,
    maxWidth,
  );
  const height = clamp(width * aspectRatio, minHeight, maxHeight);

  const gridWidth = SVG_WIDHT - MARGIN_LEFT - 8;
  const gridHeight = SVG_HEIGHT - MARGIN_TOP - 8;

  const schedules = useMemo(
    () =>
      classSchedule?.flatMap((subject, i) =>
        subject.Schedule.map(
          (sched, j) =>
            [subject, sched, i, j] as [
              SubjectSchedule,
              Schedule,
              number,
              number,
            ],
        ),
      ) ?? [],
    [classSchedule],
  );

  return (
    <View
      style={[styles.container, props.containerStyle]}
      onLayout={onContainerLayout}
    >
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${SVG_WIDHT} ${SVG_HEIGHT}`}
      >
        <Grid
          x={MARGIN_LEFT}
          y={MARGIN_TOP}
          w={gridWidth}
          h={gridHeight}
          insets={GRID_INSETS}
          cols={GRID_COLS}
          rows={GRID_ROWS}
          rowWeight={GRID_ROW_WEIGHTS}
          pathProps={{ stroke: theme.colors.outlineVariant }}
        >
          {(grid) => (
            <>
              {schedules.map(([subject, sched, i, j]) => (
                <ScheduleBlock
                  key={subject.SubjectDescription + j}
                  grid={grid}
                  subject={subject}
                  schedule={sched}
                  rectProps={{
                    fill: scheduleColor(i, classSchedule?.length ?? 0),
                  }}
                  onPress={() => console.log(subject)}
                />
              ))}
              {Y_LABEL.map((time, index) => {
                const row = grid.getRowDimension(index);
                if (row === null) return null;

                return (
                  <Text
                    key={time}
                    y={row.y + 4}
                    x={row.x + GRID_INSETS[3] - 32}
                    textAnchor="start"
                    fontSize={Y_LABEL_FONTSIZE}
                    fontFamily={RopaSansRegular}
                    fill={"#44403c"}
                  >
                    {time}
                  </Text>
                );
              })}
              {X_LABEL.map((day, index) => {
                const col = grid.getColDimension(index);
                if (col === null) return null;

                return (
                  <Text
                    key={day}
                    y={col.y + GRID_INSETS[0] - 4}
                    x={col.x + col.w / 2}
                    textAnchor="middle"
                    fontSize={X_LABEL_FONTSIZE}
                    fontFamily={RopaSansRegular}
                    fill={theme.colors.primary}
                  >
                    {day}
                  </Text>
                );
              })}
            </>
          )}
        </Grid>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
