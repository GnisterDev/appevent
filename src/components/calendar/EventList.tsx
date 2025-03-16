import { EventData } from "@/firebase/Event";
import React from "react";
import Link from "next/link";
import styles from "./eventList.module.css";

function EventList({role, events }: { events: EventData[] }) {
  return (
    <div>
      <h3>På disse arrangementene er du {role}:</h3>
      <table>
        <tbody>
          {events.map((event, key) => (
          <tr key={key}>
            <td className={styles.date}>{event.startTime.toString()}</td>
            
              <td className={styles.title}><Link href={`/event/${event.id}`}>{event.title}</Link></td>
            
          </tr>
        ))}
        </tbody>
        
      </table>
    </div>
  );
}

export default EventList;
