import { createContext } from "react";
import { DefaultEventData, EventContextType, EventData } from "./Event";

export const EventContext = createContext<EventContextType>({
  formData: DefaultEventData,
  updateFormData: () => {},
});

export const EventDisplayContext = createContext<{
  eventID: string;
  eventData: EventData;
  isOrg: boolean;
}>({
  eventID: "",
  eventData: DefaultEventData,
  isOrg: false,
});
