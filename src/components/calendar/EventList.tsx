import { EventData } from "@/firebase/Event";
import React from "react";

function EventList({ events }: { events: EventData[] }) {
  return (
    <div>
      <h3>På disse arrangementene er du:</h3>
      <div>
        {events.map((event, key) => (
          <div key={key}>
            <p>{event.startTime.toString()}</p>
            <p>{event.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
