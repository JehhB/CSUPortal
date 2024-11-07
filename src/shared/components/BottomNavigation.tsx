import { CommonActions } from "@react-navigation/native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation as MaterialBottomNavigation,
  Text,
} from "react-native-paper";
import { theme } from "@/shared/constants/themes";
import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  activeIndicator: {
    opacity: 0.1,
    backgroundColor: theme.colors.surface,
  },
  bottomNavigationBar: {
    backgroundColor: theme.colors.primary,
  },
  tabLabels: {
    alignSelf: "center",
    color: theme.colors.surface,
  },
  tabLabelsFocused: {
    color: theme.colors.secondary,
  },
});

export default function BottomNavigation({
  navigation,
  descriptors,
  state,
  insets,
}: BottomTabBarProps) {
  const iconSize = 24;

  return (
    <MaterialBottomNavigation.Bar
      shifting={false}
      compact={true}
      navigationState={state}
      safeAreaInsets={insets}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          });
        }
      }}
      onTabLongPress={({ route }) => {
        navigation.emit({
          type: "tabLongPress",
          target: route.key,
        });
      }}
      renderLabel={({ route, focused }) => {
        const { options } = descriptors[route.key];
        return (
          <Text
            variant="labelMedium"
            style={[style.tabLabels, focused ? style.tabLabelsFocused : {}]}
          >
            {options.title ?? route.key}
          </Text>
        );
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];
        if (options.tabBarIcon) {
          return options.tabBarIcon({
            focused,
            color: focused ? theme.colors.secondary : theme.colors.surface,
            size: iconSize,
          });
        }

        return null;
      }}
      getLabelText={({ route }) => {
        const { options } = descriptors[route.key];
        return options.title;
      }}
      style={style.bottomNavigationBar}
      activeIndicatorStyle={style.activeIndicator}
    />
  );
}
