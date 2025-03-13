import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";

export type Comment = {
  author: DocumentReference;
  content: string;
  time: Timestamp;
};

export const DefaultComment = {
  author: null as unknown as DocumentReference<DocumentData>,
  content: "",
  time: null as unknown as Timestamp,
};
