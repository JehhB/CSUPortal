import { theme } from "@/shared/constants/themes";
import { ReactNode, useCallback, useMemo } from "react";
import { Path, CommonPathProps } from "react-native-svg";

export type GridProps = {
  w: number;
  h: number;
  cols?: number;
  rows?: number;
  colWeight?: number[];
  rowWeight?: number[];
  x?: number;
  y?: number;
  insets?: number | [number, number] | [number, number, number, number];
  outlineProps?: CommonPathProps;
  gridProps?: CommonPathProps;
  pathProps?: CommonPathProps;
  children?: ((grid: GridHandle) => ReactNode) | ReactNode;
};

export type GridHandle = {
  getRowDimension: (row: number) => GridDimension | null;
  getColDimension: (col: number) => GridDimension | null;
  getCellDimension: (row: number, col: number) => GridDimension | null;
  getUnitDimension: (x: number, y: number) => GridDimension | null;
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
      pathProps: {},
      outlineProps: {},
      gridProps: {},
      children: null,
      insets: 0,
    },
    props,
  );
}

const _ADD = (a: number, b: number) => a + b;

function getUnitDimension(
  props: Required<Pick<GridProps, "x" | "y" | "h" | "w">>,
  pos: [x: number, y: number],
  rowWeightTotal: number,
  colWeightTotal: number,
) {
  const [x, y] = pos;
  if (y > rowWeightTotal) return null;
  if (x > colWeightTotal) return null;

  const unitWidth = props.w / colWeightTotal;
  const unitHeight = props.h / rowWeightTotal;

  const startX = unitWidth * x + props.x;
  const startY = unitHeight * y + props.y;

  return {
    x: startX,
    y: startY,
    w: unitWidth,
    h: unitHeight,
  };
}

function getRowDimension(
  props: Required<
    Pick<GridProps, "x" | "y" | "h" | "w" | "rowWeight" | "rows">
  >,
  row: number,
  rowWeightTotal: number,
) {
  if (row > props.rows) return null;

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
  if (col > props.cols) return null;

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
    pathProps,
    gridProps,
    outlineProps,
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

  const rowWeightTotal = useMemo(() => rowWeight.reduce(_ADD), [rowWeight]);
  const colWeightTotal = useMemo(() => colWeight.reduce(_ADD), [colWeight]);

  const _getUnitDimension = useCallback(
    (_x: number, _y: number) => {
      const props = { w, h, x, y };
      return getUnitDimension(props, [_x, _y], rowWeightTotal, colWeightTotal);
    },
    [w, h, x, y, rowWeightTotal, colWeightTotal],
  );
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

  const gridHandle: GridHandle = useMemo(
    () => ({
      getRowDimension: _getRowDimension,
      getColDimension: _getColDimension,
      getCellDimension: _getCellDimension,
      getUnitDimension: _getUnitDimension,
    }),
    [_getColDimension, _getRowDimension, _getCellDimension, _getUnitDimension],
  );

  const insets = useMemo((): [
    top: number,
    right: number,
    bottom: number,
    left: number,
  ] => {
    const i = props.insets;
    if (typeof i === "number") return [i, i, i, i];
    if (i.length === 2) return [i[0], i[1], i[0], i[1]];
    return i;
  }, [props.insets]);

  const gridPath = useMemo(() => {
    let path = "";

    const unitWidth = w / colWeightTotal;
    let colX = x;
    for (let i = 0; i < cols - 1; ++i) {
      colX += unitWidth * colWeight[i];
      path += `M ${colX} ${y + insets[0]} L ${colX} ${y + h - insets[2]} `;
    }

    const unitHeight = h / rowWeightTotal;
    let rowY = y;
    for (let i = 0; i < rows - 1; ++i) {
      rowY += unitHeight * rowWeight[i];
      path += `M ${x + insets[3]} ${rowY} L ${x + w - insets[1]} ${rowY} `;
    }
    return path;
  }, [
    w,
    h,
    x,
    y,
    colWeightTotal,
    rowWeightTotal,
    colWeight,
    rowWeight,
    rows,
    cols,
    insets,
  ]);

  const outlinePath = useMemo(() => {
    return `
    M ${x + insets[3]} ${y} L ${x + w - insets[1]} ${y}
    M ${x + insets[3]} ${y + h} L ${x + w - insets[1]} ${y + h}
    M ${x} ${y + insets[0]} L ${x} ${y + h - insets[2]}
    M ${x + w} ${y + insets[0]} L ${x + w} ${y + h - insets[2]}
    `;
  }, [x, y, h, w, insets]);

  return (
    <>
      <Path
        d={gridPath}
        fill="transparent"
        stroke={theme.colors.outlineVariant}
        {...pathProps}
        {...gridProps}
      />
      <Path
        d={outlinePath}
        fill="transparent"
        stroke={theme.colors.outline}
        {...pathProps}
        {...outlineProps}
      />
      {typeof children === "function" ? children(gridHandle) : children}
    </>
  );
}
