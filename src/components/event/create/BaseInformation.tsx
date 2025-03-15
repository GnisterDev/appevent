import React, { useContext } from "react";
import styles from "./CreateEventComponents.module.css";
import { Globe, Lock } from "lucide-react";
import Switch from "@/components/Switch";
import { EVENT_GROUPS } from "@/firebase/Event";
import { Timestamp } from "firebase/firestore";
import { EventContext } from "@/firebase/contexts";

const BaseInformation = () => {
  const { formData, updateFormData } = useContext(EventContext);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    const currentTime = formData.startTime?.toDate();

    newDate.setHours(
      currentTime ? currentTime.getHours() : 0,
      currentTime ? currentTime.getMinutes() : 0,
      0,
      0
    );

    updateFormData("startTime", Timestamp.fromDate(newDate));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const currentDate = formData.startTime?.toDate() || new Date();

    currentDate.setHours(hours, minutes, 0, 0);

    updateFormData("startTime", Timestamp.fromDate(currentDate));
  };

  return (
    <div className={styles.module}>
      <h2>Grunnleggende informasjon</h2>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Arrangementstittel</h3>
        <input
          type="text"
          name="title"
          placeholder="Skriv inn en tittel"
          className={styles.input}
          value={formData.title}
          onChange={e => updateFormData(e.target.name, e.target.value)}
          required
        />
      </div>
      <div className={styles.doubleInputGroup}>
        <div className={styles.singleInputGroup}>
          <h3 className={styles.title}>Dato</h3>
          <input
            type="date"
            name="date"
            className={styles.input}
            value={
              formData.startTime?.toDate().toISOString().split("T")[0] || ""
            }
            onChange={handleDateChange}
            required
          />
        </div>
        <div className={styles.singleInputGroup}>
          <h3 className={styles.title}>Tidspunkt</h3>
          <input
            type="time"
            name="time"
            className={styles.input}
            value={
              formData.startTime?.toDate().toTimeString().slice(0, 5) || ""
            }
            onChange={handleTimeChange}
            required
          />
        </div>
      </div>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Sted</h3>
        <input
          type="text"
          name="location"
          placeholder="Arrangementssted"
          maxLength={32}
          className={styles.input}
          value={formData.location}
          onChange={e => updateFormData(e.target.name, e.target.value)}
          required
        />
      </div>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Type</h3>
        <select
          className={styles.input}
          name="type"
          value={formData.type}
          onChange={e => updateFormData(e.target.name, e.target.value)}
          required
        >
          {Object.entries(EVENT_GROUPS).map(([groupName, events]) => (
            <optgroup
              key={groupName}
              label={groupName}
              className={styles.group}
            >
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
      <div className={styles.visibilityToggle}>
        <Switch
          on={formData.private}
          onClick={() => updateFormData("private", !formData.private)}
        />
        {!formData.private && (
          <>
            <Globe size={"1.5rem"} />
            <h3>Offentlig arrangement</h3>
          </>
        )}
        {formData.private && (
          <>
            <Lock size={"1.5rem"} />
            <h3>Privat arrangement</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default BaseInformation;
