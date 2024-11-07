import { forwardRef } from "react";
import {
  ColorValue,
  RefreshControl,
  ScrollView as NativeScrollView,
  ScrollViewProps as NativeScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Platform,
} from "react-native";
import { theme } from "../constants/themes";
import Animated, { FadeOut, StretchInX } from "react-native-reanimated";

export type ScrollViewProps = NativeScrollViewProps & {
  refreshing?: boolean;
  refreshColors?: ColorValue[];
  onRefresh?: () => void;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const ScrollView = forwardRef<NativeScrollView, ScrollViewProps>(
  (props, ref) => {
    const refreshing = props.refreshing ?? false;
    const refreshColors = props.refreshColors ?? [
      theme.colors.primary,
      theme.colors.secondary,
    ];

    const {
      refreshColors: _,
      onRefresh,
      wrapperStyle,
      containerStyle,
      children,
      ...scrollViewProps
    } = props;

    return (
      <View style={[styles.wrapper, styles.wrapper]}>
        {Platform.OS === "web" && refreshing && (
          <Animated.View
            style={[styles.progress]}
            entering={StretchInX.duration(10000)}
            exiting={FadeOut}
          />
        )}
        <NativeScrollView
          ref={ref}
          refreshControl={
            <RefreshControl
              colors={refreshColors}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          {...scrollViewProps}
          style={[styles.scrollView, props.style]}
        >
          <View
            style={[styles.container, containerStyle]}
            children={children}
          />
        </NativeScrollView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  progress: {
    position: "absolute",
    transformOrigin: "left center",
    top: 0,
    right: 0,
    left: 0,
    height: 4,
    backgroundColor: theme.colors.tertiary,
  },
  scrollView: {
    flex: 1,
    maxWidth: 500,
  },
  container: {
    padding: 8,
    rowGap: 8,
  },
});

export default ScrollView;
