import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { User } from "./User";

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

export const createEvent = (
  eventID: string,
  eventData: Record<string, unknown>
): Promise<void> => {
  return setDoc(doc(db, "events", eventID), eventData);
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
