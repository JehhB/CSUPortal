import "react-native-svg";

declare module "react-native-svg" {
  interface TouchableProps {
    onClick?: TouchableProps["onPress"];
  }
}
