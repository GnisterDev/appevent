"use client"; // Sørger for at koden kjøres i klienten

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileOverview from "@/components/profile/ProfileOverview";
import { getUser } from "@/firebase/DatabaseService";
import styles from "./profile.module.css";
import { DefaultUserData, UserData } from "@/firebase/User";
import { UserDisplayContext } from "@/firebase/contexts";
import Loading from "@/components/Loading";
import ProfileInfo from "@/components/profile/ProfileInfo";
import QuickSelection from "@/components/profile/QuickSelection";
import Interests from "@/components/profile/Interests";
import InvitationOverview from "@/components/profile/invitation/InvitationOverview";
import { useAuth } from "@/firebase/AuthService";

const ProfilePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const profileUserID = Array.isArray(id) ? id[0] : id;
  const [userData, setUserData] = useState<UserData>(DefaultUserData);
  const [loading, setLoading] = useState(true);
  const { userID } = useAuth();

  useEffect(() => {
    if (!profileUserID) return;

    getUser(profileUserID)
      .then(setUserData)
      .catch(() => router.push("/404"))
      .finally(() => setLoading(false));
  }, [profileUserID]);

  const updateInvitedEvents = (eventID: string) => {
    setUserData(prev => ({
      ...prev,
      invitations: prev.invitations.filter(event => event.id !== eventID),
    }));
  };

  if (loading) return <Loading />;
  if (!userID) return;

  return (
    <UserDisplayContext.Provider
      value={{ userID, userData, updateInvitedEvents }}
    >
      <main className={styles.main}>
        <ProfileOverview />
        <Interests />
        {userData?.invitations?.length != 0 && <InvitationOverview />}
        {profileUserID === userID ? (
          <div className={styles.grid}>
            <div>
              <ProfileInfo />
            </div>
            <div className={styles.spanTwo}>
              <QuickSelection />
            </div>
          </div>
        ) : (
          <ProfileInfo />
        )}
      </main>
    </UserDisplayContext.Provider>
  );
};

export default ProfilePage;
