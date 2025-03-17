import { EventData } from "@/firebase/Event";
import React from "react";
import SearchResult from "../eventSearch/SearchResult";
import styles from "./eventList.module.css";

interface EventListInterface {
  events: EventData[];
}

const EventList: React.FC<EventListInterface> = ({ events }) => {
  if (!events.length) return;

  return (
    <div className={styles.module}>
      {events
        .sort((a, b) => a.startTime.seconds - b.startTime.seconds)
        .map((event, key) => (
          <SearchResult key={key} event={event} />
        ))}
    </div>
  );
};

export default EventList;
