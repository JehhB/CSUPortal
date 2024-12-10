import { forwardRef, useState } from "react";
import { TextInput as NativeTextInput, StyleSheet } from "react-native";
import TextInput from "./TextInput";
import {
  TextInput as MaterialTextInput,
  TextInputProps,
} from "react-native-paper";
import { theme } from "../constants/themes";

const PasswordInput = forwardRef<NativeTextInput, TextInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const secureTextEntry = !showPassword || props.secureTextEntry;

    return (
      <TextInput
        ref={ref}
        secureTextEntry={secureTextEntry}
        right={
          <MaterialTextInput.Icon
            style={styles.eye}
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
  eye: {
    backgroundColor: "transparent",
  },
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
