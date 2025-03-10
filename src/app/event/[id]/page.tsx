"use client";
import React, { useEffect, useState } from "react";
import styles from "./event.module.css";
import Registration from "@/components/event/overview/Registration";
import EventInfo from "@/components/event/overview/EventInfo";
import { useParams, useRouter } from "next/navigation";
import { getAllParticipants, getEvent } from "@/firebase/DatabaseService";
import { EventData } from "@/firebase/Event";
import Participants from "@/components/event/overview/partcipant/ParticipantsInfo";
import { createContext, useContext } from "react";
import { LoaderCircle } from "lucide-react";
import { isOrganizer } from "@/firebase/AuthService";
import { User } from "@/firebase/User";

// Create Event Context
export const EventContext = createContext<{
  eventID: string | null;
  eventData: EventData | null;
  isOrg: boolean;
}>({
  eventID: null,
  eventData: null,
  isOrg: false,
});

export const useEventContext = () => useContext(EventContext);

const EventView = () => {
  const router = useRouter();
  const { id } = useParams();
  const eventID: string = Array.isArray(id) ? id[0] : id || "";
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOrg = isOrganizer(eventID);
  const [participantsInfo, setParticipantsInfo] = useState<User[]>([]);

  useEffect(() => {
    if (!eventID) {
      setError("Event ID not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    getEvent(eventID)
      .then(data => {
        if (data) {
          setEventData(data);
        } else {
          router.push("/404");
        }
      })
      .catch(err => setError(`Failed to load event details: ${err}`))
      .finally(() => setLoading(false));

    getAllParticipants(eventID)
      .then(setParticipantsInfo)
      .catch(err => setError(`Failed to load event details: ${err}`));
  }, [eventID, router]);

  if (loading)
    return (
      <div className={styles.loading}>
        <LoaderCircle size={"5rem"} />
      </div>
    );
  if (error) router.push("/404");
  if (!eventData) return;

  return (
    <EventContext.Provider value={{ eventID, eventData, isOrg }}>
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
              <Participants participants={participantsInfo} />
            </div>
          </div>
        </div>
      </main>
    </EventContext.Provider>
  );
};

export default EventView;
