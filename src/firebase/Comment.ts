import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";

export type Comment = {
  commentID: string;
  author: DocumentReference;
  content: string;
  time: Timestamp;
};

export const DefaultComment: Comment = {
  commentID: "",
  author: null as unknown as DocumentReference<DocumentData>,
  content: "",
  time: null as unknown as Timestamp,
};
