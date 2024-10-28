import { Appbar as MaterialAppbar, Menu, IconButton } from "react-native-paper";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RouteProp, ParamListBase } from "@react-navigation/native";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { theme } from "@/constants/themes";
import { useState } from "react";

export type AppbarProp = {
  route: RouteProp<ParamListBase>;
  options: BottomTabNavigationOptions;
};

const style = StyleSheet.create({
  appBar: {
    backgroundColor: theme.colors.primary,
  },
  appBarContent: {
    color: theme.colors.surface,
  },
  logo: {
    width: 48,
    height: 48,
    marginEnd: 8,
  },
  profileButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surface,
  },
});

export default function Appbar({ route, options }: AppbarProp) {
  const [visible, setVisible] = useState(false);
  const topInset = useSafeAreaInsets();

  return (
    <MaterialAppbar.Header style={style.appBar}>
      <Image
        source={require("@/assets/images/icon.png")}
        contentFit="cover"
        style={style.logo}
      />
      <MaterialAppbar.Content
        title={options.title ?? route.name}
        titleStyle={style.appBarContent}
      />
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        statusBarHeight={topInset.top + 64}
        anchor={
          <IconButton
            icon="account"
            onPress={() => setVisible(true)}
            style={style.profileButton}
            size={36}
            iconColor={theme.colors.primary}
          />
        }
      >
        <Menu.Item dense onPress={() => {}} title="Profile" />
        <Menu.Item dense onPress={() => {}} title="Settings" />
        <Menu.Item dense onPress={() => {}} title="Logout" />
      </Menu>
    </MaterialAppbar.Header>
  );
}
