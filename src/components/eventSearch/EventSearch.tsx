"use client";

import React, { useState } from "react";
import styles from "./eventSearch.module.css";
import { EVENT_GROUPS } from "@/firebase/Event";
import { eventSearch } from "@/firebase/DatabaseService";
import { Search } from "@/firebase/Search";
import { EventData } from "@/firebase/Event";
import { useRouter } from "next/navigation";

const EventSearch = () => {
  const router = useRouter();

  //Filter fra start
  const [filter, setFilter] = useState<Search>({
    type: "",
    name: "",
    location: "",
    date: "",
  });

  //Nullstille filter
  const handleClearFilter = () => {
    setFilter({
      type: "",
      name: "",
      location: "",
      date: "",
    });

    //Fjerner resultater
    setResults([]);
  };

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
  };

  //Når et output arrangement trykkes på, kan være undefined
  const handleClick = (clickedEventId: string | undefined) => {
    if (clickedEventId) {
      router.push(`/event/${encodeURIComponent(clickedEventId)}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1> Søk etter et arrangement </h1>

      {/*/ DROPDOWN FOR Å VELGE TYPE ARR */}
      <select name="type" onChange={handleChange} required value={filter.type}>
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
        placeholder="Navn"
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

      <br></br>
      {/*Søkeknapp*/}
      <button onClick={handleSearch} className={styles.button}>
        Søk
      </button>

      {/*Nullstille filter*/}
      <button onClick={handleClearFilter} className={styles.button}>
        Fjern filter
      </button>

      {/*OUTPUT FOR ARR */}
      <ul className={styles.outputListe}>
        {results.map(event => (
          //Hvert enkelt arrangement
          <li
            key={event.id}
            className={styles.outputEvent}
            onClick={() => handleClick(event.id)}
          >
            {/*Tittel på arr og dato for start */}
            <h2>
              {event.title}
              {" ("}
              {new Date(event.startTime.toDate()).toLocaleDateString()}
              {")"}
            </h2>

            {/*Beskrivelse*/}
            <p className={styles.outputLocation}>{event.location}</p>

            {/*Mapper hver enkelt tag fra eventtag (array)*/}
            <div className={styles.tagDiv}>
              {event.tags.map((tag, index) => (
                <span key={index} className={styles.outputTag}>
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventSearch;
