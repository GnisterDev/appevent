import { MapPin, User } from "lucide-react";
import React, { useContext } from "react";
import styles from "./ProfileOverview.module.css";
import { UserDisplayContext } from "@/firebase/contexts";

const ProfileOverview = () => {
  const { userData } = useContext(UserDisplayContext);

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
    </div>
  );
};

export default ProfileOverview;
