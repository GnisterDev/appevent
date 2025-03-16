"use client";

import React, { useContext, useEffect, useState } from "react";
import styles from "./registration.module.css";
import Button from "@/components/Button";
import { Pencil, Share2, Ticket, TicketX, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserID, isAdministrator } from "@/firebase/AuthService";
import {
  joinEvent,
  leaveEvent,
  deleteEvent,
  isParticipant,
  getUser,
} from "@/firebase/DatabaseService";
import { EventDisplayContext } from "@/firebase/contexts";
import { DefaultUserData, UserData } from "@/firebase/User";

const Registration: React.FC = () => {
  const router = useRouter();
  const isAdmin = isAdministrator();
  const { eventID, isOrg, eventData, refreshInfo } =
    useContext(EventDisplayContext);
  const [isParticipating, setIsParticipating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [organizor, setOrganizor] = useState<UserData>(DefaultUserData);

  useEffect(() => {
    if (!eventID) return;
    if (!eventData) return;
    isParticipant(eventID)
      .then(setIsParticipating)
      .finally(() => setLoading(false));
    getUser(eventData.organizer.id).then(setOrganizor);
  }, [eventID, eventData]);

  const handleJoin = async () => {
    if (!eventID) return;
    joinEvent(eventID)
      .then(() => setIsParticipating(true))
      .catch(console.error)
      .finally(refreshInfo);
  };

  const handleLeave = async () => {
    if (!eventID) return;
    leaveEvent(eventID)
      .then(() => setIsParticipating(false))
      .catch(console.error)
      .finally(refreshInfo);
    if (eventData?.private) router.push("/");
  };

  if (!eventID) return;
  if (loading) return;
  if (!eventData) return;

  console.log(organizor.name);

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
            {eventData.organizer.id === getUserID() ? "Deg" : organizor.name}
          </span>
        </div>
        <div className={styles.info}>
          <span>Status</span>
          <span style={{ fontWeight: "bold" }}>
            {eventData?.private ? "Privat" : "Offentlig"}
          </span>
        </div>
      </div>

      <div className={styles.buttons}>
        {isOrg && (
          <Button
            text="Rediger"
            className={styles.editButton}
            icon={<Pencil size={"1.25rem"} />}
            onClick={() => router.push(`/event/${eventID}/edit`)}
          />
        )}

        {!isOrg && !isParticipating && !eventData.private && (
          <Button
            text="Meld meg på"
            className={styles.registerButton}
            icon={<Ticket size={"1.25rem"} />}
            onClick={handleJoin}
          />
        )}
        {!isOrg && isParticipating && (
          <Button
            text="Meld meg av"
            className={styles.registerButton}
            icon={<TicketX size={"1.25rem"} />}
            onClick={handleLeave}
          />
        )}

        <Button
          text="Del arrangement"
          className={styles.shareButton}
          icon={<Share2 size={"1.25rem"} />}
          onClick={() => {
            alert("Funksjonalitet for deling ikke implementert ennå.");
          }}
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
