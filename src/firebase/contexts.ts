import { createContext } from "react";
import { DefaultEventData, EventContextType, EventData } from "./Event";

export const EventContext = createContext<EventContextType>({
  formData: DefaultEventData,
  updateFormData: () => {},
});

export const EventDisplayContext = createContext<{
  eventID: string | null;
  eventData: EventData | null;
  isOrg: boolean;
}>({
  eventID: null,
  eventData: null,
  isOrg: false,
});
