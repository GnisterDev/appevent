import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { auth } from "./config";
import { LoginRequest, SignupRequest } from "./User";
import { createUser } from "./DatabaseService";

export const useSignup = (data: SignupRequest) => {
  return createUserWithEmailAndPassword(auth, data.email, data.password).then(
    userCredential => {
      return createUser({
        name: data.name,
        email: data.email,
        userID: userCredential.user.uid,
        type: "user",
      });
    }
  );
};

export const useLogin = (data: LoginRequest): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, data.email, data.password);
};

export const useLogout = (): Promise<void> => {
  return signOut(auth);
};

export const isLoggedIn = (): boolean => {
  return !!auth.currentUser;
};

export const getUserID = (): string | null => {
  return auth.currentUser?.uid || null;
};

export const isAdministrator = (): boolean => {
  new Error("Not implemented");
  return false;
};
