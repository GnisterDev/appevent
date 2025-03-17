import { EventData } from "@/firebase/Event";
import React from "react";
import SearchResult from "../eventSearch/SearchResult";

interface EventListInterface {
  events: EventData[];
}

const EventList: React.FC<EventListInterface> = ({ events }) => {
  if (!events.length) return;

  return (
    <div>
      {events
        .sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
        .map((event, key) => (
          <SearchResult key={key} event={event} />
        ))}
    </div>
  );
};

export default EventList;
