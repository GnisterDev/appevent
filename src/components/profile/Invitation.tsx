import React from "react";
import styles from "./Invitation.module.css";
import Button from "../Button";
import { Check, X } from "lucide-react";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import { UserData } from "@/firebase/User";

interface InvitationInterface {
  event: DocumentReference<DocumentData, DocumentData>;
}

const Invitation: React.FC<InvitationInterface> = ({ event }) => {
  const [title, setTitle] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    const fetchEventData = async () => {
      const eventDoc = await getDoc(event);
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        setTitle(eventData.title);
        setStartTime(
          new Date(eventData.startTime.seconds * 1000).toLocaleDateString()
        );

        const organizerDoc = await getDoc(eventData.organizer);
        if (organizerDoc.exists()) {
          setOrganizerName((organizerDoc.data() as UserData).name);
        }
      }
    };

    fetchEventData();
  }, [event]);

  return (
    <div className={styles.module}>
      <div className={styles.infoContainer}>
        <h3>{title}</h3>
        <p className={styles.info}>Arrangør: {organizerName}</p>
        <p className={styles.info}>Dato: {startTime}</p>
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
