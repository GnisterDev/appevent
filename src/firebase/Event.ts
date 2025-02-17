import { DocumentReference, Timestamp } from "firebase/firestore";

export type CreateEventRequest = {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  type: string;
  tags: string[];
};

export type EventData = {
  title: string;
  description: string;
  startTime: Timestamp;
  endTime: Timestamp;
  tags: string[];
  location: string;
  organizer: DocumentReference;
  participants: DocumentReference[];
  private: boolean;

  type: string;
};
