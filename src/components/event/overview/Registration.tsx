"use client";

import React from "react";
import styles from "./registration.module.css";
import Button from "@/components/Button";
import { Pencil, Share2, Ticket, Trash } from "lucide-react";
import { isAdministrator, isOrganizer } from "@/firebase/AuthService";
import { deleteEvent } from "@/firebase/DatabaseService";
import { useRouter } from "next/navigation";

const info = {
  Påmeldingsfirst: "{date}",
  "Ledige plasser": "{reg} av {total}",
};

interface RegistrationProps {
  eventID: string;
}

const Registration: React.FC<RegistrationProps> = ({ eventID }) => {
  const router = useRouter();
  const isAdmin = isAdministrator();
  const isOrg = isOrganizer(eventID);

  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <h3 className={styles.title}>{isOrg ? "Oversikt" : "Påmelding"}</h3>
        {!isOrg && (
          <p style={{ paddingTop: "0.5rem" }}>
            Sikre din plass på arrangementet
          </p>
        )}
      </div>
      <div style={{ padding: "1.5rem 0" }}>
        {Object.entries(info).map(([key, value]) => (
          <div className={styles.info} key={key}>
            <span>{key}</span>
            <span style={{ fontWeight: "bold" }}>{value}</span>
          </div>
        ))}
      </div>
      {isOrg && <h3>Du er organisator</h3>}
      <div className={styles.buttons}>
        <br />
        {isOrg ? (
          <Button
            text="Rediger"
            className={styles.editButton}
            icon={<Pencil size={"1.25rem"} />}
            onClick={() => router.push(`/event/${eventID}/edit`)}
          />
        ) : (
          <Button
            text="Meld meg på"
            className={styles.registerButton}
            icon={<Ticket size={"1.25rem"} />}
          />
        )}
        <Button
          text="Del arrangement"
          className={styles.shareButton}
          icon={<Share2 size={"1.25rem"} />}
        />
        {(isAdmin || isOrg) && (
          <Button
            onClick={() => {
              deleteEvent(eventID);
              router.push("/");
            }}
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
