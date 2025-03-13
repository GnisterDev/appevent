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

const ProfilePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const userID = Array.isArray(id) ? id[0] : id;
  const [userData, setUserData] = useState<UserData>(DefaultUserData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userID) return;

    getUser(userID)
      .then(data => {
        if (data) setUserData(data);
        else router.push("/404");
      })
      .finally(() => setLoading(false));
  }, [userID]);

  if (loading) return <Loading />;

  return (
    <UserDisplayContext.Provider value={userData}>
      <main className={styles.main}>
        <ProfileOverview />
        {userData?.interests?.length != 0 && <Interests />}
        {userData?.invitations?.length != 0 && <InvitationOverview />}
        <div className={styles.grid}>
          <div>
            <ProfileInfo />
          </div>
          <div className={styles.spanTwo}>
            <QuickSelection />
          </div>
        </div>
      </main>
    </UserDisplayContext.Provider>
  );
};

export default ProfilePage;
