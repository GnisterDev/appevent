import { UserMinus } from "lucide-react";
import React from "react";
import styles from "./participant.module.css";
import { useEventContext } from "@/app/event/[id]/page";
interface ParticipantProps {
  name: string;
}

const Participant: React.FC<ParticipantProps> = ({ name }) => {
  const { eventID } = useEventContext();

  const handleRemoveParticipant = () => {
    if (!eventID) return;
    console.log(`Removing participant ${name} from event ${eventID}`);
  };

  return (
    <div className={styles.participant}>
      <p className={styles.name}>{name}</p>
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
