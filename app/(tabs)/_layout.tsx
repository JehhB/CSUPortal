import { Redirect, Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import React from "react";
import Appbar from "@/shared/components/Appbar";
import BottomNavigation from "@/shared/components/BottomNavigation";
import useAuth from "@/auth/useAuth";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

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
      name: "grades",
      title: "Grades",
      focusedIcon: "format-list-bulleted-square",
      unfocusedIcon: "format-list-checkbox",
    },
  ];

  if (!isAuthenticated) return <Redirect href="/signin" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: (props) => <Appbar {...props} />,
      }}
      tabBar={BottomNavigation}
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
