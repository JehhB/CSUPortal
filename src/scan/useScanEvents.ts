import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export type Event = {
  id: string;
  creator: string | null;
  name: string;
  dateCreated: number;
  slug?: string;
};

const EVENTS_QUERY_KEY = "scanEvents";

export default function useScanEvents() {
  const queryClient = useQueryClient();

  const eventsQuery = useQuery<Event[]>({
    queryKey: [EVENTS_QUERY_KEY],
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const events = useMemo(() => eventsQuery.data ?? [], [eventsQuery.data]);

  const setEvents = useCallback(
    (eventsOrUpdater: Event[] | ((prevEvents: Event[]) => Event[])) => {
      const updatedEvents =
        typeof eventsOrUpdater === "function"
          ? eventsOrUpdater(events)
          : eventsOrUpdater;

      queryClient.setQueryData([EVENTS_QUERY_KEY], updatedEvents);
    },
    [queryClient, events],
  );

  return { events, setEvents };
}
