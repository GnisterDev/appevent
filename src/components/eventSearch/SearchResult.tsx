import { EventData } from "@/firebase/Event";
import React from "react";
import Tag from "../event/Tag";
import styles from "./SearchResult.module.css";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import Button from "../Button";

interface SearchResultInterface {
  event: EventData;
}

const EVENT_DESCRIPTION_CUTOFF = 50;

const SearchResult: React.FC<SearchResultInterface> = ({ event }) => {
  return (
    <div className={styles.outputEvent}>
      <div className={styles.picture}></div>
      <div className={styles.eventInfo}>
        <h3>{event.title}</h3>
        <div className={styles.infogrid}>
          <div className={styles.info}>
            <Calendar size={"1rem"} />
            {event.startTime
              .toDate()
              .toLocaleString("no-nb", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replaceAll(".", "/")
              .replaceAll(",", "")}
          </div>
          <div className={styles.info}>
            <Clock size={"1rem"} />{" "}
            {event.startTime
              .toDate()
              .toLocaleString("no-nb", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replaceAll(".", "/")
              .replaceAll(",", "")}
          </div>
          <div className={styles.info}>
            <MapPin size={"1rem"} /> {event.location}
          </div>
          <div className={styles.info}>
            <Users size={"1rem"} /> {event.participants.length}
          </div>
        </div>
        <p className={styles.description}>
          {event.description.length < EVENT_DESCRIPTION_CUTOFF
            ? event.description
            : `${event.description.substring(0, EVENT_DESCRIPTION_CUTOFF)}...`}
        </p>
        <div className={styles.tagDiv}>
          {event.tags.map((tag, index) => (
            <Tag key={index} text={tag} />
          ))}
        </div>
        <div className={styles.link}>
          <Link href={`event/${event.eventID}`}>
            <Button text="Se mer" className={styles.linkButton} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
