"use client";

import React, { useState } from "react";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import EventTag from "@/components/createEvent/tags";
import SelectedUsers from "@/components/createEvent/selectedUsers";

const CreateEventForm: React.FC = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    startDateTime: "",
    startTimeTime: "",
    endDateTime: "",
    endTimeTime: "",
    place: "",
    type: "",
    description: "",
    tags: [] as string[], // Endre fra string til string[], så vi kan lagre et array av strenger
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // For å komme mellom sider
  const [currentTag, setCurrentTag] = useState("");
  const [isPrivate, setIsPrivate] = useState(false); // Boolean for om det er trykket på privat-knappen, altså at arrangementet er privat
  // const [showInviteMenu, setShowInviteMenu] = useState(false); // Boolean for om menyen skal vises
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Array med navn på brukerne

  const availableUsers = ["Sindre", "Elin", "Patrick", "Oskar", "Ingrid"]; // Liste for å teste rullmeny-funksjonen

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Oppdaterer data ettersom bruker skriver inn i feltet, name tilsvarer ulik infoType
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // Hindrer skjemaet fra å sende seg selv, currentTag.trim tilsvarer skriften i tagen
    if (!currentTag.trim()) return; // Hvis key er enter og det er tekst, så går vi videre til koden under
    if (formData.tags.includes(currentTag.trim())) return;

    setFormData({
      ...formData,
      tags: [...formData.tags, currentTag.trim()],
    }); // Legger til en ny tag i formData sin tag-oversikt, og beholder dne gamle oversikten
    console.log(formData.tags);
  };

  const handleTagChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const value = e.target.value;
    console.log(value);
    setCurrentTag(value);
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    }); // Beholder alle andre tags som ikke er lik tagen vi vil fjerne
  };

  const togglePrivate = () => {
    setIsPrivate(!isPrivate);
    if (!isPrivate) {
      setSelectedUsers([]); // toggle betyr å bytte mellom true og false, hvis vi endrer fra privat til offentlig så fjernes menyen og listen over inviterte
    }
  };

  {
    /** const toggleInviteMenu = () => {
    setShowInviteMenu(!showInviteMenu); // Får opp "inviter"-knappen når man velger privat arrangement
  };*/
  }

  const handleSelectUser = (user: string) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]); // Legger til brukeren i listen om den ikke allerede er trykket på
    }
  };

  const handleRemoveUser = (user: string) => {
    setSelectedUsers(selectedUsers.filter(u => u !== user)); // Fjerner en bruker fra selectedUsers-listen, lager ny liste der alle utenom user beholdes
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <form className="create-event-form" onSubmit={handleSubmit}>
            <h2> Create Event</h2>

            <div className="form-group">
              <label htmlFor="eventName">Navn på arrangement: </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="Skriv her"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="startDateTime">Starttid: </label>

              <input
                type="date"
                id="startDateTime"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
                required
              />

              <input
                type="time"
                id="startTimeTime"
                name="startTimeTime"
                value={formData.startTimeTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDateTime">Sluttid: </label>
              <input
                type="date"
                id="endDateTime"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleChange}
                required
              />

              <input
                type="time"
                id="endTimeTime"
                name="endTimeTime"
                value={formData.endTimeTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="place">Sted: </label>
              <input
                type="text"
                id="place"
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="Adresse"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type arrangement: </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Velg type</option>
                <option value="party">Fest</option>
                <option value="familyGathering">Familie samling</option>
                <option value="festival">Festival</option>
                <option value="charity">Veldidighet</option>
                <option value="sportEvent">Sportsarrangement</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Beskrivelse: </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Skriv her"
                required
              />
            </div>

            <div className="form-group">
              <h3>TAGS: </h3>
              {formData.tags.map((value, key) => (
                <EventTag
                  key={key}
                  text={value}
                  tagToRemove={() => removeTag(value)}
                />
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="tags">Legg til tags: </label>
              <input
                id="tags"
                name="tags"
                value={currentTag}
                onChange={handleTagChange}
                onKeyDown={handleAddTag}
                placeholder="Add tag"
              />
            </div>

            <div className="form-group">
              {/** Privat-knappen styres her */}
              <button onClick={togglePrivate} className="gjor-privat-knapp">
                {isPrivate ? "Offentlig" : "Privat"}
              </button>

              {/** Viser kun menyen om arrangementet er privat */}
              {isPrivate && (
                <SelectedUsers
                  availableUsers={availableUsers}
                  selectedUsers={selectedUsers}
                  onSelectUser={handleSelectUser}
                  onRemoveUser={handleRemoveUser}
                />
              )}
            </div>

            <button type="submit" className="create-event-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;
