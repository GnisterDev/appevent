import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";
import { UserData } from "./User";
import { EventData } from "./Event";
import { getUserID, useAuth } from "./AuthService";
import { Comment } from "./Comment";

export const createUser = (user: UserData): Promise<void> => {
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

export const createEvent = async (data: EventData): Promise<string> => {
  const userID = getUserID();
  if (!userID) throw new Error("User ID is null");
  const eventID = doc(collection(db, "events")).id;
  const organizerRef = doc(db, "users", userID);

  const eventData: EventData = {
    ...data,
    organizer: organizerRef,
    participants: [organizerRef],
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

export const isUserParticipant = async (
  eventID: string,
  userID: string
): Promise<boolean> => {
  try {
    const eventRef = doc(db, "events", eventID);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists())
      throw new Error(`Event with ID ${eventID} not found`);

    const eventData = eventSnap.data();
    const participantRefs = eventData.participants || [];

    return participantRefs.some((userRef: DocumentReference) => {
      return userRef.id === userID || userRef.path.endsWith(`/users/${userID}`);
    });
  } catch (error) {
    console.error("Error checking participant status:", error);
    throw error;
  }
};

export const isCurrentUserParticipant = async (
  eventID: string
): Promise<boolean> => {
  try {
    const { userID } = useAuth();
    if (!userID) return false;
    return await isUserParticipant(eventID, userID);
  } catch (error) {
    console.error("Error checking if current user is participant:", error);
    throw error;
  }
};

export const getAllParticipants = async (
  eventID: string
): Promise<UserData[]> => {
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
        return { ...userSnap.data(), userID: userSnap.id } as UserData;
      }
    );

    const participants = await Promise.all(participantsPromises);
    return participants.filter(participant => participant !== null);
  } catch (error) {
    console.log(`Error fetching participants ${error}`);
    throw error;
  }
};

export const addComment = async (
  eventID: string,
  comment: Comment
): Promise<void> => {
  try {
    const commentDocRef = await addDoc(collection(db, "comments"), comment);

    const eventRef = doc(db, "events", eventID);
    await updateDoc(eventRef, {
      comments: arrayUnion(commentDocRef),
    });

    console.log("Comment added successfully");
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const deleteComment = async (
  eventID: string,
  commentID: string
): Promise<void> => {
  try {
    const commentRef = doc(db, "comments", commentID);

    const eventRef = doc(db, "events", eventID);
    await updateDoc(eventRef, {
      comments: arrayRemove(commentRef),
    });

    await deleteDoc(commentRef);

    console.log("Comment deleted successfully");
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const getComments = async (eventID: string): Promise<Comment[]> => {
  try {
    const eventRef = doc(db, "events", eventID);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists())
      throw new Error(`Event with ID ${eventID} not found`);

    const eventData = eventDoc.data() as EventData;
    const commentRefs = eventData.comments || [];

    if (commentRefs.length === 0) return [];

    const comments: Comment[] = [];

    for (const commentRef of commentRefs) {
      const commentDoc = await getDoc(commentRef);
      if (commentDoc.exists()) {
        comments.push(commentDoc.data() as Comment);
      }
    }

    return comments.sort((a, b) => b.time.seconds - a.time.seconds);
  } catch (error) {
    console.error("Error getting comments:", error);
    throw error;
  }
};
