"use client";
import React, { useEffect, useState } from "react";
import styles from "./edit.module.css";
import BaseInformation from "@/components/event/create/BaseInformation";
import Invites from "@/components/event/create/Invites";
import { DefaultEventData, EventData } from "@/firebase/Event";
import { EventContext } from "@/firebase/contexts";
import { useParams, useRouter } from "next/navigation";
import {
  changeEvent,
  getAllInvited,
  getEvent,
  inviteUsersToEvent,
} from "@/firebase/DatabaseService";
import Details from "@/components/event/create/Details";
import Loading from "@/components/Loading";
import { UserData } from "@/firebase/User";

const EventEdit: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const eventID = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventData>(DefaultEventData);
  const [invitees, setInvitees] = useState<UserData[]>([]);

  useEffect(() => {
    if (!eventID) {
      setError("Event ID not found");
      setLoading(false);
      return;
    }

    getAllInvited(eventID).then(setInvitees);

    getEvent(eventID)
      .then(setFormData)
      .catch(err => setError(`Failed to load event details, ${err}`))
      .finally(() => setLoading(false));
  }, [eventID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventID) return;

    inviteUsersToEvent(
      eventID,
      invitees.map(user => user.userID)
    ).catch(err => console.error("Error inviting users to event:", err));

    changeEvent(eventID, formData).then(() => router.push(`/event/${eventID}`));
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

  if (loading) return <Loading />;
  if (error) router.push("/404");

  return (
    <EventContext.Provider value={{ formData, updateFormData }}>
      <main className={styles.main}>
        <form onSubmit={handleSubmit}>
          <h1 className={styles.title}>Rediger arrangement</h1>
          <BaseInformation />
          <Details />
          {formData.private && (
            <Invites invitedUsers={invitees} setInvitedUsers={setInvitees} />
          )}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Lagre endringer
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

export default EventEdit;
