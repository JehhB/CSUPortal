import { theme } from "@/shared/constants/themes";
import { ReactNode, useCallback } from "react";
import { ColorValue } from "react-native";
import { Path, Rect } from "react-native-svg";

export type GridProps = {
  w: number;
  h: number;
  cols?: number;
  rows?: number;
  colWeight?: number[];
  rowWeight?: number[];
  x?: number;
  y?: number;
  outlineColor?: ColorValue;
  gridColor?: ColorValue;
  children?: ((grid: GridHandle) => ReactNode) | ReactNode;
};

export type GridHandle = {
  getRowDimension: (row: number) => GridDimension | null;
  getColDimension: (col: number) => GridDimension | null;
  getCellDimension: (row: number, col: number) => GridDimension | null;
};

type GridDimension = {
  x: number;
  y: number;
  w: number;
  h: number;
};

function getGridDefaults(props: GridProps): Required<GridProps> {
  return Object.assign(
    {
      cols: 1,
      rows: 1,
      colWeight: Array(props.cols ?? 1).fill(1),
      rowWeight: Array(props.rows ?? 1).fill(1),
      x: 0,
      y: 0,
      outlineColor: theme.colors.outline,
      gridColor: "#a8a29e",
      children: null,
    },
    props,
  );
}

const _ADD = (a: number, b: number) => a + b;

function getRowDimension(
  props: Required<
    Pick<GridProps, "x" | "y" | "h" | "w" | "rowWeight" | "rows">
  >,
  row: number,
  rowWeightTotal: number,
) {
  if (row >= props.rows) return null;

  const rowWeightBefore = props.rowWeight.reduce(
    (a, b, i) => (i < row ? a + b : a),
    0,
  );

  const rowUnitHeight = props.h / rowWeightTotal;

  return {
    x: props.x,
    y: props.y + rowWeightBefore * rowUnitHeight,
    w: props.w,
    h: rowUnitHeight * props.rowWeight[row],
  };
}

function getColDimension(
  props: Required<
    Pick<GridProps, "x" | "y" | "h" | "w" | "colWeight" | "cols">
  >,
  col: number,
  colWeightTotal: number,
) {
  if (col >= props.cols) return null;

  const colWeightBefore = props.colWeight.reduce(
    (a, b, i) => (i < col ? a + b : a),
    0,
  );

  const colUnitWidth = props.w / colWeightTotal;

  return {
    x: props.x + colUnitWidth * colWeightBefore,
    y: props.y,
    w: colUnitWidth * props.colWeight[col],
    h: props.h,
  };
}

function getCellDimension(
  rowDimension: GridDimension | null,
  colDimension: GridDimension | null,
) {
  if (rowDimension === null || colDimension === null) return null;

  return {
    x: colDimension.x,
    y: rowDimension.y,
    w: colDimension.w,
    h: rowDimension.h,
  };
}

export default function Grid(_props: GridProps) {
  const props = getGridDefaults(_props);
  const {
    w,
    h,
    x,
    y,
    gridColor,
    outlineColor,
    children,
    rows,
    cols,
    rowWeight,
    colWeight,
  } = props;

  if (rows !== rowWeight.length)
    throw new Error("Number of row doesn't match length of weights");
  if (cols !== colWeight.length)
    throw new Error("Number of col doesn't match length of weights");

  const rowWeightTotal = rowWeight.reduce(_ADD);
  const colWeightTotal = colWeight.reduce(_ADD);

  const _getRowDimension = useCallback(
    (row: number) => {
      const rowProps = { w, h, x, y, rows, rowWeight };
      return getRowDimension(rowProps, row, rowWeightTotal);
    },
    [w, h, x, y, rows, rowWeight, rowWeightTotal],
  );
  const _getColDimension = useCallback(
    (col: number) => {
      const colProps = { w, h, x, y, cols, colWeight };
      return getColDimension(colProps, col, colWeightTotal);
    },
    [w, h, x, y, cols, colWeight, colWeightTotal],
  );
  const _getCellDimension = useCallback(
    (row: number, col: number) => {
      const rowDim = _getRowDimension(row);
      const colDim = _getColDimension(col);
      return getCellDimension(rowDim, colDim);
    },
    [_getRowDimension, _getColDimension],
  );

  const gridHandle: GridHandle = {
    getRowDimension: _getRowDimension,
    getColDimension: _getColDimension,
    getCellDimension: _getCellDimension,
  };

  let path = "";

  const unitWidth = w / colWeightTotal;
  let colX = x;
  for (let i = 0; i < cols - 1; ++i) {
    colX += unitWidth * colWeight[i];
    path += `M ${colX} ${y} L ${colX} ${y + h} `;
  }

  const unitHeight = h / rowWeightTotal;
  let rowY = y;
  for (let i = 0; i < rows - 1; ++i) {
    rowY += unitHeight * rowWeight[i];
    path += `M ${x} ${rowY} L ${x + w} ${rowY} `;
  }

  return (
    <>
      <Path d={path} fill="transparent" stroke={gridColor} />
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="transparent"
        stroke={outlineColor}
        strokeWidth={1.5}
      />
      {typeof children === "function" ? children(gridHandle) : children}
    </>
  );
}
