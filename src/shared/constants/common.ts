import { StyleSheet } from "react-native";
import { RopaSansRegularItalic, theme } from "./themes";

const common = StyleSheet.create({
  textAlignCenter: {
    textAlign: "center",
  },
  hint: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: RopaSansRegularItalic,
  },
  dataTableHeader: {
    color: "#0c0a0999",
  },
  dataTableShort: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 64,
  },
  dataTablePagination: {
    flexWrap: "nowrap",
  },
  dataTableRight: {
    justifyContent: "flex-end",
  },
  dataTableThickBorder: {
    borderBottomWidth: 2,
  },
  titles: {
    textAlign: "center",
    color: theme.colors.primary,
    marginBottom: 8,
  },
  pointerEventNone: {
    pointerEvents: "none",
  },
  bgTransparent: {
    backgroundColor: "transparent",
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  colorSecondary: {
    color: theme.colors.secondary,
  },
  colorTertiary: {
    color: theme.colors.tertiary,
  },
  itemsCenter: {
    alignItems: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
});

export default common;
