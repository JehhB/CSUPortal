import { shareAsync } from "expo-sharing";
import { RefObject } from "react";
import { Svg } from "react-native-svg";
import { captureRef } from "react-native-view-shot";

const SVG_WIDTH = 400;
const SVG_HEIGHT = 640;

export default async function onDownload(
  svgRef: RefObject<Svg | null>,
): Promise<void> {
  const image = await captureRef(svgRef, {
    quality: 1.0,
    width: SVG_WIDTH * 2,
    height: SVG_HEIGHT * 2,
    format: "png",
    result: "tmpfile",
    fileName: "schedule.png",
  });

  await shareAsync(image, {
    mimeType: "image/png",
    dialogTitle: "Share schedule",
    UTI: "schedule.png",
  });
}
