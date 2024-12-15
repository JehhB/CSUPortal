import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import {
  RopaSans_400Regular,
  RopaSans_400Regular_Italic,
} from "@expo-google-fonts/ropa-sans";
import { PlayfairDisplay_400Regular } from "@expo-google-fonts/playfair-display";
import { theme } from "@/shared/constants/themes";
import QueryClientProvider from "@/queryClient/QueryClientProvider";

preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    RopaSans_400Regular,
    RopaSans_400Regular_Italic,
    PlayfairDisplay_400Regular,
  });

  useEffect(() => {
    if (loaded) {
      hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <QueryClientProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </PaperProvider>
  );
}
