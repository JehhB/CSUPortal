import EventsProvider from "@/scan/EventsProvider";
import Appbar from "@/shared/components/Appbar";
import { Stack } from "expo-router";

export default function ScanLayout() {
  return (
    <EventsProvider>
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
    </EventsProvider>
  );
}
