import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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

export type ScrollViewHandle = Pick<
  NativeScrollView,
  | "scrollTo"
  | "scrollToEnd"
  | "flashScrollIndicators"
  | "getScrollResponder"
  | "getScrollableNode"
> & {
  isRefreshing: boolean;
  startRefreshing: () => void;
  endRefreshing: () => void;
};

export type ScrollViewProps = NativeScrollViewProps & {
  refreshColors?: ColorValue[];
  onRefresh?: (value: {
    isRefreshing: boolean;
    startRefreshing: () => void;
    endRefreshing: () => void;
  }) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

const ScrollView = forwardRef<ScrollViewHandle, ScrollViewProps>(
  (props, ref) => {
    const [isRefreshing, setRefreshing] = useState(false);
    const root = useRef<NativeScrollView | null>(null);

    const startRefreshing = () => setRefreshing(true);
    const endRefreshing = () => setRefreshing(false);

    const onRefresh = useCallback(() => {
      if (props.onRefresh)
        props.onRefresh({
          isRefreshing,
          startRefreshing,
          endRefreshing,
        });
    }, [isRefreshing, props.onRefresh]);

    useImperativeHandle(
      ref,
      () => ({
        scrollTo: (y, x, animated) => root.current!.scrollTo(y, x, animated),
        scrollToEnd: (options) => root.current!.scrollToEnd(options),
        flashScrollIndicators: () => root.current!.flashScrollIndicators(),
        getScrollResponder: () => root.current!.getScrollResponder(),
        getScrollableNode: () => root.current!.getScrollableNode(),
        isRefreshing,
        startRefreshing,
        endRefreshing,
      }),
      [isRefreshing],
    );

    const refreshColors = props.refreshColors ?? [
      theme.colors.primary,
      theme.colors.secondary,
    ];

    const {
      refreshColors: _refreshColors,
      onRefresh: _onRefresh,
      containerStyle,
      children,
      ...scrollViewProps
    } = props;

    return (
      <NativeScrollView
        ref={root}
        refreshControl={
          props.onRefresh ? (
            <RefreshControl
              colors={refreshColors}
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          ) : undefined
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
    padding: 16,
    rowGap: 16,
  },
});

export default ScrollView;
