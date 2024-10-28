import { Tabs } from "expo-router";
import { BottomNavigation, Icon, Text } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import { theme } from "@/constants/themes";
import Appbar from "@/components/Appbar";

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

export default function TabLayout() {
  const iconSize = 24;

  const routes = [
    {
      name: "index",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      name: "schedule",
      title: "Schedule",
      focusedIcon: "clock",
      unfocusedIcon: "clock-outline",
    },
    {
      name: "checklist",
      title: "Checklist",
      focusedIcon: "format-list-bulleted-square",
      unfocusedIcon: "format-list-checkbox",
    },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: ({ route, options }) => (
          <Appbar route={route} options={options} />
        ),
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
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
      )}
    >
      {routes.map((route) => (
        <Tabs.Screen
          key={route.name}
          name={route.name}
          options={{
            title: route.title,
            tabBarIcon: ({ color, focused, size }) => (
              <Icon
                source={focused ? route.focusedIcon : route.unfocusedIcon}
                color={color}
                size={size}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
