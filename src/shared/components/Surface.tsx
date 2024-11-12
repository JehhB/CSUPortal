import React, { forwardRef } from "react";
import { Surface as MaterialSurface, SurfaceProps } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { theme } from "../constants/themes";
import color from "color";

const styles = StyleSheet.create({
  surface: {
    backgroundColor: color(theme.colors.surface)
      .mix(color(theme.colors.background), 0.7)
      .string(),
    borderRadius: theme.roundness,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.outline,
  },
});

const Surface = forwardRef<View, SurfaceProps>((props, ref) => {
  return (
    <MaterialSurface
      ref={ref}
      mode="flat"
      {...props}
      style={[styles.surface, props.style]}
    />
  );
});

Surface.displayName = "Surface";

export default Surface;
