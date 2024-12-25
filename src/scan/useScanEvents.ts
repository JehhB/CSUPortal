import { useContext } from "react";
import { EventsContext } from "./EventsProvider";

export default function useScanEvents() {
  return useContext(EventsContext);
}
