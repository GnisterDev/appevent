import { UserMinus } from "lucide-react";
import React from "react";
import styles from "./participant.module.css";

interface ParticipantProps {
  name: string;
}

const Participant: React.FC<ParticipantProps> = ({ name }) => {
  return (
    <div className={styles.participant}>
      <p className={styles.name}>{name}</p>
      <div className={styles.icon}>
        <UserMinus size={"1rem"} />
      </div>
    </div>
  );
};

export default Participant;
