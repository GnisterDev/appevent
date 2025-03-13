import { UserMinus } from "lucide-react";
import React from "react";
import styles from "./participant.module.css";
import { useRouter } from "next/navigation";
interface ParticipantProps {
  name: string;
  userID: string;
}

const Participant: React.FC<ParticipantProps> = ({ name, userID }) => {
  const router = useRouter();

  const handleRemoveParticipant = () => {
    console.log(`Removing participant ${name} from event`);
  };

  return (
    <div className={styles.participant}>
      <p
        className={styles.name}
        onClick={() => router.push(`/profile/${userID}`)}
      >
        {name}
      </p>
      <div
        className={styles.icon}
        onClick={handleRemoveParticipant}
        aria-label={`Remove ${name}`}
      >
        <UserMinus size={"1rem"} />
      </div>
    </div>
  );
};

export default Participant;
