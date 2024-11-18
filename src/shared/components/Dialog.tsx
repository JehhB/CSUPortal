import React from "react";
import { StyleSheet } from "react-native";
import {
  Dialog as MaterialDialog,
  DialogProps as MaterialDialogProps,
} from "react-native-paper";
import { theme } from "../constants/themes";

const Dialog = (props: MaterialDialogProps) => {
  return <MaterialDialog {...props} style={[styles.dialog, props.style]} />;
};

Dialog.Actions = MaterialDialog.Actions;
Dialog.Content = MaterialDialog.Content;
Dialog.Icon = MaterialDialog.Icon;
Dialog.ScrollArea = MaterialDialog.ScrollArea;
Dialog.Title = MaterialDialog.Title;

const styles = StyleSheet.create({
  dialog: {
    alignSelf: "center",
    width: "95%",
    maxWidth: 500,
    borderRadius: theme.roundness * 2,
    backgroundColor: theme.colors.elevation.level2,
  },
});

export default Dialog;
