import { Redirect, Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import React from "react";
import BottomNavigation from "@/shared/components/BottomNavigation";
import Appbar from "@/shared/components/Appbar";
import useAuth from "@/auth/useAuth";

export default function HomeLayout() {
  const { isAuthenticated } = useAuth();

  const routes = [
    {
      name: "home",
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
        header: (props) => <Appbar title={props.options.title ?? "Home"} />,
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
