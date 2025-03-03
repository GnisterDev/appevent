import Button from "@/components/Button";
import { UserPlus } from "lucide-react";
import React from "react";
import styles from "./Invites.module.css";

const Invites = () => {
  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <UserPlus size={"1.5rem"} />
        <h2>Inviter</h2>
      </div>
      <div className={styles.content}>
        <input
          type="email"
          placeholder="Skriv inn epost"
          className={styles.input}
        />
        <Button text="Inviter" className={styles.button} />
      </div>
    </div>
  );
};

export default Invites;
