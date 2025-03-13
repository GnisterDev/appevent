import { Settings, User } from "lucide-react";
import React, { useContext } from "react";
import styles from "./ProfileOverview.module.css";
import Button from "../Button";
import { UserDisplayContext } from "@/firebase/contexts";

const ProfileOverview = () => {
  const context = useContext(UserDisplayContext);

  return (
    <div className={styles.module}>
      <div className={styles.userInfo}>
        <div className={styles.profileCircle}>
          <User size={"3rem"} style={{ color: "var(--text-secondary)" }} />
        </div>
        <div>
          <h2>{context.name}</h2>
          <p>{context.email}</p>
        </div>
      </div>
      <Button
        text="Rediger profil"
        icon={<Settings />}
        className={styles.settingsButton}
      />
    </div>
  );
};

export default ProfileOverview;
