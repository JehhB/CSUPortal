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
  contentStyle?: StyleProp<ViewStyle>;
};

const ScrollView = forwardRef<NativeScrollView, ScrollViewProps>(
  (props, ref) => {
    const {
      refreshing = false,
      refreshColors = [theme.colors.primary, theme.colors.secondary],
      onRefresh,
      wrapperStyle,
      contentStyle,
      children,
      style,
      ...scrollViewProps
    } = props;

    return (
      <NativeScrollView
        ref={ref}
        style={[styles.scrollView, style]}
        contentContainerStyle={[styles.wrapper, wrapperStyle]}
        refreshControl={
          <RefreshControl
            colors={refreshColors}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        {...scrollViewProps}
      >
        {Platform.OS === "web" && refreshing && (
          <Animated.View
            style={[styles.progress]}
            entering={StretchInX.duration(10000)}
            exiting={FadeOut}
          />
        )}
        <View style={[styles.container]}>
          <View style={[styles.content, contentStyle]} children={children} />
        </View>
      </NativeScrollView>
    );
  },
);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
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
  container: {
    flex: 1,
    maxWidth: 500,
  },
  content: {
    padding: 8,
    rowGap: 8,
  },
});

ScrollView.displayName = "ScrollView";

export default ScrollView;
