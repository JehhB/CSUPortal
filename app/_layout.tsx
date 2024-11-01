import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { StyleSheet } from "react-native";
import {
  RopaSans_400Regular,
  RopaSans_400Regular_Italic,
} from "@expo-google-fonts/ropa-sans";
import { PlayfairDisplay_400Regular } from "@expo-google-fonts/playfair-display";
import { theme } from "@/constants/themes";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default function RootLayout() {
  const [loaded] = useFonts({
    RopaSans_400Regular,
    RopaSans_400Regular_Italic,
    PlayfairDisplay_400Regular,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
