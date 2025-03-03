"use client";

import React, { useState } from "react";
import styles from "./eventSearch.module.css";
import { EVENT_GROUPS } from "@/firebase/Event";
import { eventSearch } from "@/firebase/DatabaseService";

const EventSearch = () => {
  const [filter, setFilter] = useState({
    arrType: "",
    title: "",
    location: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      [e.target.name]: e.target.value,
    }));

    eventSearch();
  };

  return (
    <div className={styles.søkefelt}>
      <h1> Søk etter et arrangement </h1>

      {/*/ DROPDOWN FOR Å VELGE TYPE ARR */}
      <select name="arrType" onChange={handleChange} required>
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

      {/*/ NAVN PÅ ARRANGEMENT*/}
      <input
        type="text"
        name="title"
        placeholder="Nøkkelord"
        value={filter.title}
        onChange={handleChange}
      />

      {/*/ LOKASJON*/}
      <input
        type="text"
        name="location"
        placeholder="Sted"
        value={filter.location}
        onChange={handleChange}
      />

      {/*/ DATO*/}
      <input
        type="date"
        name="date"
        value={filter.date}
        onChange={handleChange}
      />

      {/* VISER VALGTE FILTER TESTING */}
      <p>Valgt type: {filter.arrType || "Ingen valgt"}</p>
      <p>Nøkkelord: {filter.title || "Ingen valgt"}</p>
      <p>Sted: {filter.location || "Ingen valgt"}</p>
      <p>Dato: {filter.date || "Ingen valgt"}</p>
    </div>
  );
};

export default EventSearch;
