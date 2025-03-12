import React from "react";
import styles from "./Invitation.module.css";
import Button from "../Button";
import { Check, X } from "lucide-react";

const Invitation = ({ event }) => {
  return (
    <div className={styles.module}>
      <div className={styles.infoContainer}>
        <h3>Title</h3>
        <p className={styles.info}>Arrangør: NAME</p>
        <p className={styles.info}>Dato: DD.MM.YYYY</p>
      </div>
      <div className={styles.buttons}>
        <Button
          text="Godta"
          icon={<Check size={"1rem"} />}
          className={styles.acceptButton}
        />
        <Button
          text="Avslå"
          icon={<X size={"1rem"} />}
          className={styles.declineButton}
        />
      </div>
    </div>
  );
};

export default Invitation;
