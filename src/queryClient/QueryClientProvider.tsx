import { QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

export default function QueryClientProvider(props: { children?: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersiter }}
    >
      {props.children}
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  );
}
