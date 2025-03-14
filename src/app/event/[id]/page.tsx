"use client";
import React, { useEffect, useState } from "react";
import styles from "./event.module.css";
import Registration from "@/components/event/overview/Registration";
import EventInfo from "@/components/event/overview/EventInfo";
import { useParams, useRouter } from "next/navigation";
import { getAllParticipants, getEvent } from "@/firebase/DatabaseService";
import { EventData } from "@/firebase/Event";
import { EventDisplayContext } from "@/firebase/contexts";
import Participants from "@/components/event/overview/participant/ParticipantsInfo";
import { LoaderCircle } from "lucide-react";
import { isOrganizer, isUserParticipant } from "@/firebase/AuthService";
import { UserData } from "@/firebase/User";

const EventView = () => {
  const router = useRouter();
  const { id } = useParams();
  const eventID: string = Array.isArray(id) ? id[0] : id || "";
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOrg = isOrganizer(eventID);
  const isParticipant = isUserParticipant(eventID);
  const [participantsInfo, setParticipantsInfo] = useState<UserData[]>([]);

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
  if (eventData.private && !isParticipant) router.push("/404");

  return (
    <EventDisplayContext.Provider
      value={{ eventID, eventData, isOrg, isParticipant }}
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
              <Participants participants={participantsInfo} />
            </div>
          </div>
        </div>
      </main>
    </EventDisplayContext.Provider>
  );
};

export default EventView;
