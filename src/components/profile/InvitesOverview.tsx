import { Mail } from "lucide-react";
import React from "react";
import styles from "./ProfileComponents.module.css";

const InvitesOverview = () => {
  return (
    <div className={styles.module}>
      <div className={styles.title}>
        <Mail size={"1.5rem"} />
        <h2>Invites</h2>
      </div>
    </div>
  );
};

export default InvitesOverview;
