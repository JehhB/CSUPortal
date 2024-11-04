import {
  EntryAnimationsValues,
  LayoutAnimation,
  withTiming,
} from "react-native-reanimated";

const FadeZoomIn = (values: EntryAnimationsValues): LayoutAnimation => {
  "worklet";
  const duration = 300;

  return {
    initialValues: {
      opacity: 0,
      transform: [{ scale: 0.2 }],
    },
    animations: {
      opacity: withTiming(1, { duration }),
      transform: [{ scale: withTiming(1, { duration }) }],
    },
  };
};

export default FadeZoomIn;
