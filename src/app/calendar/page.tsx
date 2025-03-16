"use client";

import React, { useEffect, useState } from "react";
import styles from "./calendar.module.css";
import EventList from "@/components/calendar/EventList";
import { useAuth } from "@/firebase/AuthService";
import { getEventsByRole } from "@/firebase/DatabaseService";
import { EventData } from "@/firebase/Event";

export default function Home() {
  const [eventsData, setEventsData] = useState<{
    invited: EventData[];
    registered: EventData[];
    organizer: EventData[];
  }>({ invited: [], registered: [], organizer: [] });

  const { userID } = useAuth();
  useEffect(() => {
    getEventsByRole("participant").then(data => {
      setEventsData(prev => ({
        ...prev,
        registered: data,
      }));
    });
  }, [userID]);

  return (
    <main className={styles.main}>
      <div>
        <h1>Liste over dine arrangementer</h1>
        <div className={styles.lists}>
          <div className={styles.list}><EventList role={"påmeldt"} events={eventsData.registered}  /></div>
          <EventList role={"ansvarlig"} events={eventsData.organizer} />
        </div>
      </div>
    </main>
  );
}
