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
  participants: UserData[];
  refreshInfo: () => Promise<void>;
}>({
  eventID: null,
  eventData: null,
  isOrg: false,
  participants: [],
  refreshInfo: async () => {},
});

export const UserContext = createContext<UserContextType>({
  formData: DefaultUserData,
  updateFormData: () => {},
});

export const UserDisplayContext = createContext<{
  userID: string;
  userData: UserData;
  updateInvitedEvents: (eventID: string) => void;
}>({
  userID: "",
  userData: null as unknown as UserData,
  updateInvitedEvents: () => {},
});
