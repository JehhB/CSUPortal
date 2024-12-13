import { Platform } from "react-native";
import {
  MD3Theme,
  configureFonts,
  MD3LightTheme as defaultTheme,
} from "react-native-paper";

export const RopaSansRegular = Platform.select({
  web: '"RopaSans_400Regular", sans-serif',
  android: "RopaSans_400Regular",
  ios: "RopaSans-Regular",
});

export const RopaSansRegularItalic = Platform.select({
  web: '"RopaSans_400Regular_Italic", sans-serif',
  android: "RopaSans_400Regular_Italic",
  ios: "RopaSans-Italic",
});

export const PlayfairDisplayRegular = Platform.select({
  web: '"PlayfairDisplay_400Regular", serif',
  android: "PlayfairDisplay_400Regular",
  ios: "PlayfairDisplay-Regular",
});

export const RobotoRegular = Platform.select({
  web: '"Roboto_400Regular", "roboto", sans-serif"',
  android: "Roboto_400Regular",
  ios: "Roboto-Regular",
});
export const RobotoMedium = Platform.select({
  web: '"Roboto_500Medium", "roboto", sans-serif"',
  android: "Roboto_500Medium",
  ios: "Roboto-Medium",
});

export const fontConfig = configureFonts({
  config: {
    displayLarge: { fontFamily: PlayfairDisplayRegular },
    displayMedium: { fontFamily: PlayfairDisplayRegular },
    displaySmall: { fontFamily: PlayfairDisplayRegular },

    headlineLarge: { fontFamily: RopaSansRegular },
    headlineMedium: { fontFamily: RopaSansRegular },
    headlineSmall: { fontFamily: RopaSansRegularItalic },

    titleLarge: { fontFamily: RopaSansRegularItalic },
    titleMedium: { fontFamily: RopaSansRegular },
    titleSmall: { fontFamily: RopaSansRegular },

    labelLarge: { fontFamily: RopaSansRegular },
    labelMedium: { fontFamily: RopaSansRegular },
    labelSmall: { fontFamily: RopaSansRegular },
  },
});

export const theme: MD3Theme = {
  ...defaultTheme,
  roundness: 4,
  colors: {
    ...defaultTheme.colors,

    primary: "#450a0a",
    primaryContainer: "#450a0a",
    onPrimary: "#fde047",
    onPrimaryContainer: "#fde047",

    secondary: "#fbff95",
    secondaryContainer: "#fbff95",
    onSecondary: "#450a0a",
    onSecondaryContainer: "#450a0a",

    tertiary: "#75bdec",
    tertiaryContainer: "#75bdec",
    onTertiary: "#4B201F",
    onTertiaryContainer: "#4B201F",

    surface: "#feffe5",
    onSurface: "#0c0a09",

    surfaceVariant: "#450a0a",
    surfaceDisabled: "#572318",
    onSurfaceDisabled: "#a8a29e",

    background: "#ffffff",
    error: "#7f1d1d",
    errorContainer: "#7f1d1d",

    outline: "#1c1917",
    outlineVariant: "#a8a29e",

    elevation: {
      level0: "#fffffe",
      level1: "#fffff5",
      level2: "#fffeeb",
      level3: "#fffee2",
      level4: "#fffed8",
      level5: "#fffdcf",
    },

    /*
    onSurfaceVariant: string,
    onError: string,
    onErrorContainer: string,
    onBackground: string,
    outline: string,
    outlineVariant: string,
    inverseSurface: string,
    inverseOnSurface: string,
    inversePrimary: string,
    shadow: string,
    scrim: string,
    backdrop: string,
    elevation: MD3ElevationColors,
    */
  },
  fonts: fontConfig,
};
