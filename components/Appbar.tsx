import {
  Appbar as MaterialAppbar,
  Menu,
  IconButton,
  Text,
  Icon,
  Divider,
} from "react-native-paper";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { theme } from "@/constants/themes";
import { useState } from "react";
import { Options } from "react-native/Libraries/Utilities/codegenNativeCommands";

const style = StyleSheet.create({
  appBar: {
    backgroundColor: theme.colors.primary,
  },
  appBarContent: {
    color: theme.colors.surface,
    textTransform: "capitalize",
  },
  menu: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.onSurface,
    borderStyle: "solid",
    borderWidth: 1,
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

export default function Appbar({
  route,
  options,
}: Partial<BottomTabHeaderProps>) {
  const [visible, setVisible] = useState(false);
  const topInset = useSafeAreaInsets();

  const menuItems = [
    {
      route: "/profile",
      title: "Profile",
      icon: "account-outline",
    },
    {
      route: "/ms-account",
      title: "Microsoft account",
      icon: "email-outline",
    },
    {
      divider: true,
    },
    {
      route: "/enrollment",
      title: "Enrollment",
      icon: "account-details-outline",
    },
    {
      route: "/change-password",
      title: "Change password",
      icon: "account-edit-outline",
    },
    {
      divider: true,
    },
    {
      route: "/logout",
      title: "Logout",
      icon: "logout",
    },
  ];

  return (
    <MaterialAppbar.Header style={style.appBar}>
      <Image
        source={require("@/assets/images/icon.png")}
        contentFit="cover"
        style={style.logo}
      />
      <MaterialAppbar.Content
        title={
          <Text variant="headlineSmall" style={style.appBarContent}>
            {options?.title ?? route?.name ?? "Portal"}
          </Text>
        }
      />
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        statusBarHeight={topInset.top}
        contentStyle={style.menu}
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
        {menuItems.map((item, index) =>
          item.divider === true ? (
            <Divider key={index} />
          ) : (
            <Menu.Item
              key={index}
              dense
              onPress={() => {}}
              title={item.title}
              titleStyle={theme.fonts.titleMedium}
              leadingIcon={({ size }) => (
                <Icon
                  source={item.icon}
                  size={size}
                  color={theme.colors.primary}
                />
              )}
            />
          ),
        )}
      </Menu>
    </MaterialAppbar.Header>
  );
}
