"use client";

import React, { useState } from "react";
import styles from "./eventSearch.module.css";
import { EVENT_GROUPS } from "@/firebase/Event";

const EventSearch = () => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    return <h2> SUIIII </h2>;
  };

  return (
    <div className={styles.søkefelt}>
      <h1> Søk etter et arrangement </h1>
      <input type="date" />
      <input type="text" placeholder="Nøkkelord" />
      <input type="text" placeholder="Lokasjon" />

      <select
        //id="typeArr"
        name="typeArr"
        //value={typeArrangement}
        onChange={handleChange}
        required
      >
        <option value="">Velg type arrangement</option>
        {Object.entries(EVENT_GROUPS).map(([groupName, events]) => (
          <optgroup key={groupName} label={groupName} className={styles.group}>
            {events.map(eventType => (
              <option
                key={eventType}
                value={eventType}
                className={styles.option}
              >
                {eventType}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default EventSearch;
