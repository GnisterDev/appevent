"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DefaultEventData, EventData } from "@/firebase/Event";
import { createEvent, inviteUsersToEvent } from "@/firebase/DatabaseService";
import { EventContext } from "@/firebase/contexts";
import BaseInformation from "@/components/event/create/BaseInformation";
import Details from "@/components/event/create/Details";
import Invites from "@/components/event/create/Invites";
import styles from "./styles.module.css";
import { UserData } from "@/firebase/User";
import { useTranslations } from "next-intl";

const CreateEventForm: React.FC = () => {
  const t = useTranslations("Event.Manage");
  const router = useRouter();
  const [formData, setFormData] = useState<EventData>(DefaultEventData);
  const [invitees, setInvitees] = useState<UserData[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createEvent(formData)
      .then(eventID => {
        inviteUsersToEvent(
          eventID,
          invitees.map(user => user.userID)
        ).catch(err => console.error("Error inviting users to event:", err));
        router.push(`/event/${eventID}`);
      })
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
          <h1 className={styles.title}>{t("createTitle")}</h1>
          <BaseInformation />
          <Details />
          {formData.private && (
            <Invites invitedUsers={invitees} setInvitedUsers={setInvitees} />
          )}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              {t("createEventButton")}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.back()}
            >
              {t("cancelButton")}
            </button>
          </div>
        </form>
      </main>
    </EventContext.Provider>
  );
};

export default CreateEventForm;
