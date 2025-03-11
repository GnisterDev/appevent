"use client";

import React, { useContext } from "react";
import styles from "./registration.module.css";
import Button from "@/components/Button";
import { Pencil, Share2, Ticket, Trash } from "lucide-react";
import { isAdministrator } from "@/firebase/AuthService";
import { deleteEvent } from "@/firebase/DatabaseService";
import { useRouter } from "next/navigation";
import { EventDisplayContext } from "@/firebase/Event";

const info = {
  Påmeldingsfirst: "{date}",
  "Ledige plasser": "{reg} av {total}",
};

const Registration: React.FC = () => {
  const router = useRouter();
  const isAdmin = isAdministrator();
  const { eventID, isOrg } = useContext(EventDisplayContext);

  if (!eventID) return;

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
        {isOrg && (
          <Button
            text="Rediger"
            className={styles.editButton}
            icon={<Pencil size={"1.25rem"} />}
            onClick={() => router.push(`/event/${eventID}/edit`)}
          />
        )}
        {!isOrg && (
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
