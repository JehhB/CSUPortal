import { CameraView, CameraViewProps, useCameraPermissions } from "expo-camera";
import { StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { Defs, Mask, Rect, Svg } from "react-native-svg";
import { theme } from "../constants/themes";
import { useEffect } from "react";
import Dialog from "./Dialog";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export type CameraDialogProps = CameraViewProps & {
  title?: string;
  visible: boolean;
  onDismiss: () => void;
  error?: boolean;
  onDismissError?: () => void;
  success?: boolean;
  onDismissSuccess?: () => void;
};

const WIDTH = 100;
const HEIGHT = 100;
const SCANNER_SIZE = 80;
const CENTER_X = (WIDTH - SCANNER_SIZE) / 2;
const CENTER_Y = (HEIGHT - SCANNER_SIZE) / 2;
const BORDER_RADIUS = 8;

export default function CameraDialog(props: CameraDialogProps) {
  const {
    visible,
    onDismiss,
    title,
    error,
    onDismissError,
    success,
    onDismissSuccess,
    ...cameraProps
  } = props;
  const [permission, requestPermission] = useCameraPermissions();

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!error) return;
    translateX.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 25 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 25 }),
      ),
      2,
      false,
    );

    const timer = window.setTimeout(() => {
      if (onDismissError) onDismissError();
    }, 150);

    return () => window.clearTimeout(timer);
  }, [error, onDismissError, translateX]);

  useEffect(() => {
    if (!success) return;
    scale.value = withSequence(
      withTiming(1.05, { duration: 50 }),
      withTiming(1, { duration: 50 }),
    );

    const timer = window.setTimeout(() => {
      if (onDismissSuccess) onDismissSuccess();
    }, 150);

    return () => window.clearTimeout(timer);
  }, [success, onDismissSuccess, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { scale: scale.value }],
    };
  });

  return (
    <Dialog visible={visible}>
      <Dialog.Title>{title ?? "Camera"}</Dialog.Title>
      <Dialog.Content>
        {permission?.granted ? (
          <Animated.View style={[styles.wFull, animatedStyle]}>
            <CameraView
              active={visible}
              style={[styles.camera, styles.wFull]}
              facing="back"
              {...cameraProps}
            >
              <Svg
                height="100%"
                width="100%"
                style={[StyleSheet.absoluteFill]}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              >
                <Defs>
                  <Mask id="mask" x="0" y="0" width={WIDTH} height={HEIGHT}>
                    <Rect
                      x="0"
                      y="0"
                      width={WIDTH}
                      height={HEIGHT}
                      fill="white"
                    />
                    <Rect
                      x={CENTER_X}
                      y={CENTER_Y}
                      width={SCANNER_SIZE}
                      height={SCANNER_SIZE}
                      rx={BORDER_RADIUS}
                      ry={BORDER_RADIUS}
                      fill="black"
                    />
                  </Mask>
                </Defs>

                {/* Translucent overlay */}
                <Rect
                  x="0"
                  y="0"
                  width={WIDTH}
                  height={HEIGHT}
                  opacity={error || success ? 0.4 : 0.2}
                  fill={
                    error ? theme.colors.primary : success ? "#16a34a" : "black"
                  }
                  mask="url(#mask)"
                />
              </Svg>
            </CameraView>
          </Animated.View>
        ) : permission?.canAskAgain ? (
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => {
              requestPermission();
            }}
          >
            Allow use of camera
          </Button>
        ) : (
          <Text>Please allow the use of camera to use this feature</Text>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Stop</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    borderRadius: 4,
  },
  camera: {
    borderRadius: theme.roundness * 4,
    aspectRatio: 1,
  },
  wFull: {
    width: "100%",
  },
});
