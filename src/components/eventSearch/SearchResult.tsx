import { EventData } from "@/firebase/Event";
import React from "react";
import Tag from "../event/Tag";
import styles from "./eventSearch.module.css";
import Link from "next/link";

interface SearchResultInterface {
  event: EventData;
}

const SearchResult: React.FC<SearchResultInterface> = ({ event }) => {
  return (
    <Link href={`/event/${event.eventID}`}>
      <li key={event.eventID} className={styles.outputEvent}>
        {/*Tittel på arr og dato for start */}
        <h2>
          {event.title}
          {" ("}
          {new Date(event.startTime.toDate()).toLocaleDateString()}
          {")"}
        </h2>

        {/*Beskrivelse*/}
        <p className={styles.outputLocation}>{event.location}</p>

        {/*Mapper hver enkelt tag fra eventtag (array)*/}
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
