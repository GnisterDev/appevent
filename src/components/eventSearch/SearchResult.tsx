import { EventData } from "@/firebase/Event";
import React from "react";
import Tag from "../event/Tag";
import styles from "./SearchResult.module.css";
import Link from "next/link";

interface SearchResultInterface {
  event: EventData;
}

const SearchResult: React.FC<SearchResultInterface> = ({ event }) => {
  return (
    <Link href={`/event/${event.eventID}`}>
      <li key={event.eventID} className={styles.outputEvent}>
        <h2>
          {event.title}
          {" ("}
          {new Date(event.startTime.toDate()).toLocaleDateString()}
          {")"}
        </h2>

        <p className={styles.outputLocation}>{event.location}</p>
        <div className={styles.tagDiv}>
          {event.tags.map((tag, index) => (
            <Tag key={index} text={tag} />
          ))}
        </div>
      </li>
    </Link>
  );
};

export default SearchResult;
