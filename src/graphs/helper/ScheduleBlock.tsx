import { ClipPath, Defs, G, Rect, RectProps } from "react-native-svg";
import { GridHandle } from "./Grid";
import { Schedule } from "@/student/schedule/parseSchedString";
import { SubjectSchedule } from "@/student/schedule/scheduleService";
import { RopaSansRegular, theme } from "@/shared/constants/themes";
import onPressProp from "./onPressProp";
import { useId } from "react";
import WrappedText from "./WrappedText";

export type ScheduleBlockProps = {
  subject: SubjectSchedule;
  schedule: Schedule;
  grid: GridHandle;
  rectProps: Omit<RectProps, "x" | "y" | "w" | "h">;
  onPress: () => void;
};

const BLOCK_MARGIN = 0.5;
const BLOCK_PADDING = 4;

const FONT_SIZE = 10;
const FONT_FAMILY = RopaSansRegular;
const TEXT_COLOR = theme.colors.onSurface;
const LINE_HEIGHT = 1.15;

type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function Y(i: number, { y, h }: Area) {
  if (i >= 0) return LINE_HEIGHT * i + FONT_SIZE + y;
  const rI = -i - 1;
  return y + h - (LINE_HEIGHT * rI + FONT_SIZE * (LINE_HEIGHT - 1));
}

export default function ScheduleBlock(props: ScheduleBlockProps) {
  const clipPath = useId();
  const sched = props.schedule;
  const pos = props.grid.getUnitDimension(sched.day, sched.timeStart);

  if (pos === null) return;
  const height = pos.h * (sched.timeEnd - sched.timeStart);

  const pressProps = onPressProp(props.onPress);
  const clipArea = {
    x: pos.x + BLOCK_MARGIN + BLOCK_PADDING,
    y: pos.y + BLOCK_MARGIN + BLOCK_PADDING,
    width: pos.w - (BLOCK_MARGIN + BLOCK_PADDING) * 2,
    height: height - (BLOCK_MARGIN + BLOCK_PADDING) * 2,
  };

  return (
    <G {...pressProps}>
      <Defs>
        <ClipPath id={clipPath}>
          <Rect {...clipArea} />
        </ClipPath>
      </Defs>
      <Rect
        x={pos.x + BLOCK_MARGIN}
        y={pos.y + BLOCK_MARGIN}
        width={pos.w - BLOCK_MARGIN * 2}
        height={height - BLOCK_MARGIN * 2}
        fill={theme.colors.tertiary}
        rx={theme.roundness}
        ry={theme.roundness}
        {...props.rectProps}
      />
      <G clipPath={`url(#${clipPath})`}>
        <WrappedText
          x={clipArea.x}
          y={clipArea.y}
          inlineSize={clipArea.width}
          fontFamily={FONT_FAMILY}
          fontSize={FONT_SIZE}
          fill={TEXT_COLOR}
        >
          {props.subject.SubjectDescription}
        </WrappedText>
      </G>
    </G>
  );
}
