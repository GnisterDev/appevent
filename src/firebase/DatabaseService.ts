import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  Transaction,
  updateDoc,
  where,
  runTransaction,
} from "firebase/firestore";
import { db } from "./config";
import { UserData } from "./User";
import { EventData } from "./Event";
import { getUserID, useAuth } from "./AuthService";
import { Search } from "./Search";

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

export const getUser = async (userID: string): Promise<UserData> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userID));
    if (!userDoc.exists()) throw new Error("User document does not exist");

    const data = userDoc.data() as UserData;
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
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

export const eventSearch = async ({ name, type, location, date }: Search) => {
  try {
    const eventsRef = collection(db, "events");
    const filters = [];
    let q = query(eventsRef);

    if (name && name.trim() !== "") {
      filters.push(where("name", ">=", name.toLowerCase()));
      filters.push(where("name", "<=", name.toLowerCase() + "\uf8ff"));
    }

    if (type && type.trim() !== "") filters.push(where("type", "==", type));

    if (location && location.trim() !== "")
      filters.push(where("location", "==", location));

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);

      filters.push(where("date", ">=", startTimestamp));
      filters.push(where("date", "<=", endTimestamp));
    }
    if (filters.length > 0) q = query(eventsRef, ...filters);
    const querySnapshot = await getDocs(q);

    const events: EventData[] = [];
    querySnapshot.forEach(doc => {
      events.push({
        id: doc.id,
        ...(doc.data() as EventData),
      });
    });

    return events;
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
};

export const userSearch = async (param: string): Promise<UserData[]> => {
  const searchTerm = param.trim().toLowerCase();
  if (!searchTerm) return [];

  const [nameQuerySnapshot, emailQuerySnapshot] = await Promise.all(
    ["name", "email"].map(field =>
      getDocs(
        query(
          collection(db, "users"),
          where(field, ">=", searchTerm),
          where(field, "<=", searchTerm + "\uf8ff")
        )
      )
    )
  );

  return Array.from(
    new Map(
      [...nameQuerySnapshot.docs, ...emailQuerySnapshot.docs].map(doc => [
        doc.id,
        { ...doc.data(), userID: doc.id } as UserData,
      ])
    ).values()
  ).filter(user => user.userID !== getUserID());
};

/**
 * Get all users who have been invited to a specific event
 * @param eventID - ID of the event
 * @returns Promise<UserData[]> - Array of user data for all invited users
 */
export const getAllInvited = async (eventID: string): Promise<UserData[]> => {
  try {
    const eventRef = doc(db, "events", eventID);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) return [];

    const querySnapshot = await getDocs(
      query(
        collection(db, "users"),
        where("invitations", "array-contains", eventRef)
      )
    );
    return querySnapshot.docs.map(doc => doc.data() as UserData);
  } catch (error) {
    console.error("Error getting invited users:", error);
    return [];
  }
};

/**
 * Invite a user to a private event
 * @param eventID - ID of the event
 * @param userID - ID of the user to invite
 * @returns Promise<boolean> - Whether the invitation was sent successfully
 */
export const inviteUserToEvent = async (
  eventID: string,
  userID: string
): Promise<boolean> => {
  try {
    // Get references
    const eventRef = doc(db, "events", eventID);
    const userRef = doc(db, "users", userID);

    // Check if event exists and is private
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) return false;

    const eventData = eventSnap.data() as EventData;
    if (!eventData.private) return false;

    // Check if user exists
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return false;

    // Check if user is already a participant
    const isAlreadyParticipant = eventData.participants.some(
      (participant: DocumentReference) => participant.id === userID
    );
    if (isAlreadyParticipant) return false;

    // Check if user is already invited
    const userData = userSnap.data() as UserData;
    const isAlreadyInvited = userData.invitations.some(
      inviteRef => inviteRef.path === eventRef.path
    );
    if (isAlreadyInvited) return false;

    // Add event reference to user's invitations
    await updateDoc(userRef, {
      invitations: arrayUnion(eventRef),
    });

    return true;
  } catch (error) {
    console.error("Error inviting user:", error);
    return false;
  }
};

/**
 * Invite multiple users to an event
 * @param eventID - ID of the event
 * @param userIDs - Array of user IDs to invite
 * @returns Promise<{success: string[], failed: string[]}> - Lists of successful and failed invitations
 */
