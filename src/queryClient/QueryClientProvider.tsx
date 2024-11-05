import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Platform } from "react-native";
import { useReactQueryDevTools } from "@dev-plugins/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  },
});

const asyncStoragePersiter = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "__REACT_QUERY_CACHE__",
});

persistQueryClient({
  queryClient,
  persister: asyncStoragePersiter,
});

export default function QueryClientProvider(props: { children?: ReactNode }) {
  useReactQueryDevTools(queryClient);

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {props.children}
      {Platform.OS == "web" && <ReactQueryDevtools />}
    </TanstackQueryClientProvider>
  );
}
