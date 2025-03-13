import { DocumentReference } from "firebase/firestore";

interface BaseCredentials {
  password: string;
  email: string;
  name?: string;
}

export type LoginRequest = BaseCredentials;

export type SignupRequest = Required<BaseCredentials>;

export type UserData = {
  name: string;
  email: string;
  type: "admin" | "user";
  location: string;
  description: string;
  interests: string[];
  invitations: DocumentReference[];
};

export const DefaultUserData: UserData = {
  name: "",
  email: "",
  type: "user",
  location: "",
  description: "",
  interests: [],
  invitations: [],
};

export type UserContextType = {
  formData: UserData;
  updateFormData: (field: string, value: unknown) => void;
};
