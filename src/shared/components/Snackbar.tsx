import { StyleProp, StyleSheet, TextStyle } from "react-native";
import {
  Snackbar as MaterialSnackbar,
  SnackbarProps as MaterialSnackbarProps,
  Text,
} from "react-native-paper";
import { VariantProp } from "react-native-paper/lib/typescript/components/Typography/types";
import { theme } from "../constants/themes";
import { useMemo } from "react";

type NotUndefined<T> = T extends undefined ? never : T;
type ActionType = NotUndefined<MaterialSnackbarProps["action"]>;

export type SnackbarProps =
  | (Omit<MaterialSnackbarProps, "children" | "action"> & {
      content: string;
      contentStyle?: StyleProp<TextStyle>;
      contentVariant?: VariantProp<never> | undefined;
      action?: ActionType | ((def: ActionType) => ActionType);
    })
  | MaterialSnackbarProps;

export default function Snackbar(props: SnackbarProps) {
  const children =
    "children" in props ? (
      props.children
    ) : (
      <Text
        variant={props.contentVariant ?? "labelLarge"}
        style={[styles.content, props.contentStyle]}
      >
        {props.content}
      </Text>
    );

  const defaultAction: ActionType = useMemo(
    () => ({
      label: "Dismiss",
      labelStyle: styles.action,
      onPress: props.onDismiss,
    }),
    [props.onDismiss],
  );

  const action = useMemo(() => {
    if (props.action === undefined) return defaultAction;
    if (typeof props.action !== "function") return props.action;
    return props.action(defaultAction);
  }, [props.action, defaultAction]);

  return (
    <MaterialSnackbar
      {...props}
      action={action}
      style={[styles.snackbar, props.style]}
      children={children}
    />
  );
}

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: theme.colors.error,
  },
  content: {
    color: "#FFFFFF",
  },
  action: {
    color: theme.colors.secondary,
  },
});
