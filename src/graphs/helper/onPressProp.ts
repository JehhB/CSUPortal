import { Platform } from "react-native";
import { TouchableProps } from "react-native-svg";

export default function onPressProp(
  onPress: TouchableProps["onPress"],
): TouchableProps {
  if (Platform.OS === "web") return { onClick: onPress };
  return { onPress };
}
