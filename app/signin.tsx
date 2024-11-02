import { LoginCredentials } from "@/auth/authService";
import useAuth from "@/auth/useAuth";
import Appbar from "@/shared/components/Appbar";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function Signin() {
  const router = useRouter();

  const { login } = useAuth({
    onLoginSuccess: () => {
      router.replace("/(tabs)");
    },
  });

  const [credentials, setCredentials] = useState<LoginCredentials>({
    id: "",
    password: "",
  });

  return (
    <View>
      <Appbar options={{ title: "Sign in" }} />
      <TextInput
        label="Student ID"
        value={credentials.id}
        onChangeText={(text) =>
          setCredentials((cred) => ({ ...cred, id: text }))
        }
      />
      <TextInput
        label="Password"
        value={credentials.password}
        onChangeText={(text) =>
          setCredentials((cred) => ({ ...cred, password: text }))
        }
      />
      <Button onPress={() => login(credentials)}>Login</Button>
    </View>
  );
}
