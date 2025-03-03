"use client";

import React, { useState } from "react";
import styles from "./eventSearch.module.css";
import { EVENT_GROUPS } from "@/firebase/Event";

const EventSearch = () => {
  const [arrType, setArrType] = useState("");
  const [dato, setDato] = useState("");
  const [nøkkelord, setNøkkelord] = useState("");
  const [sted, setSted] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArrType(e.target.value);
    console.log(e.target.value);
    //const { name, value } = e.target;
    //funksjon (e.target.value);
  };

  return (
    <div className={styles.søkefelt}>
      <h1> Søk etter et arrangement </h1>

    {/*/ DROPDOWN FOR Å VELGE TYPE ARR */}
      <select name="typeArr" value={arrType} onChange={handleChange} required>
        <option value="">Velg type arrangement</option>
        {Object.entries(EVENT_GROUPS).map(([groupName, events]) => (
          <optgroup key={groupName} label={groupName} className={styles.group}>
            {events.map(eventType => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <input type="text" name="title" placeholder="Nøkkelord" />
      <input type="text" name="location" placeholder="Sted" />
      <input type="date" name="date" />

      <p>Valgt arrangementstype: {arrType || "Ingen valgt"}</p>
    </div>
  );
};

export default EventSearch;
