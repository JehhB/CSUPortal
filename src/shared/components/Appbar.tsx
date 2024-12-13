import {
  Appbar as MaterialAppbar,
  Menu,
  IconButton,
  Text,
  Icon,
  Divider,
  Avatar,
  TouchableRipple,
} from "react-native-paper";
import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/shared/constants/themes";
import { useState } from "react";
import useAuth from "@/auth/useAuth";
import { router } from "expo-router";
import useStudentPictures from "@/student/profile/useStudentPictures";
import useStudentMsAccount from "@/student/profile/useStudentMSAccount";

export default function Appbar({
  title,
  canGoBack,
}: {
  title: string;
  canGoBack?: boolean;
}) {
  const { accessToken, logout } = useAuth();
  const { picturesQuery } = useStudentPictures(accessToken);

  const [visible, setVisible] = useState(false);
  const topInset = useSafeAreaInsets();
  const { msAccountQuery } = useStudentMsAccount(accessToken);

  const menuItems: (
    | { title: string; icon: string; onPress: () => void; disabled?: boolean }
    | { divider: true; disabled?: boolean }
  )[] = [
    {
      title: "Microsoft account",
      icon: "email-outline",
      onPress: () => {
        router.navigate("/profile/ms-account");
      },
      disabled: msAccountQuery.data === null,
    },
    {
      title: "Change password",
      icon: "account-edit-outline",
      onPress: () => {
        router.navigate("/profile/change-password");
      },
    },
    {
      divider: true,
    },
    {
      title: "Digital ID",
      icon: "badge-account-outline",
      onPress: () => {
        router.navigate("/profile/digital-id");
      },
    },
    {
      title: "ID Scanner",
      icon: "qrcode-scan",
      onPress: () => {
        router.navigate("/profile/to-be-implemented");
      },
    },
    {
      divider: true,
    },
    {
      title: "Logout",
      icon: "logout",
      onPress: logout,
    },
  ];

  return (
    <MaterialAppbar.Header style={styles.appBar}>
      {canGoBack === true ? (
        <MaterialAppbar.BackAction
          color={theme.colors.surface}
          style={styles.back}
          onPress={() =>
            router.canGoBack() ? router.back() : router.navigate("/home")
          }
        />
      ) : (
        <Image
          source={require("@@/assets/images/icon.png")}
          contentFit="cover"
          style={styles.logo}
        />
      )}
      <MaterialAppbar.Content
        title={
          <Text variant="headlineSmall" style={styles.appBarContent}>
            {title}
          </Text>
        }
      />
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        statusBarHeight={topInset.top}
        anchor={
          picturesQuery.data && picturesQuery.data.profpic ? (
            <TouchableRipple onPress={() => setVisible(true)}>
              <Avatar.Image
                source={{ uri: picturesQuery.data.profpic }}
                size={36}
              />
            </TouchableRipple>
          ) : (
            <IconButton
              icon="account"
              onPress={() => setVisible(true)}
              style={styles.profileButton}
              size={36}
              iconColor={theme.colors.primary}
            />
          )
        }
      >
        {menuItems
          .filter((i) => !("disabled" in i && i.disabled))
          .map((item, index) =>
            "divider" in item ? (
              <Divider key={index} />
            ) : (
              <Menu.Item
                key={index}
                dense
                onPress={() => {
                  setVisible(false);
                  item.onPress();
                }}
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

const styles = StyleSheet.create({
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
  back: {
    backgroundColor: "transparent",
  },
});
