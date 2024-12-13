import ScrollView from "@/shared/components/ScrollView";
import {
  Divider,
  HelperText,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import common from "@/shared/constants/common";
import { StyleSheet } from "react-native";
import Surface from "@/shared/components/Surface";
import TextInput from "@/shared/components/TextInput";
import useStudentMsAccount from "@/student/profile/useStudentMSAccount";
import useAuth from "@/auth/useAuth";
import { Redirect } from "expo-router";
import Snackbar from "@/shared/components/Snackbar";
import { useCallback, useState } from "react";
import { Text as NativeText, View } from "react-native";
import { theme } from "@/shared/constants/themes";
import * as MailComposer from "expo-mail-composer";

export default function MsAccount() {
  const { accessToken } = useAuth();
  const { msAccountQuery } = useStudentMsAccount(accessToken);
  const [showPassword, setShowPassword] = useState(false);

  const [snackbarState, setSnackbarState] = useState({
    visible: false,
    message: "",
  });

  const dismisSnackbar = useCallback(() => {
    setSnackbarState((p) => ({ ...p, visible: false }));
  }, [setSnackbarState]);

  const sendEmail = useCallback(() => {
    MailComposer.composeAsync({
      recipients: ["support@csucarig.edu.ph"],
      subject: "MS ACCOUNT",
      body: `ID Number: ${msAccountQuery.data?.IDNumber}
Fullname: ${msAccountQuery.data?.DisplayName}
College: ${msAccountQuery.data?.CollegeCode}
MS Account: ${msAccountQuery.data?.Username}
`,
    });
  }, [msAccountQuery.data]);

  if (!msAccountQuery.data) return <Redirect href="/home" />;

  return (
    <>
      <ScrollView>
        <Surface>
          <Text variant="titleLarge" style={styles.titles}>
            Microsoft Account
          </Text>
          <View style={[styles.field, styles.mb16]}>
            <TextInput
              label="Email"
              right={
                <TextInput.Icon
                  style={styles.bgTransparent}
                  size={20}
                  icon="content-copy"
                  color={theme.colors.primary}
                  onPress={() => {
                    if (msAccountQuery.data?.Username === undefined) return;
                    Clipboard.setStringAsync(msAccountQuery.data.Username);
                    setSnackbarState({
                      visible: true,
                      message: "Microsoft account email copied to clipboard",
                    });
                  }}
                />
              }
              style={styles.fieldData}
              readOnly
              value={msAccountQuery.data.Username}
            />
          </View>
          <View style={styles.field}>
            <TextInput
              label="Password"
              right={
                <TextInput.Icon
                  style={styles.bgTransparent}
                  size={20}
                  icon="content-copy"
                  color={theme.colors.primary}
                  onPress={() => {
                    if (msAccountQuery.data?.Password === undefined) return;
                    Clipboard.setStringAsync(msAccountQuery.data.Password);
                    setSnackbarState({
                      visible: true,
                      message: "Microsoft account password copied to clipboard",
                    });
                  }}
                />
              }
              readOnly
              style={styles.fieldData}
              value={
                showPassword
                  ? msAccountQuery.data.Password
                  : "\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7"
              }
            />
          </View>

          <HelperText visible type="info" style={styles.mb16}>
            This is a one-time password. You'll be prompted to change it upon
            your first login, so it will no longer be valid afterward.{" "}
            <TouchableRipple onPress={() => setShowPassword((p) => !p)}>
              <NativeText style={styles.colorPrimary}>
                {showPassword ? "Hide password" : "Show password"}
              </NativeText>
            </TouchableRipple>
          </HelperText>
          <Divider />
          <HelperText visible type="info">
            Having a trouble signing in your Microsoft account?
            <TouchableRipple onPress={sendEmail}>
              <NativeText style={styles.colorPrimary}>
                Contact us at support@csucarig.edu.ph
              </NativeText>
            </TouchableRipple>
          </HelperText>
        </Surface>
      </ScrollView>
      <Portal>
        <Snackbar
          visible={snackbarState.visible}
          onDismiss={dismisSnackbar}
          style={styles.snackbar}
        >
          {snackbarState.message}
        </Snackbar>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  ...common,
  snackbar: {
    backgroundColor: theme.colors.primary,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
  },
  mb16: {
    marginBottom: 16,
  },
  fieldData: {
    flex: 1,
  },
  fieldName: {
    width: 60,
  },
});
