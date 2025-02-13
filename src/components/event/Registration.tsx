"use client";

import React from "react";
import styles from "./registration.module.css";
import Button from "../Button";
import { Share2, Ticket, Trash } from "lucide-react";
import { isAdministrator } from "@/firebase/AuthService";

const info = {
  Påmeldingsfirst: "{date}",
  "Ledige plasser": "{reg} av {total}",
};

const Registration = () => {
  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <h3 className={styles.title}>Påmelding</h3>
        <p style={{ paddingTop: "0.5rem" }}>Sikre din plass på arrangementet</p>
      </div>
      <div style={{ padding: "1.5rem 0" }}>
        {Object.entries(info).map(([key, value]) => (
          <div className={styles.info} key={key}>
            <span>{key}</span>
            <span style={{ fontWeight: "bold" }}>{value}</span>
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        <Button
          text="Meld meg på"
          className={styles.registerButton}
          icon={<Ticket size={"1.25rem"} />}
        />
        <Button
          text="Del arrangement"
          className={styles.shareButton}
          icon={<Share2 size={"1.25rem"} />}
        />
        {isAdministrator() && (
          <Button
            text="Slett arrangement"
            className={styles.deleteButton}
            icon={<Trash size={"1.25rem"} />}
          />
        )}
      </div>
    </div>
  );
};

export default Registration;
