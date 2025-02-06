import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { User } from "./User";

export class DatabaseService {
  static async createUser(user: User): Promise<void> {
    return setDoc(doc(db, "users", user.userID), user);
  }

  static async changeUser(
    userID: string,
    data: Partial<{ name: string; email: string; role: string }>
  ): Promise<void> {
    return updateDoc(doc(db, "users", userID), data);
  }

  static async deleteUser(userID: string): Promise<void> {
    return deleteDoc(doc(db, "users", userID));
  }

  static async getUser(userID: string) {
    return doc(db, "users", userID);
  }

  static async createEvent(
    eventID: string,
    eventData: Record<string, unknown>
  ): Promise<void> {
    return setDoc(doc(db, "events", eventID), eventData);
  }

  static async changeEvent(
    eventID: string,
    eventData: Partial<unknown>
  ): Promise<void> {
    return updateDoc(doc(db, "events", eventID), eventData);
  }

  static async deleteEvent(eventID: string): Promise<void> {
    return deleteDoc(doc(db, "events", eventID));
  }
}
