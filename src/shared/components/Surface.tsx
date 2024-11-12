import React, { forwardRef } from "react";
import { Surface as MaterialSurface, SurfaceProps } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { theme } from "../constants/themes";

const styles = StyleSheet.create({
  surface: {
    backgroundColor: theme.colors.elevation.level1,
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
