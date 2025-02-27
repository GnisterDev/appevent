import React from "react";
import styles from "./addParticipant.module.css";
import Button from "@/components/Button";
import { UserPlus } from "lucide-react";

const AddParticipant = () => {
  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <h3 className={styles.title}>Administrer deltagere</h3>
        <p style={{ paddingTop: "0.5rem" }}>Håndter påmeldte deltagere</p>
      </div>
      <div className={styles.buttons}>
        <Button
          text="Legg til deltager"
          icon={<UserPlus size={"1.25rem"} />}
          className={styles.addButton}
        />
      </div>
    </div>
  );
};

export default AddParticipant;
