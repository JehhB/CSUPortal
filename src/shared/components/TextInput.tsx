import React, { forwardRef } from "react";
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
      activeUnderlineColor={theme.colors.primary}
      {...props}
      underlineStyle={[styles.underlineStyle, props.underlineStyle]}
    />
  );
}) as typeof MaterialTextInput;

TextInput.displayName = "TextInput";
TextInput.Icon = MaterialTextInput.Icon;
TextInput.Affix = MaterialTextInput.Affix;

export default TextInput;
