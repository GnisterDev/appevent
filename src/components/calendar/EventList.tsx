import { EventData } from "@/firebase/Event";
import React from "react";
import Link from "next/link";
import styles from "./eventList.module.css";
import prototype from "Date";

function EventList({role, events }: { events: EventData[] }) {
  return (
    <div>
      <h3>På disse arrangementene er du {role}:</h3>
      <table>
        <tbody>
          {events.sort(
            (a,b)=>a.startTime>b.startTime?1:-1
          ).map((event, key) => (
          <tr key={key}>
            <td className={styles.date}>{event.startTime.toDate().toString()}</td>
            
              <td className={styles.title}><Link href={`/event/${event.id}`}>{event.title}</Link></td>
            
          </tr>
        ))}
        </tbody>
        
      </table>
    </div>
  );
}

export default EventList;
