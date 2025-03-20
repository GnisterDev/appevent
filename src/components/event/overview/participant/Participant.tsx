import React from "react";
import styles from "./participant.module.css";
import { useRouter } from "next/navigation";
interface ParticipantProps {
  name: string;
  userID: string;
}

const Participant: React.FC<ParticipantProps> = ({ name, userID }) => {
  const router = useRouter();

  return (
    <div className={styles.participant}>
      <p
        className={styles.name}
        onClick={() => router.push(`/profile/${userID}`)}
      >
        {name}
      </p>
    </div>
  );
};

export default Participant;
