import { MapPin, Trash, User } from "lucide-react";
import React, { useContext } from "react";
import styles from "./ProfileOverview.module.css";
import { UserDisplayContext } from "@/firebase/contexts";
import Button from "../Button";
import { isAdministrator, useAuth } from "@/firebase/AuthService";

const ProfileOverview = () => {
  const { userData } = useContext(UserDisplayContext);
  const isAdmin = isAdministrator();
  const { userID } = useAuth();
  const isOwnProfile = userData.userID === userID;
  const canDelete = !isOwnProfile && isAdmin;

  console.log(userData.userID, userID);

  return (
    <div className={styles.module}>
      <div className={styles.userInfoContainer}>
        <div className={styles.profileCircle}>
          <User size={"3rem"} style={{ color: "var(--text-secondary)" }} />
        </div>
        <div className={styles.userInfo}>
          <h2>{userData.name}</h2>
          <p>{userData.email}</p>
          {userData.location && (
            <span className={styles.userInfoLocation}>
              <MapPin size={"1rem"} />
              {userData.location}
            </span>
          )}
        </div>
      </div>
      {canDelete && (
        <Button
          text="Slett Bruker"
          icon={<Trash />}
          className={styles.deleteButton}
        />
      )}
    </div>
  );
};

export default ProfileOverview;
