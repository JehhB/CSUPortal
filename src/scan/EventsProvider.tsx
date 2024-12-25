import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

const EVENTS_STORAGE_KEY = "scanEvents";

export type Event = {
  id: string;
  creator: string | null;
  owner: string | null;
  name: string;
  dateCreated: number;
  slug?: string;
};

export type EventsContextType = {
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
};

export type EventsProviderProps = {
  children?: ReactNode;
};

export const EventsContext = createContext<EventsContextType>({
  events: [],
  setEvents: () => {},
});

export default function EventsProvider(props: EventsProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (isHydrated) return;
    AsyncStorage.getItem(EVENTS_STORAGE_KEY).then((prev) =>
      prev ? setEvents(JSON.parse(prev)) : [],
    );
    setIsHydrated(true);
  }, [isHydrated, setEvents, setIsHydrated]);

  useEffect(() => {
    console.log(events);
    if (!isHydrated) return;
    AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events, isHydrated]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {props.children}
    </EventsContext.Provider>
  );
}
