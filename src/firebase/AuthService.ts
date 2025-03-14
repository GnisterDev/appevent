import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";
import { auth } from "./config";
import { DefaultUserData, LoginRequest, SignupRequest } from "./User";
import { createUser, getEvent, getUser } from "./DatabaseService";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    userID: user?.uid,
  };
};

export const useSignup = (data: SignupRequest) => {
  return createUserWithEmailAndPassword(auth, data.email, data.password).then(
    userCredential => {
      return createUser({
        ...DefaultUserData,
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
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      getUser(user.uid)
        .then(({ type: userType }) => setIsAdmin(userType === "admin"))
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return isAdmin;
};

export const isOrganizer = (eventID: string): boolean => {
  const { user } = useAuth();
  const [isOrg, setIsOrg] = useState(false);

  useEffect(() => {
    if (user) {
      getEvent(eventID)
        // .then(data => console.log(data))
        .then(({ organizer }) => setIsOrg(organizer.id === user.uid))
        .catch(() => setIsOrg(false));
    } else {
      setIsOrg(false);
    }
  }, [eventID, user]); // Added eventID to dependencies

  return isOrg;
};

export const isUserParticipant = (eventID: string): boolean => {
  const { user } = useAuth();
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    if (user) {
      getEvent(eventID)
        .then(({ participants }) =>
          setIsParticipant(participants.some(p => p.id === user.uid))
        )
        .catch(() => setIsParticipant(false));
    } else {
      setIsParticipant(false);
    }
  }, [eventID, user]); // Added eventID to dependencies

  return isParticipant;
};