export const inviteUsersToEvent = async (
  eventID: string,
  userIDs: string[]
): Promise<{ success: string[]; failed: string[] }> => {
  const results = {
    success: [] as string[],
    failed: [] as string[],
  };

  await Promise.all(
    userIDs.map(async userID => {
      const success = await inviteUserToEvent(eventID, userID);
      if (success) {
        results.success.push(userID);
      } else {
        results.failed.push(userID);
      }
    })
  );

  return results;
};

/**
 * Accept an invitation to an event
 * @param eventID - ID of the event
 * @param userID - ID of the user accepting the invitation
 * @returns Promise<boolean> - Whether the invitation was accepted successfully
 */
export const acceptEventInvitation = async (
  eventID: string,
  userID: string
): Promise<boolean> => {
  try {
    // Get references
    const eventRef = doc(db, "events", eventID);
    const userRef = doc(db, "users", userID);

    // Check if event and user exist
    const [eventSnap, userSnap] = await Promise.all([
      getDoc(eventRef),
      getDoc(userRef),
    ]);

    if (!eventSnap.exists() || !userSnap.exists()) return false;

    const eventData = eventSnap.data() as EventData;
    const userData = userSnap.data() as UserData;

    // Check if user is already a participant
    if (
      eventData.participants.some(
        (participant: DocumentReference) => participant.id === userID
      )
    )
      return false;

    // Check if user has an invitation
    const hasInvitation = userData.invitations.some(
      inviteRef => inviteRef.path === eventRef.path
    );

    if (!hasInvitation) return false;

    const response = await runTransaction(
      db,
      async (transaction: Transaction) => {
        // Remove the invitation from user's invitations
        transaction.update(userRef, {
          invitations: arrayRemove(eventRef),
        });

        // Add user to event participants
        transaction.update(eventRef, {
          participants: arrayUnion(userID),
        });

        return true;
      }
    );

    return response;
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return false;
  }
};

/**
 * Decline an invitation to an event
 * @param eventID - ID of the event
 * @param userID - ID of the user declining the invitation
 * @returns Promise<boolean> - Whether the invitation was declined successfully
 */
export const declineEventInvitation = async (
  eventID: string,
  userID: string
): Promise<boolean> => {
  try {
    // Get references
    const eventRef = doc(db, "events", eventID);
    const userRef = doc(db, "users", userID);

    // Check if user exists
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.error("User does not exist");
      return false;
    }

    // Remove invitation from user document
    await updateDoc(userRef, {
      invitations: arrayRemove(eventRef),
    });

    return true;
  } catch (error) {
    console.error("Error declining invitation:", error);
    return false;
  }
};

/**
 * Cancel/revoke an invitation to an event
 * @param eventID - ID of the event
 * @param userID - ID of the user whose invitation is being revoked
 * @param currentUserID - ID of the user performing the action (must be event creator)
 * @returns Promise<boolean> - Whether the invitation was revoked successfully
 */
export const cancelEventInvitation = async (
  eventID: string,
  userID: string,
  currentUserID: string
): Promise<boolean> => {
  try {
    // Get references
    const eventRef = doc(db, "events", eventID);
    const userRef = doc(db, "users", userID);

    // Check if event exists and current user is the creator
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) return false;

    const eventData = eventSnap.data() as EventData;
    if (eventData.organizer.id !== currentUserID) return false;

    // Remove invitation from user document
    await updateDoc(userRef, {
      invitations: arrayRemove(eventRef),
    });

    return true;
  } catch (error) {
    console.error("Error revoking invitation:", error);
    return false;
  }
};

/**
 * Invite multiple users to an event at once
 * @param eventID - ID of the event
 * @param userIDs - Array of user IDs to invite
 * @returns Promise<{success: string[], failed: string[]}> - Lists of successful and failed invitations
 */
export const bulkInviteUsers = async (
  eventID: string,
  userIDs: string[]
): Promise<{ success: string[]; failed: string[] }> => {
  const results = {
    success: [] as string[],
    failed: [] as string[],
  };

  await Promise.all(
    userIDs.map(async userID => {
      const success = await inviteUserToEvent(eventID, userID);
      if (success) {
        results.success.push(userID);
      } else {
        results.failed.push(userID);
      }
    })
  );

  return results;
};
