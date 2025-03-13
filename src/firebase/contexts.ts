import { createContext } from "react";
import { DefaultEventData, EventContextType, EventData } from "./Event";
import { DefaultUserData, UserContextType, UserData } from "./User";

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

export const UserContext = createContext<UserContextType>({
  formData: DefaultUserData,
  updateFormData: () => {},
});

export const UserDisplayContext = createContext<UserData>({
  ...DefaultUserData,
});
