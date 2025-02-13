import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";
import { User } from "./User";
import { CreateEventRequest, EventData } from "./Event";
import { getUserID } from "./AuthService";

export const createUser = (user: User): Promise<void> => {
  return setDoc(doc(db, "users", user.userID), user);
};

export const changeUser = (
  userID: string,
  data: Partial<{ name: string; email: string; role: string }>
): Promise<void> => {
  return updateDoc(doc(db, "users", userID), data);
};

export const deleteUser = (userID: string): Promise<void> => {
  return deleteDoc(doc(db, "users", userID));
};

export const getUser = async (userID: string) => {
  const userDoc = await getDoc(doc(db, "users", userID));
  if (!userDoc.exists()) return [null, null, null] as const;

  const userData = userDoc.data();
  return [userData.name, userData.email, userData.type] as const;
};

export const createEvent = async (
  data: CreateEventRequest
): Promise<string> => {
  const startTimestamp = Timestamp.fromDate(
    new Date(`${data.startDate}T${data.startTime}`)
  );
  const endTimestamp = Timestamp.fromDate(
    new Date(`${data.endDate}T${data.endTime}`)
  );

  const eventID = doc(collection(db, "events")).id;
  const userID = getUserID();
  if (!userID) throw new Error("User ID is null");
  const organizerRef = doc(db, "users", userID);

  const eventData: EventData = {
    title: data.title,
    description: data.description,
    startTime: startTimestamp,
    endTime: endTimestamp,
    tags: data.tags,
    organizer: organizerRef,
    participants: [organizerRef], // Initialize with organizer as first participant
    private: false, // Default to public event
    type: data.type,
  };

  await setDoc(doc(db, "events", eventID), eventData);

  return eventID;
};

export const changeEvent = (
  eventID: string,
  eventData: Partial<unknown>
): Promise<void> => {
  return updateDoc(doc(db, "events", eventID), eventData);
};

export const deleteEvent = (eventID: string): Promise<void> => {
  return deleteDoc(doc(db, "events", eventID));
};
