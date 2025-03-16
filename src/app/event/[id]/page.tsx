"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./event.module.css";
import Registration from "@/components/event/overview/Registration";
import EventInfo from "@/components/event/overview/EventInfo";
import { useParams, useRouter } from "next/navigation";
import { getAllParticipants, getEvent } from "@/firebase/DatabaseService";
import { EventData } from "@/firebase/Event";
import { EventDisplayContext } from "@/firebase/contexts";
import Participants from "@/components/event/overview/participant/ParticipantsInfo";
import { isOrganizer, isParticipant } from "@/firebase/AuthService";
import { UserData } from "@/firebase/User";
import Loading from "@/components/Loading";

const EventView = () => {
  const router = useRouter();
  const { id } = useParams();
  const eventID: string = Array.isArray(id) ? id[0] : id || "";
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOrg = isOrganizer(eventID);
  const isPar = isParticipant(eventID);
  const [participantsInfo, setParticipantsInfo] = useState<UserData[]>([]);

  const refreshInfo = useCallback(async () => {
    if (!eventID) return;
    getAllParticipants(eventID)
      .then(setParticipantsInfo)
      .catch(err => setError(`Failed to load participant details: ${err}`));
    getEvent(eventID)
      .then(setEventData)
      .catch(err => setError(`Failed to load event details: ${err}`));
  }, [eventID]);

  useEffect(() => {
    if (!eventID) {
      setError("Event ID not found");
      setLoading(false);
      return;
    }
    refreshInfo().finally(() => setLoading(false));
  }, [eventID, router]);

  if (!eventData) return;
  if (loading) return <Loading />;
  if (error) router.push("/404");
  if (eventData.private && !isPar) router.push("/404");

  return (
    <EventDisplayContext.Provider
      value={{
        eventID,
        eventData,
        isOrg,
        participants: participantsInfo,
        refreshInfo,
      }}
    >
      <main className={styles.main}>
        <div className={styles.eventGrid}>
          <div className={styles.eventInfo}>
            <div className={styles.pictureframe}>
              <div className={styles.picture}></div>
            </div>
            <EventInfo />
          </div>
          <div className={styles.eventActions}>
            <div className={styles.eventActionsInner}>
              <Registration />
              <Participants />
            </div>
          </div>
        </div>
      </main>
    </EventDisplayContext.Provider>
  );
};

export default EventView;
