"use client";

import React, { useState } from "react";
import styles from "./eventSearch.module.css";
import { EVENT_GROUPS } from "@/firebase/Event";
import { eventSearch } from "@/firebase/DatabaseService";
import { Search } from "@/firebase/Search";
import { EventData } from "@/firebase/Event";

const EventSearch = () => {
  const [filter, setFilter] = useState<Search>({
    type: "",
    name: "",
    location: "",
    date: "",
  });

  //Oppdaterer feltet som endres. Dynamisk state oppdatering
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  //Lagrer resultat fra funksjonskall
  const [results, setResults] = useState<EventData[]>([]);

  //Når søkknapp trykkes på
  const handleSearch = async () => {
    const searchResults = await eventSearch(filter);
    setResults(searchResults);
    console.log(searchResults);
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

      {/*Søkeknaoo*/}
      <button onClick={handleSearch} className={styles.søkeknapp}>
        Søk
      </button>

      {/*OUTPUT FOR ARR */}
      <ul className={styles.outputListe}>
        {results.map(event => (
          <li key={event.id} className={styles.outputEvent}>
            {/*Tittel på arr og dato for start */}
            <h2>
              {event.title}{" "}
              {new Date(event.startTime.toDate()).toLocaleDateString()}{" "}
            </h2>
            <p> {event.tags}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventSearch;
