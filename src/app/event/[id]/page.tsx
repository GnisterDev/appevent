"use client";

import React from "react";
import styles from "./event.module.css";
import Registration from "@/components/event/Registration";
import EventInfo from "@/components/event/EventInfo";

const EventView = () => {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.eventGrid}>
          <div className={styles.eventInfo}>
            <div className={styles.pictureframe}>
              <div className={styles.picture}></div>
            </div>
            <EventInfo />
          </div>
          <div className={styles.eventActions}>
            <Registration />
          </div>
        </div>
      </main>
    </>
  );
};

export default EventView;
