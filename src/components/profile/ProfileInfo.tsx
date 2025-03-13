import React from "react";
import styles from "./ProfileComponents.module.css";

const ProfileInfo = () => {
  return (
    <div className={styles.module}>
      <h2 className={styles.title}>Statistics</h2>
      <div>
        <div className={styles.statisticsInfo}>
          <span>Arrangert</span>
          <span style={{ fontWeight: "bold" }}>0</span>
        </div>
        <div className={styles.statisticsInfo}>
          <span>Påmeldt</span>
          <span style={{ fontWeight: "bold" }}>0</span>
        </div>
        <div className={styles.statisticsInfo}>
          <span>Invitert til</span>
          <span style={{ fontWeight: "bold" }}>0</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
