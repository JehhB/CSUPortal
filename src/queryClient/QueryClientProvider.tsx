import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
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
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      return (
        defaultShouldDehydrateQuery(query) || query.state.status === "error"
      );
    },
  },
});

export default function QueryClientProvider(props: { children?: ReactNode }) {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {props.children}
    </TanstackQueryClientProvider>
  );
}
