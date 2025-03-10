import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
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

export const getUser = async (
  userID: string
): Promise<{ name: string; email: string; type: string }> => {
  const userDoc = await getDoc(doc(db, "users", userID));
  if (!userDoc.exists()) throw new Error("User document does not exist");

  const { name, email, type } = userDoc.data();
  return { name, email, type } as const;
};

export const createEvent = async (
  data: CreateEventRequest
): Promise<string> => {
  const startTimestamp = Timestamp.fromDate(
    new Date(`${data.startDate}T${data.startTime}`)
  );

  const userID = getUserID();
  if (!userID) throw new Error("User ID is null");
  const eventID = doc(collection(db, "events")).id;
  const organizerRef = doc(db, "users", userID);

  const eventData: EventData = {
    ...data,
    startTime: startTimestamp,
    organizer: organizerRef,
    participants: [organizerRef], // Initialize with organizer as first participant
    private: false, // Default to public event
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

// export const getEvent = async (eventId: string): Promise<EventData> => {
//   try {
//     const eventRef = doc(db, "events", eventId);
//     const eventSnap = await getDoc(eventRef);

//     if (!eventSnap.exists()) return {} as EventData;

//     const eventData = eventSnap.data() as EventData;

//     console.log("Event data:", eventData);

//     return {
//       ...eventData,
//       startTime: eventData.startTime,
//       endTime: eventData.endTime as Timestamp,
//       organizer: eventData.organizer as DocumentReference,
//       participants: eventData.participants as DocumentReference[],
//     };
//   } catch (error) {
//     console.error("Error fetching event:", error);
//     throw error;
//   }
// };

export const getEvent = async (eventId: string): Promise<EventData> => {
  try {
    const eventDoc = await getDoc(doc(db, "events", eventId));
    if (!eventDoc.exists()) throw new Error("Event not found");

    const data = eventDoc.data() as EventData;
    return data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

export const getAllParticipants = async (eventID: string): Promise<User[]> => {
  try {
    const eventSnap = await getDoc(doc(db, "events", eventID));
    if (!eventSnap.exists())
      throw new Error(`Event with ID ${eventID} not found`);

    const participantsRef: DocumentReference[] =
      eventSnap.data().participants || [];

    if (!participantsRef.length) return [];

    const participantsPromises = participantsRef.map(
      async (userRef: DocumentReference) => {
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return null;
        return { ...userSnap.data(), userID: userSnap.id } as User;
      }
    );

    const participants = await Promise.all(participantsPromises);
    return participants.filter(participant => participant !== null);
  } catch (error) {
    console.log(`Error fetching participants ${error}`);
    throw error;
  }
};
