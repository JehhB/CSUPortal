import { StyleProp, StyleSheet, TextStyle } from "react-native";
import {
  Snackbar as MaterialSnackbar,
  SnackbarProps as MaterialSnackbarProps,
  Text,
} from "react-native-paper";
import { VariantProp } from "react-native-paper/lib/typescript/components/Typography/types";
import { theme } from "../constants/themes";

export type SnackbarProps =
  | (Omit<MaterialSnackbarProps, "children"> & {
      content: string;
      contentStyle?: StyleProp<TextStyle>;
      contentVariant?: VariantProp<never> | undefined;
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

  return (
    <MaterialSnackbar
      action={{
        label: "Dismiss",
        labelStyle: styles.action,
        onPress: props.onDismiss,
      }}
      {...props}
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
