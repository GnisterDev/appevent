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
import { useTranslations } from "next-intl";

const Registration: React.FC = () => {
  const t = useTranslations("Event.Info");
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
        <h3 className={styles.title}>
          {isOrg ? t("organizorTitle") : t("participantTitle")}
        </h3>
        {!isOrg && <p style={{ paddingTop: "0.5rem" }}>{t("subtext")}</p>}
      </div>

      <div style={{ padding: "1.5rem 0" }}>
        <div className={styles.info}>
          <span>{t("organizor")}</span>
          <span style={{ fontWeight: "bold" }}>
            {eventData.organizer.id === getUserID()
              ? t("organizorIsYou")
              : organizor.name}
          </span>
        </div>
        <div className={styles.info}>
          <span>{t("status")}</span>
          <span style={{ fontWeight: "bold" }}>
            {eventData?.private ? t("private") : t("public")}
          </span>
        </div>
      </div>

      <div className={styles.buttons}>
        {isOrg && (
          <Button
            text={t("edit")}
            className={styles.editButton}
            icon={<Pencil size={"1.25rem"} />}
            onClick={() => router.push(`/event/${eventID}/edit`)}
          />
        )}

        {!isOrg && !isParticipating && !eventData.private && (
          <Button
            text={t("subscribe")}
            className={styles.registerButton}
            icon={<Ticket size={"1.25rem"} />}
            onClick={handleJoin}
          />
        )}
        {!isOrg && isParticipating && (
          <Button
            text={t("unsubscribe")}
            className={styles.registerButton}
            icon={<TicketX size={"1.25rem"} />}
            onClick={handleLeave}
          />
        )}

        <Button
          text={t("share")}
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
            text={t("delete")}
            className={styles.deleteButton}
            icon={<Trash size={"1.25rem"} />}
          />
        )}
      </div>
    </div>
  );
};

export default Registration;
