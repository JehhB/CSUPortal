import { MD3Theme, MD3LightTheme as defaultTheme } from "react-native-paper";

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
};
