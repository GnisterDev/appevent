import { Settings, User } from "lucide-react";
import React from "react";
import styles from "./ProfileOverview.module.css";
import Button from "../Button";

const ProfileOverview = () => {
  return (
    <div className={styles.module}>
      <div className={styles.userInfo}>
        <div className={styles.profileCircle}>
          <User size={"3rem"} style={{ color: "var(--text-secondary)" }} />
        </div>
        <div>
          <h2>USERNAME</h2>
          <p>EMAIL</p>
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
