import useAuth from "@/auth/useAuth";
import Appbar from "@/shared/components/Appbar";
import { Redirect, Stack } from "expo-router";

export default function ProfileLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Redirect href="/signin" />;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: (props) => (
          <Appbar title={props.options.title ?? "Profile"} canGoBack />
        ),
      }}
    >
      <Stack.Screen name="digital-id" options={{ title: "Digital ID" }} />
    </Stack>
  );
}
