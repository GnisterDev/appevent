"use client";

import React, { useState, useEffect } from "react";
import styles from "./registration.module.css";
import Button from "@/components/Button";
import { Pencil, Share2, Ticket, TicketX, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

// OBS: Pass på å importere disse fra dine filer
import { useAuth } from "@/firebase/AuthService";
import { isAdministrator, isOrganizer } from "@/firebase/AuthService";
import {
  getEvent,
  joinEvent,
  leaveEvent,
  deleteEvent,
} from "@/firebase/DatabaseService";
import { doc } from "firebase/firestore";
import { db } from "@/firebase/config";

// Viser litt info om arrangementet (eksempel)
const info = {
  Påmeldingsfrist: "{date}",
  "Ledige plasser": "{reg} av {total}",
};

interface RegistrationProps {
  eventID: string;
}

const Registration: React.FC<RegistrationProps> = ({ eventID }) => {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const isAdmin = isAdministrator();
  const isOrg = isOrganizer(eventID);
  const [isParticipating, setIsParticipating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkParticipation = async () => {
      try {
        if (!eventID) {
          setLoading(false);
          return;
        }

        if (!isLoggedIn || !user) {
          setIsParticipating(false);
          setLoading(false);
          return;
        }

        const eventData = await getEvent(eventID);
        if (!eventData || !eventData.participants) {
          setIsParticipating(false);
          setLoading(false);
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const found = eventData.participants.some(p => p.id === userRef.id);
        setIsParticipating(found);
        setLoading(false);
      } catch (error) {
        console.error("Feil ved henting av event:", error);
      }
    };

    checkParticipation();
  }, [eventID, isLoggedIn, user]);

  const handleJoin = async () => {
    if (!isLoggedIn) {
      alert("Du må være innlogget for å melde deg på.");
      return;
    }
    try {
      await joinEvent(eventID);
      setIsParticipating(true);
    } catch (err) {
      console.error("Feil ved påmelding:", err);
    }
  };

  const handleLeave = async () => {
    if (!isLoggedIn) {
      alert("Du må være innlogget for å melde deg av.");
      return;
    }
    try {
      await leaveEvent(eventID);
      setIsParticipating(false);
    } catch (err) {
      console.error("Feil ved avmelding:", err);
    }
  };

  if (loading) return;

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
        {isOrg && (
          <Button
            text="Rediger"
            className={styles.editButton}
            icon={<Pencil size={"1.25rem"} />}
            onClick={() => router.push(`/event/${eventID}/edit`)}
          />
        )}

        {!isOrg && isParticipating ? (
          <Button
            text="Meld meg av"
            className={styles.registerButton}
            icon={<TicketX size={"1.25rem"} />}
            onClick={handleLeave}
          />
        ) : (
          <Button
            text="Meld meg på"
            className={styles.registerButton}
            icon={<Ticket size={"1.25rem"} />}
            onClick={handleJoin}
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
