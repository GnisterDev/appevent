"use client";
import React, { useEffect, useState } from "react";
import styles from "./event.module.css";
import Registration from "@/components/event/overview/Registration";
import EventInfo from "@/components/event/overview/EventInfo";
import { useParams, useRouter } from "next/navigation";
import { getEvent } from "@/firebase/DatabaseService";
import { EventData } from "@/firebase/Event";
import Participants from "@/components/event/overview/partcipant/ParticipantsInfo";
import { createContext, useContext } from "react";
import { LoaderCircle } from "lucide-react";

// Create Event Context
export const EventContext = createContext<{
  eventID: string | null;
  eventData: EventData | null;
}>({
  eventID: null,
  eventData: null,
});

export const useEventContext = () => useContext(EventContext);

const EventView = () => {
  const router = useRouter();
  const { id } = useParams();
  const eventID: string = Array.isArray(id) ? id[0] : id || "";
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setEvent(data);
        } else {
          router.push("/404");
        }
      })
      .catch(err => {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
      })
      .finally(() => {
        console.log("Event loaded");
        setLoading(false);
      });
  }, [eventID, router]);

  if (loading)
    return (
      <div className={styles.loading}>
        <LoaderCircle size={"5rem"} />
      </div>
    );
  if (error) router.push("/404");
  if (!event) return;

  return (
    <EventContext.Provider value={{ eventID, eventData: event }}>
      <main className={styles.main}>
        <div className={styles.eventGrid}>
          <div className={styles.eventInfo}>
            <div className={styles.pictureframe}>
              <div className={styles.picture}></div>
            </div>
            <EventInfo
              title={event.title}
              description={event.description}
              date={event.startTime.toDate().toLocaleDateString()}
              tags={event.tags}
              location={event.location}
              participants={event.participants.length}
            />
          </div>
          <div className={styles.eventActions}>
            <div className={styles.eventActionsInner}>
              <Registration eventID={eventID} />
              <Participants
                participants={[
                  "User",
                  "User",
                  "User",
                  "User",
                  "User",
                  "User",
                  "User",
                  "User",
                  "User",
                  "User",
                  "User",
                ]}
              />
            </div>
          </div>
        </div>
      </main>
    </EventContext.Provider>
  );
};

export default EventView;
