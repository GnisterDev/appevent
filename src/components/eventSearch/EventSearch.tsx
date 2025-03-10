"use client";

import React, { useState } from "react";
import styles from "./eventSearch.module.css";
import { EVENT_GROUPS } from "@/firebase/Event";
import { eventSearch } from "@/firebase/DatabaseService";
import { Search } from "@/firebase/Search";

const EventSearch = () => {
  const [filter, setFilter] = useState<Search>({
    type: "",
    name: "",
    location: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value,
    }));

    eventSearch(filter).then(console.log);
  };

  return (
    <div className={styles.søkefelt}>
      <h1> Søk etter et arrangement </h1>

      {/*/ DROPDOWN FOR Å VELGE TYPE ARR */}
      <select name="type" onChange={handleChange} required>
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
        name="name"
        placeholder="Nøkkelord"
        value={filter.name}
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
      <p>Valgt type: {filter.type || "Ingen valgt"}</p>
      <p>Nøkkelord: {filter.name || "Ingen valgt"}</p>
      <p>Sted: {filter.location || "Ingen valgt"}</p>
      <p>Dato: {filter.date || "Ingen valgt"}</p>
    </div>
  );
};

export default EventSearch;
