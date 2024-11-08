export type ArcDef = {
  cx?: number;
  cy?: number;
  r?: number;
  angleStart?: number;
  angleEnd?: number;
  winding?: "clockwise" | "anticlockwise";
};

export default function createArcPath(def: ArcDef) {
  "worklet";

  const {
    cx = 0,
    cy = 0,
    r = 0,
    angleStart = 0,
    angleEnd = 0,
    winding = "clockwise",
  } = def;

  const startRad = (angleStart * Math.PI) / 180;
  const endRad = (angleEnd * Math.PI) / 180;

  const sx = cx + r * Math.cos(startRad);
  const sy = cy + r * Math.sin(startRad);
  const ex = cx + r * Math.cos(endRad);
  const ey = cy + r * Math.sin(endRad);

  const largeArcFlag = Math.abs(angleEnd - angleStart) <= 180 ? 0 : 1;
  const sweepFlag = winding === "clockwise" ? 1 : 0;

  const path = `M ${sx} ${sy} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${ex} ${ey}`;
  return path;
}
