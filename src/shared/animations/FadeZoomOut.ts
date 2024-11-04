import {
  ExitAnimationsValues,
  LayoutAnimation,
  withTiming,
} from "react-native-reanimated";

const FadeZoomOut = (values: ExitAnimationsValues): LayoutAnimation => {
  "worklet";

  const duration = 150;

  return {
    initialValues: {
      opacity: 1,
      transform: [{ scale: 1 }],
    },
    animations: {
      opacity: withTiming(0, { duration }),
      transform: [{ scale: withTiming(0.2, { duration }) }],
    },
  };
};

export default FadeZoomOut;
