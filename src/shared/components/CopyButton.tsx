import { useCallback } from "react";
import { TextInput, TextInputIconProps } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { theme } from "../constants/themes";

export type CopyButtonProps = Partial<TextInputIconProps> & {
  value?: string;
};

export default function CopyButton(props: CopyButtonProps) {
  const { value, ...iconButtonProps } = props;

  const copy = useCallback(() => {
    if (value === undefined) return;
    Clipboard.setStringAsync(value);
  }, [value]);

  return (
    <TextInput.Icon
      icon="content-copy"
      size={20}
      color={theme.colors.primary}
      {...iconButtonProps}
      onPress={(e) => {
        if (iconButtonProps.onPress) iconButtonProps.onPress(e);
        if (!e.defaultPrevented) copy();
      }}
    />
  );
}
