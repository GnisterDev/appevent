import React from "react";
import styles from "./participantsInfo.module.css";
import Participant from "./Participant";

const participants = [
  "navn1",
  "navn2",
  "navn3",
  "navn1",
  "navn2",
  "navn1",
  "navn2",
  "navn1",
  "navn2",
  "navn1",
  "navn2",
  "navn3",
];

const ParticipantsInfo = () => {
  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <h3 className={styles.title}>Påmeldte deltagere</h3>
        <div className={styles.tag}>
          <p>n total</p>
        </div>
      </div>
      <div className={styles.participants}>
        {participants.map((name, index) => (
          <Participant key={index} name={name} />
        ))}
      </div>
    </div>
  );
};

export default ParticipantsInfo;
