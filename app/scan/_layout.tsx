import useAuth from "@/auth/useAuth";
import Appbar from "@/shared/components/Appbar";
import { Redirect, Stack } from "expo-router";

export default function ScanLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Redirect href="/signin" />;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: ({ options, route }) => (
          <Appbar
            title={options.title ?? "Scan ID"}
            goBack={route.name === "[event]" ? "/scan" : "/home"}
          />
        ),
      }}
    />
  );
}
