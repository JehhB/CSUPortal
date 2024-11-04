import { LoginCredentials } from "@/auth/authService";
import useAuth from "@/auth/useAuth";
import { theme } from "@/shared/constants/themes";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TextInput as NativeTextInput } from "react-native";
import TextInput from "@/shared/components/TextInput";
import { Image } from "expo-image";
import { Button, Text } from "react-native-paper";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";

export default function Signin() {
  const [isSplash, setSplash] = useState(true);
  const router = useRouter();

  const { login } = useAuth({
    onLoginSuccess: () => {
      router.replace("/(tabs)");
    },
  });

  const blobAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: withTiming(isSplash ? 1 : 1.7) },
      { scaleY: withTiming(isSplash ? 1 : 1.2) },
    ],
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: withTiming(isSplash ? 1 : -1),
      },
    ],
  }));

  const [credentials, setCredentials] = useState<LoginCredentials>({
    id: "",
    password: "",
  });

  const inputRefs = useRef<(NativeTextInput | null)[]>([]);

  useEffect(() => {
    if (isSplash == true) return;
    let cancelled = false;
    window.setTimeout(() => {
      if (cancelled) return;
      inputRefs.current.at(0)?.focus();
    }, 300);

    return () => {
      cancelled = true;
    };
  }, [isSplash]);

  return (
    <View style={styles.root}>
      <Image
        source={require("@@/assets/images/signin-accent-bg.svg")}
        style={[StyleSheet.absoluteFillObject]}
      />

      <SafeAreaView style={styles.container}>
        {isSplash && (
          <Animated.View
            layout={LinearTransition}
            exiting={FadeOutUp}
            entering={FadeInUp}
          >
            <Image
              source={require("@@/assets/images/csu-text-logo.svg")}
              contentFit="contain"
              style={styles.csuLogo}
            />
          </Animated.View>
        )}

        <Animated.View layout={LinearTransition}>
          <Image
            source={require("@@/assets/images/portal-text-logo.svg")}
            contentFit="contain"
            style={styles.portalLogo}
          />
        </Animated.View>

        <Animated.View layout={LinearTransition} style={styles.main}>
          <Animated.View style={[StyleSheet.absoluteFill, blobAnimatedStyle]}>
            <Image
              source={require("@@/assets/images/signin-blob-bg.svg")}
              style={[StyleSheet.absoluteFillObject]}
              contentFit="contain"
            />
          </Animated.View>

          {isSplash ? (
            <Animated.View style={styles.graphics}>
              <Image
                style={{ width: "100%", height: "100%" }}
                source={require("@@/assets/images/signin-graphics.svg")}
                contentFit="contain"
              />
            </Animated.View>
          ) : (
            <Animated.View
              style={styles.form}
              entering={FadeIn}
              exiting={FadeOut}
            >
              <Text style={styles.formTitle} variant="headlineMedium">
                Welcome, Agila!
              </Text>

              <TextInput
                ref={(ref) => (inputRefs.current[0] = ref)}
                label="Student ID"
                value={credentials.id}
                onChangeText={(text) => {
                  setCredentials((cred) => ({ ...cred, id: text }));
                }}
                onSubmitEditing={() => {
                  inputRefs.current.at(1)?.focus();
                }}
                autoComplete="username"
                keyboardType="numbers-and-punctuation"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              <TextInput
                ref={(ref) => (inputRefs.current[1] = ref)}
                label="Password"
                value={credentials.password}
                onChangeText={(text) => {
                  setCredentials((cred) => ({ ...cred, password: text }));
                }}
                autoComplete="password"
                keyboardType="default"
                secureTextEntry={true}
                returnKeyType="done"
              />
              <Button mode="contained" style={styles.loginButton}>
                Login
              </Button>
            </Animated.View>
          )}
        </Animated.View>

        <TouchableOpacity
          style={[styles.arrow]}
          onPress={() => setSplash((prev) => !prev)}
        >
          <Animated.View style={[arrowAnimatedStyle]}>
            <Image
              source={require("@@/assets/images/signin-arrow.svg")}
              style={[styles.arrowImage]}
              contentFit="contain"
            />
          </Animated.View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.primary,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    maxWidth: 360,
  },
  containerBg: {
    resizeMode: "cover",
  },
  main: {
    flex: 1,
  },
  graphics: {
    flex: 1,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    rowGap: 16,
  },
  formTitle: {
    alignSelf: "center",
  },
  csuLogo: {
    marginTop: 32,
    height: 56,
  },
  portalLogo: {
    marginVertical: 48,
    height: 64,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.secondary,
    borderRadius: 4,
  },
  arrow: {
    height: 48,
    marginBottom: 32,
    marginEnd: 16,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  arrowImage: {
    height: 21,
    width: 66,
  },
});
