import { createContext } from "react";
import { DefaultEventData, EventContextType, EventData } from "./Event";
import { DefaultUserData, UserContextType, UserData } from "./User";

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

export const UserContext = createContext<UserContextType>({
  formData: DefaultUserData,
  updateFormData: () => {},
});

export const UserDisplayContext = createContext<{
  userID: string;
  userData: UserData;
}>({
  userID: "",
  userData: null as unknown as UserData,
});
