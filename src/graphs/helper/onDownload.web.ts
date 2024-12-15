import { RefObject } from "react";
import { Svg } from "react-native-svg";

export default async function onDownload(
  svgRef: RefObject<Svg | null>,
): Promise<void> {
  const svgElement = svgRef.current;
  if (!svgElement) return;

  const element = svgElement.elementRef as RefObject<SVGElement | undefined>;
  const svg = element.current;
  if (!svg) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx === null) return;

  const data = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    // Set canvas dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = "schedule.png";
    downloadLink.href = pngUrl;
    downloadLink.click();

    // Cleanup
    URL.revokeObjectURL(url);
  };

  img.src = url;
}
