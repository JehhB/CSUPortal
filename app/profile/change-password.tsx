import { InvalidPasswordError } from "@/auth/authService";
import useAuth from "@/auth/useAuth";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import PasswordInput from "@/shared/components/PasswordInput";
import ScrollView from "@/shared/components/ScrollView";
import Snackbar from "@/shared/components/Snackbar";
import Surface from "@/shared/components/Surface";
import common from "@/shared/constants/common";
import { theme } from "@/shared/constants/themes";
import {
  hasLowercase,
  hasNumber,
  hasUppercase,
  isLongerThan,
  isNotCommonPassword,
} from "@/util/passwordCriterias";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Button, HelperText, Icon, Portal, Text } from "react-native-paper";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const passwordCriteria: [string, (str: string) => boolean][] = [
  ["Contain at least 8 characters", (str) => isLongerThan(8, str)],
  ["Contain at least 1 number", hasNumber],
  ["Contain at least 1 lowercase letter", hasLowercase],
  ["Contain at least 1 uppercase letter", hasUppercase],
];

function Criteria(props: { label: string; satisfied: boolean }) {
  const color = props.satisfied ? "#16a34a" : theme.colors.onSurfaceVariant;

  return (
    <View style={styles.criteria}>
      <Icon
        size={16}
        source={props.satisfied ? "check" : "close"}
        color={color}
      />
      <Text variant="labelSmall" style={{ color }}>
        {props.label}
      </Text>
    </View>
  );
}

export default function ChangePassword() {
  const oldPasswordRef = useRef<TextInput | null>(null);

  const [pass, setPass] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showIncorrectOld, setShowIncorrectOld] = useState(false);
  const { changePasswordMutation, logout } = useAuth();

  const criterias = useMemo(
    () =>
      passwordCriteria.map(
        (criteria) =>
          [criteria[0], criteria[1](pass.newPassword)] as [string, boolean],
      ),
    [pass.newPassword],
  );

  const notCommonPassword = useMemo(
    () => isNotCommonPassword(pass.newPassword),
    [pass.newPassword],
  );

  const passwordStrength = useMemo(
    () => (!notCommonPassword ? -1 : criterias.filter((v) => v[1]).length),
    [criterias, notCommonPassword],
  );

  const passwordStrengthValue = useSharedValue(0);

  useEffect(() => {
    passwordStrengthValue.value = withTiming(passwordStrength, {
      duration: 150,
    });
  }, [passwordStrengthValue, passwordStrength]);

  const passwordDescriptions = useMemo(() => {
    if (pass.newPassword === "") return "Enter password";
    if (!notCommonPassword) return "Insecure Password";
    if (passwordStrength < 3) return "Weak password";
    if (passwordStrength < 4) return "Medium password";
    return "Strong Password";
  }, [notCommonPassword, passwordStrength, pass.newPassword]);

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        Math.max(passwordStrengthValue.value, 0),
        [0, 4],
        [theme.colors.error, "#16a34a"],
      ),
      width: `${interpolate(
        passwordStrengthValue.value < 0 ? 4 : passwordStrengthValue.value,
        [0, 4],
        [0, 100],
      )}%`,
    };
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const changePassword = useCallback(
    (passwords: typeof pass) => {
      changePasswordMutation.mutate(passwords, {
        onError: (e) => {
          if (e instanceof InvalidPasswordError) {
            setShowIncorrectOld(true);
            oldPasswordRef.current?.focus();
          }
        },
        onSuccess: () => {
          setShowSuccess(true);
        },
        onSettled: () => {
          setShowConfirm(false);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      changePasswordMutation.mutate,
      setShowIncorrectOld,
      setShowSuccess,
      setShowConfirm,
    ],
  );

  return (
    <>
      <ScrollView>
        <Surface>
          <Text variant="titleLarge" style={common.titles}>
            Change Password
          </Text>
          <PasswordInput
            autoComplete="current-password"
            ref={oldPasswordRef}
            label="Old Password"
            value={pass.oldPassword}
            onChangeText={(val) => {
              setShowIncorrectOld(false);
              setPass((prev) => ({ ...prev, oldPassword: val }));
            }}
            error={showIncorrectOld}
          />
          <HelperText type="error" visible={showIncorrectOld}>
            Incorrect old password
          </HelperText>

          <PasswordInput
            label="New Password"
            autoComplete="new-password"
            value={pass.newPassword}
            onChangeText={(val) => {
              setShowIncorrectOld(false);
              setPass((prev) => ({ ...prev, newPassword: val }));
            }}
          />

          <View style={[styles.strengthIndicator]}>
            <Animated.View style={indicatorAnimatedStyle} />
          </View>
          <Text variant="labelLarge" style={styles.strengthDescription}>
            {passwordDescriptions}. New password must be:
          </Text>
          <Criteria
            label="Not a common password"
            satisfied={notCommonPassword}
          />
          {criterias.map((criteria) => (
            <Criteria
              key={criteria[0]}
              label={criteria[0]}
              satisfied={criteria[1]}
            />
          ))}
          <Button
            disabled={
              showIncorrectOld ||
              pass.oldPassword === "" ||
              passwordStrength !== 4
            }
            mode="contained"
            style={styles.button}
            onPress={() => setShowConfirm(true)}
          >
            Change Password
          </Button>
        </Surface>
      </ScrollView>
      <Portal>
        <ConfirmDialog
          visible={showConfirm}
          onDismiss={() => setShowConfirm(false)}
          title="Change password"
          description="Are you sure you want to change your password?"
          confirm={{
            children: "Yes",
            loading: changePasswordMutation.isPending,
            disabled: changePasswordMutation.isPending,
            onPress: () => {
              changePassword(pass);
            },
          }}
        />
        <Snackbar
          visible={showSuccess}
          onDismiss={() => logout()}
          action={{
            label: "Logout",
            onPress: () => logout(),
            labelStyle: common.colorSecondary,
          }}
        >
          Password change successfully
        </Snackbar>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  strengthIndicator: {
    marginTop: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.onSurfaceDisabled,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    overflow: "hidden",
  },
  strengthDescription: {
    marginBottom: 8,
  },
  criteria: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
    marginStart: 4,
  },
  button: {
    marginTop: 16,
    borderRadius: 4,
  },
});
