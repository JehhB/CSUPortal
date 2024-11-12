import React, { FunctionComponent } from "react";
import { StyleSheet } from "react-native";
import {
  Dialog as MaterialDialog,
  DialogProps as MaterialDialogProps,
} from "react-native-paper";

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
  },
});

export default Dialog;
