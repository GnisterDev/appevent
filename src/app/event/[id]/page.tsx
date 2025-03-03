"use client";

import React, { useEffect, useState } from "react";
import styles from "./event.module.css";
import Registration from "@/components/event/overview/Registration";
import EventInfo from "@/components/event/overview/EventInfo";
// import CommentSection from "@/components/event/overview/comments/CommentSection";
import { useParams, useRouter } from "next/navigation";
import { getEvent } from "@/firebase/DatabaseService";
import { EventData } from "@/firebase/Event";

const defaultText = {
  title: "Ingen tittel",
  description: "Ingen beskrivelse",
  date: "Ingen dato oppgitt",
  location: "Ingen lokasjon oppgitt",
};

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
            title={event?.title ? event.title : defaultText.title}
            description={
              event?.description ? event.description : defaultText.description
            }
            date={
              event?.startTime
                ? event.startTime.toDate().toLocaleDateString()
                : defaultText.date
            }
            tags={event?.tags ? event.tags : []}
            location={event?.location ? event.location : defaultText.location}
            participants={event?.participants ? event.participants.length : 0}
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
