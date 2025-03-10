"use client";

import React, { useState, useEffect } from "react";
import styles from "./registration.module.css";
import Button from "@/components/Button";
import { Pencil, Share2, Ticket, Trash } from "lucide-react";
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

  // Henter ut brukerinfo og innloggingsstatus
  const { user, isLoggedIn } = useAuth();

  // Sjekker om brukeren er admin eller organisator for dette arrangementet
  const isAdmin = isAdministrator();
  const isOrg = isOrganizer(eventID);

  // Holder styr på om brukeren er påmeldt
  const [isParticipating, setIsParticipating] = useState(false);
  // Viser en liten «laster...»-status mens vi sjekker
  const [loading, setLoading] = useState(true);

  /**
   * useEffect:
   * - Henter event fra databasen
   * - Sjekker om innlogget bruker (user) finnes i participants-listen
   */
  useEffect(() => {
    const checkParticipation = async () => {
      try {
        // Hvis vi ikke har en eventID, kan vi ikke fortsette
        if (!eventID) {
          setLoading(false);
          return;
        }
        // Hvis ingen er innlogget, så er brukeren selvsagt ikke påmeldt
        if (!isLoggedIn || !user) {
          setIsParticipating(false);
          setLoading(false);
          return;
        }

        // Hent arrangementet
        const eventData = await getEvent(eventID);
        if (!eventData || !eventData.participants) {
          setIsParticipating(false);
          setLoading(false);
          return;
        }

        // Lag en referanse til brukerdokumentet
        const userRef = doc(db, "users", user.uid);
        // Sjekk om userRef finnes i participants-listen
        const found = eventData.participants.some(p => p.id === userRef.id);
        setIsParticipating(found);
      } catch (error) {
        console.error("Feil ved henting av event:", error);
      } finally {
        setLoading(false);
      }
    };

    checkParticipation();
  }, [eventID, isLoggedIn, user]);

  /**
   * Meld innlogget bruker på arrangementet
   */
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

  /**
   * Meld innlogget bruker av arrangementet
   */
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

  /**
   * Sletter arrangementet (om bruker er admin/organisator)
   * og sender brukeren til forsiden
   */
  const handleDelete = async () => {
    try {
      await deleteEvent(eventID);
      router.push("/");
    } catch (error) {
      console.error("Feil ved sletting av arrangement:", error);
    }
  };

  // Vis en enkel "laster..." mens vi sjekker status
  if (loading) {
    return (
      <div className={styles.module}>
        <p>Laster ...</p>
      </div>
    );
  }

  return (
    <div className={styles.module}>
      {/* Overskrift */}
      <div className={styles.header}>
        <h3 className={styles.title}>{isOrg ? "Oversikt" : "Påmelding"}</h3>
        {!isOrg && (
          <p style={{ paddingTop: "0.5rem" }}>
            Sikre din plass på arrangementet
          </p>
        )}
      </div>

      {/* Viser litt demo-informasjon */}
      <div style={{ padding: "1.5rem 0" }}>
        {Object.entries(info).map(([key, value]) => (
          <div className={styles.info} key={key}>
            <span>{key}</span>
            <span style={{ fontWeight: "bold" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Viser melding om du er organisator */}
      {isOrg && <h3>Du er organisator</h3>}

      {/* Knapperad */}
      <div className={styles.buttons}>
        <br />

        {/* Hvis organisator: Vis "Rediger"-knapp */}
        {isOrg && (
          <Button
            text="Rediger"
            className={styles.editButton}
            icon={<Pencil size={"1.25rem"} />}
            onClick={() => router.push(`/event/${eventID}/edit`)}
          />
        )}

        {/* Hvis IKKE organisator: Vis enten "Meld meg på" eller "Meld meg av" */}
        {!isOrg &&
          (isParticipating ? (
            <Button
              text="Meld meg av"
              className={styles.registerButton}
              icon={<Ticket size={"1.25rem"} />}
              onClick={handleLeave}
            />
          ) : (
            <Button
              text="Meld meg på"
              className={styles.registerButton}
              icon={<Ticket size={"1.25rem"} />}
              onClick={handleJoin}
            />
          ))}

        {/* Del arrangement-knapp */}
        <Button
          text="Del arrangement"
          className={styles.shareButton}
          icon={<Share2 size={"1.25rem"} />}
          onClick={() => {
            // Her kan du legge inn logikk for å dele arrangementet
            alert("Funksjonalitet for deling ikke implementert ennå.");
          }}
        />

        {/* Hvis admin eller organisator: Vis "Slett arrangement" */}
        {(isAdmin || isOrg) && (
          <Button
            onClick={handleDelete}
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
