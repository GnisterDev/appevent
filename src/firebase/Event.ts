import { DocumentReference } from "firebase/firestore";

export type Event = {
  title: string;
  description: string;
  eventID: string;
  tags: string[];
  organizer: DocumentReference;
  participants: DocumentReference[];
};
