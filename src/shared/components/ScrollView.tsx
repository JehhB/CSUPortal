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
} from "react-native";
import { theme } from "../constants/themes";

export type ScrollViewProps = NativeScrollViewProps & {
  refreshing?: boolean;
  refreshColors?: ColorValue[];
  onRefresh?: () => void;
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
      containerStyle,
      children,
      ...scrollViewProps
    } = props;

    return (
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
        <View style={[styles.container, containerStyle]} children={children} />
      </NativeScrollView>
    );
  },
);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  container: {
    padding: 8,
    rowGap: 8,
  },
});

export default ScrollView;
