import { ClipPath, Defs, G, Rect, RectProps } from "react-native-svg";
import { GridHandle } from "./Grid";
import { Schedule } from "@/student/schedule/parseSchedString";
import { SubjectSchedule } from "@/student/schedule/scheduleService";
import { RopaSansRegular, theme } from "@/shared/constants/themes";
import { useId } from "react";
import WrappedText from "./WrappedText";
import { t12h } from "@/student/schedule/t12h";

export type ScheduleBlockProps = {
  subject: SubjectSchedule;
  schedule: Schedule;
  grid: GridHandle;
  rectProps: Omit<RectProps, "x" | "y" | "w" | "h">;
  onPress: () => void;
};

const BLOCK_MARGIN = 0.5;
const BLOCK_PADDING = 4;

const FONT_SIZE = 9;
const FONT_FAMILY = RopaSansRegular;
const TEXT_COLOR = theme.colors.onSurface;
const LINE_HEIGHT = 1.15;

export default function ScheduleBlock(props: ScheduleBlockProps) {
  const clipPath = useId();
  const subjectClipPath = useId();
  const sched = props.schedule;
  const pos = props.grid.getUnitDimension(sched.day, sched.timeStart);

  if (pos === null) return;
  const height = pos.h * (sched.timeEnd - sched.timeStart);

  const clipArea = {
    x: pos.x + BLOCK_MARGIN + BLOCK_PADDING,
    y: pos.y + BLOCK_MARGIN + BLOCK_PADDING,
    width: pos.w - (BLOCK_MARGIN + BLOCK_PADDING) * 2,
    height: height - (BLOCK_MARGIN + BLOCK_PADDING) * 2,
  };

  return (
    <G onPress={props.onPress}>
      <Defs>
        <ClipPath id={clipPath}>
          <Rect {...clipArea} />
        </ClipPath>
        <ClipPath id={subjectClipPath}>
          <Rect
            {...clipArea}
            height={clipArea.height - LINE_HEIGHT * FONT_SIZE * 3}
          />
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
        <G clipPath={`url(#${subjectClipPath})`}>
          <WrappedText
            x={clipArea.x}
            y={clipArea.y}
            inlineSize={clipArea.width}
            fontFamily={FONT_FAMILY}
            fontSize={FONT_SIZE + 1}
            fill={TEXT_COLOR}
          >
            {props.subject.SubjectDescription}
          </WrappedText>
        </G>
        <WrappedText
          x={clipArea.x}
          y={clipArea.y + clipArea.height - FONT_SIZE * LINE_HEIGHT * 2}
          fontFamily={FONT_FAMILY}
          fontSize={FONT_SIZE}
          fill={TEXT_COLOR}
        >
          {t12h(props.schedule.timeStart)} - {t12h(props.schedule.timeEnd)}
        </WrappedText>
        <WrappedText
          x={clipArea.x}
          y={clipArea.y + clipArea.height - FONT_SIZE * LINE_HEIGHT}
          fontFamily={FONT_FAMILY}
          fontSize={FONT_SIZE}
          fill={TEXT_COLOR}
        >
          {props.schedule.room}
        </WrappedText>
      </G>
    </G>
  );
}
