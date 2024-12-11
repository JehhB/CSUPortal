import { forwardRef, useState } from "react";
import { TextInput as NativeTextInput, StyleSheet } from "react-native";
import TextInput from "./TextInput";
import { TextInputProps } from "react-native-paper";
import { theme } from "../constants/themes";
import common from "@/shared/constants/common";

const PasswordInput = forwardRef<NativeTextInput, TextInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const secureTextEntry = !showPassword || props.secureTextEntry;

    return (
      <TextInput
        autoCapitalize="none"
        ref={ref}
        secureTextEntry={secureTextEntry}
        right={
          <TextInput.Icon
            style={styles.bgTransparent}
            size={20}
            icon={secureTextEntry ? "eye" : "eye-off"}
            color={theme.colors.onSurfaceVariant}
            onPress={() => {
              setShowPassword((s) => !s);
            }}
          />
        }
        {...props}
      />
    );
  },
);

const styles = StyleSheet.create({
  ...common,
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
