import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  TextInput as MaterialTextInput,
  TextInputProps,
} from "react-native-paper";
import { TextInput as NativeTextInput } from "react-native";
import { RopaSansRegular, theme } from "../constants/themes";
import color from "color";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  underlineStyle: {
    height: 1,
  },
});

const TextInput = forwardRef<NativeTextInput, TextInputProps>((props, ref) => {
  return (
    <MaterialTextInput
      ref={ref}
      dense
      mode="flat"
      theme={{
        colors: {
          surfaceVariant: color(theme.colors.primary).alpha(0.05).string(),
          placeholder: theme.colors.outline,
        },
        fonts: {
          bodyLarge: {
            fontFamily: RopaSansRegular,
            fontWeight: "400",
          },
        },
      }}
      underlineColor={theme.colors.outline}
      underlineStyle={[styles.underlineStyle, props.underlineStyle]}
      activeUnderlineColor={theme.colors.primary}
      {...props}
    />
  );
});

export default TextInput;
