import React from "react";
import styles from "./eventinfo.module.css";
import { Calendar, MapPin, Users } from "lucide-react";
import Tag from "@/components/event/Tag";

interface EventInfoProps {
  title: string;
  description: string;
  date: string;
  tags: string[];
  location: string;
  participants: number;
}

const EventInfo: React.FC<EventInfoProps> = ({
  title,
  description,
  date,
  tags,
  location,
  participants,
}) => {
  return (
    <div>
      <div>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.quickinfo}>
          <div className={styles.quickinfoElement}>
            <Calendar
              size={"1.25rem"}
              color={"var(--text-secondary)"}
              strokeWidth={2.25}
            />
            <span>{date}</span>
          </div>
          <div className={styles.quickinfoElement}>
            <MapPin
              size={"1.25rem"}
              color={"var(--text-secondary)"}
              strokeWidth={2.25}
            />
            <span>{location}</span>
          </div>
          <div className={styles.quickinfoElement}>
            <Users
              size={"1.25rem"}
              color={"var(--text-secondary)"}
              strokeWidth={2.25}
            />
            <span>{participants}</span>
          </div>
        </div>
      </div>
      <div className={styles.tags}>
        {tags.map((tag, index) => (
          <Tag key={index} text={tag} />
        ))}
      </div>
      <div className={styles.textArea}>
        <h2 className={styles.title}>Om arrangemanget</h2>
        <div className={styles.text}>{description}</div>
      </div>
    </div>
  );
};

export default EventInfo;
