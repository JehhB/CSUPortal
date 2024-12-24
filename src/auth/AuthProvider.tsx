import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export type AuthContextType = {
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
};

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
});

export type AuthProviderProps = {
  children?: ReactNode;
};

export const AUTH_STORAGE_KEY = "auth";

export default function AuthProvider(props: AuthProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated) return;
    AsyncStorage.getItem(AUTH_STORAGE_KEY).then((prev) => setAccessToken(prev));
    setIsHydrated(true);
  }, [isHydrated, setAccessToken, setIsHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    if (accessToken !== null) {
      AsyncStorage.setItem(AUTH_STORAGE_KEY, accessToken);
    } else {
      AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [accessToken, isHydrated]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {props.children}
    </AuthContext.Provider>
  );
}
