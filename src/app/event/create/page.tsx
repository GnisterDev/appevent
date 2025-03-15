"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DefaultEventData, EventData } from "@/firebase/Event";
import { createEvent } from "@/firebase/DatabaseService";
import { EventContext } from "@/firebase/contexts";
import BaseInformation from "@/components/event/create/BaseInformation";
import Details from "@/components/event/create/Details";
import Invites from "@/components/event/create/Invites";
import styles from "./styles.module.css";
import { UserData } from "@/firebase/User";

const CreateEventForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<EventData>(DefaultEventData);
  const [invitees, setInvitees] = useState<UserData[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createEvent(formData)
      .then(eventID => router.push(`/event/${eventID}`))
      .catch()
      .finally();
  };

  const updateFormData = (field: string, value: unknown) => {
    setFormData(
      prevData =>
        ({
          ...prevData,
          [field]: value,
        } as EventData)
    );
  };
  if (!formData) return;

  return (
    <EventContext.Provider value={{ formData, updateFormData }}>
      <main className={styles.main}>
        <form onSubmit={handleSubmit}>
          <h1 className={styles.title}>Lag arrangement</h1>
          <BaseInformation />
          <Details />
          {formData.private && (
            <Invites invitedUsers={invitees} setInvitedUsers={setInvitees} />
          )}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Opprett Arrangement
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.back()}
            >
              Avbryt
            </button>
          </div>
        </form>
      </main>
    </EventContext.Provider>
  );
};

export default CreateEventForm;
