import { EventData } from "@/firebase/Event";
import React from "react";
import Link from "next/link";
import styles from "./eventList.module.css"

function EventList({ events }: { events: EventData[] }) {
  return (
    <div>
      <h3>På disse arrangementene er du:</h3>
      <div>
        {events.map((event, key) => (
          <div key={key}>
            <p className="date">{event.startTime.toString()}</p>
            <Link href=""><p className="title">{event.title}</p></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
