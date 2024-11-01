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

export const fontConfig = configureFonts({
  config: {
    displayLarge: { fontFamily: PlayfairDisplayRegular },
    displayMedium: { fontFamily: PlayfairDisplayRegular },
    displaySmall: { fontFamily: PlayfairDisplayRegular },

    headlineLarge: { fontFamily: RopaSansRegular },
    headlineMedium: { fontFamily: RopaSansRegular },
    headlineSmall: { fontFamily: RopaSansRegularItalic },

    titleLarge: { fontFamily: RopaSansRegular },
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
    onSurface: "#4B201F",

    surfaceVariant: "#450a0a",
    surfaceDisabled: "#f0f0eb",

    background: "#fffff5",
    error: "#7f1d1d",
    errorContainer: "#7f1d1d",

    outline: "#4B201F",
    outlineVariant: "#4B201F",

    /*
    onSurface: string,
    onSurfaceVariant: string,
    onSurfaceDisabled: string,
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
