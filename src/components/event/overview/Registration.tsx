"use client";

import React, { useContext, useState } from "react";
import styles from "./registration.module.css";
import Button from "@/components/Button";
import { Pencil, Share2, Ticket, TicketX, Trash } from "lucide-react";
import { isAdministrator } from "@/firebase/AuthService";
import { deleteEvent, getUser } from "@/firebase/DatabaseService";
import { useRouter } from "next/navigation";
import { EventDisplayContext } from "@/firebase/contexts";
import { DefaultUserData, UserData } from "@/firebase/User";

const Registration: React.FC = () => {
  const router = useRouter();
  const isAdmin = isAdministrator();
  const { eventID, isOrg, eventData, isPar } = useContext(EventDisplayContext);
  const [organizor, setOrganizor] = useState<UserData>(DefaultUserData);

  if (!eventID) return;
  if (!eventData) return;
  getUser(eventData.organizer.id).then(setOrganizor);

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
        <div className={styles.info}>
          <span>Arrangsjør</span>
          <span style={{ fontWeight: "bold" }}>
            {organizor.name || "Ukjent"}
          </span>
        </div>
        <div className={styles.info}>
          <span>Status</span>
          <span style={{ fontWeight: "bold" }}>
            {eventData?.private ? "Privat" : "Offentlig"}
          </span>
        </div>
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
        {!isOrg && !eventData.private && (
          <Button
            text="Meld meg på"
            className={styles.registerButton}
            icon={<Ticket size={"1.25rem"} />}
          />
        )}
        {eventData.private && isPar && !isOrg && (
          <Button
            text="Meld meg av"
            className={styles.registerButton}
            icon={<TicketX size={"1.25rem"} />}
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
