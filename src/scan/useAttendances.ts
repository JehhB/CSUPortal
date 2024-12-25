import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Event } from "./EventsProvider";

const ATTENDANCE_QUERY_KEY = "scanAttendances";

export type Attendance = {
  id: string;
  idNumber: string;
  lastName: string;
  firstName: string;
  idCreatedAt: number;
  scannedAt: number;
  scannedBy: string;
  eventId: string;
};

export default function useScanAttendances(event: Event | null) {
  const queryClient = useQueryClient();

  const attendancesQuery = useQuery<Attendance[]>({
    queryKey: [ATTENDANCE_QUERY_KEY, event?.id ?? ""],
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24 * 14,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: event !== null,
  });

  const attendances = useMemo(
    () => attendancesQuery.data ?? [],
    [attendancesQuery.data],
  );

  const setAttendances = useCallback(
    (
      attendancesOrUpdater:
        | Attendance[]
        | ((prevAttendances: Attendance[]) => Attendance[]),
    ) => {
      if (event === null) return;
      const updatedAttendances =
        typeof attendancesOrUpdater === "function"
          ? attendancesOrUpdater(attendances)
          : attendancesOrUpdater;

      queryClient.setQueryData(
        [ATTENDANCE_QUERY_KEY, event.id],
        updatedAttendances,
      );
    },
    [queryClient, event, attendances],
  );

  return { attendances, setAttendances };
}
