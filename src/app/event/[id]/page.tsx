"use client";

import React, { useEffect, useState } from "react";
import styles from "./event.module.css";
import Registration from "@/components/event/Registration";
import EventInfo from "@/components/event/EventInfo";
import { useParams, useRouter } from "next/navigation";
import { getEvent } from "@/firebase/DatabaseService";
import { EventData } from "@/firebase/Event";

const EventView = () => {
  const router = useRouter();

  const { id } = useParams();
  const eventID = Array.isArray(id) ? id[0] : id;
  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    if (!eventID) return;

    getEvent(eventID).then(data => {
      if (data) setEvent(data);
      else router.push("/404");
    });
  }, [eventID]);

  return (
    <main className={styles.main}>
      <div className={styles.eventGrid}>
        <div className={styles.eventInfo}>
          <div className={styles.pictureframe}>
            <div className={styles.picture}></div>
          </div>
          <EventInfo
            title={event?.title ? event.title : "Ingen tittel"}
            description={
              event?.description ? event.description : "Ingen beskrivelse"
            }
            date={
              event?.startTime
                ? event.startTime.toDate().toLocaleDateString()
                : "No date available"
            }
            tags={event?.tags ? event.tags : []}
          />
        </div>
        <div className={styles.eventActions}>
          <Registration eventID={eventID || ""} />
        </div>
      </div>
    </main>
  );
};

export default EventView;
