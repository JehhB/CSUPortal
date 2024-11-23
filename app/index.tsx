import useAuth from "@/auth/useAuth";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Redirect href="/home" />
  ) : (
    <Redirect href="/signin" />
  );
}
