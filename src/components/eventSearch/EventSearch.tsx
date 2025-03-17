"use client";

import React, { useState } from "react";
import styles from "./eventSearch.module.css";
import inputStyles from "./SearchInput.module.css";
import { EVENT_GROUPS } from "@/firebase/Event";
import { eventSearch } from "@/firebase/DatabaseService";
import { DefaultSearch, Search } from "@/firebase/Search";
import { EventData } from "@/firebase/Event";
import SearchResult from "./SearchResult";
import Button from "../Button";
import SearchInput from "./SearchInput";
import { Calendar, Filter, MapPin, Search as SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const EventSearch = () => {
  const t = useTranslations("Search");
  const [filter, setFilter] = useState<Search>(DefaultSearch);

  //Nullstille filter
  const handleClearFilter = () => {
    setFilter(DefaultSearch);
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
    eventSearch(filter).then(setResults);
  };

  return (
    <>
      <div className={styles.container}>
        <SearchInput
          type="text"
          name="name"
          placeholder={t("searchAfter")}
          value={filter.name}
          onChange={handleChange}
          icon={<SearchIcon />}
        />
        <SearchInput
          type="text"
          name="location"
          placeholder={t("place")}
          value={filter.location}
          onChange={handleChange}
          icon={<MapPin />}
        />
        <SearchInput
          type="date"
          name="date"
          placeholder={t("chooseDate")}
          value={filter.date}
          onChange={handleChange}
          icon={<Calendar />}
        />
        <label className={inputStyles.inputContainer} htmlFor="type">
          <Filter size={"1rem"} />
          <select
            name="type"
            onChange={handleChange}
            required
            value={filter.type}
            className={inputStyles.input}
          >
            <option value="">{t("selectType")}</option>
            {Object.entries(EVENT_GROUPS).map(([groupName, events]) => (
              <optgroup
                key={groupName}
                label={groupName}
                className={styles.group}
              >
                {events.map(eventType => (
                  <option key={eventType} value={eventType}>
                    {eventType}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <Button
          text={t("search")}
          className={styles.searchButton}
          onClick={handleSearch}
        />
        <Button
          text={t("empty")}
          className={styles.emptyButton}
          onClick={handleClearFilter}
        />
      </div>
      {/*OUTPUT FOR ARR */}
      <div className={styles.outputList}>
        {results.map((event, key) => (
          <SearchResult key={key} event={event} />
        ))}
      </div>
    </>
  );
};

export default EventSearch;
