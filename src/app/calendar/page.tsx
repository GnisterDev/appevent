"use client";

import React, { useEffect, useState } from "react";
import styles from "./calendar.module.css";
import EventList from "@/components/calendar/EventList";
import { useAuth } from "@/firebase/AuthService";
import { getEventsByRole } from "@/firebase/DatabaseService";
import { DefaultListEvents, ListEvents } from "@/firebase/Event";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Calendar");
  const [eventsData, setEventsData] = useState<ListEvents>(DefaultListEvents);

  const { userID } = useAuth();
  useEffect(() => {
    getEventsByRole().then(setEventsData);
  }, [userID]);

  return (
    <main className={styles.main}>
      <h1>{t("myEvents")}</h1>
      <div className={styles.lists}>
        {eventsData.registered.length != 0 && (
          <div>
            <h3>{t("registeredEvents")}</h3>
            <EventList events={eventsData.registered} />
          </div>
        )}
        {eventsData.organizer.length != 0 && (
          <div>
            <h3>{t("organizedEvents")}</h3>
            <EventList events={eventsData.organizer} />
          </div>
        )}
        {eventsData.invited.length != 0 && (
          <div>
            <h3>{t("invitedEvents")}</h3>
            <EventList events={eventsData.invited} />
          </div>
        )}
      </div>
    </main>
  );
}
