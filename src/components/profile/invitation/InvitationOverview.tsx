import { Mail } from "lucide-react";
import React, { useContext } from "react";
import styles from "../ProfileComponents.module.css";
import { UserDisplayContext } from "@/firebase/contexts";
import Invitation from "./Invitation";

const InvitationOverview = () => {
  const userData = useContext(UserDisplayContext);

  return (
    <div className={styles.module}>
      <div className={styles.title}>
        <Mail size={"1.5rem"} />
        <h2>Invites</h2>
      </div>
      <div className={styles.column}>
        {userData.invitations.map((event, key) => (
          <Invitation key={key} event={event} />
        ))}
      </div>
    </div>
  );
};

export default InvitationOverview;
