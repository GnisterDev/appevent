import React, { useState } from "react";
import styles from "./participantsInfo.module.css";
import Participant from "./Participant";
import { ChevronDown } from "lucide-react";

interface ParticipantsInfoProps {
  participants: string[];
}

const ParticipantsInfo: React.FC<ParticipantsInfoProps> = ({
  participants,
}) => {
  const [show, setShow] = useState(true);

  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <ChevronDown
            onClick={() => setShow(!show)}
            className={`${styles.icon} ${show ? styles.open : ""}`}
          />
          <h3 className={styles.title}>Påmeldte deltagere</h3>
        </div>
        <div className={styles.tag}>
          <p>{participants.length} total</p>
        </div>
      </div>
      {show && (
        <div className={styles.participants}>
          {participants.map((name, index) => (
            <Participant key={index} name={name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantsInfo;
