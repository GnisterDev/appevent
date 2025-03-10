import React, { useContext } from "react";
import styles from "./eventinfo.module.css";
import { Calendar, MapPin, Users } from "lucide-react";
import Tag from "@/components/event/Tag";
import { EventContext } from "@/app/event/[id]/page";

const EventInfo: React.FC = () => {
  const { eventData } = useContext(EventContext);
  if (!eventData) return;

  return (
    <div>
      <div>
        <h1 className={styles.title}>{eventData.title}</h1>
        <div className={styles.quickinfo}>
          <div className={styles.quickinfoElement}>
            <Calendar
              size={"1.25rem"}
              color={"var(--text-secondary)"}
              strokeWidth={2.25}
            />
            <span>{eventData.startTime.toDate().toLocaleDateString()}</span>
          </div>
          <div className={styles.quickinfoElement}>
            <MapPin
              size={"1.25rem"}
              color={"var(--text-secondary)"}
              strokeWidth={2.25}
            />
            <span>{eventData.location}</span>
          </div>
          <div className={styles.quickinfoElement}>
            <Users
              size={"1.25rem"}
              color={"var(--text-secondary)"}
              strokeWidth={2.25}
            />
            <span>{eventData.participants.length}</span>
          </div>
        </div>
      </div>
      <div className={styles.tags}>
        {eventData.tags.map((tag, index) => (
          <Tag key={index} text={tag} />
        ))}
      </div>
      <div className={styles.textArea}>
        <h2 className={styles.title}>Om arrangemanget</h2>
        <div className={styles.text}>{eventData.description}</div>
      </div>
    </div>
  );
};

export default EventInfo;
