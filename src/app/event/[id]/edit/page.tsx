"use client";
import React, { useEffect, useState } from "react";
import styles from "./edit.module.css";
import BaseInformation from "@/components/event/create/BaseInformation";
import Invites from "@/components/event/create/Invites";
import { EventData } from "@/firebase/Event";
import { EventContext } from "@/firebase/contexts";
import { LoaderCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { changeEvent, getEvent } from "@/firebase/DatabaseService";
import Details from "@/components/event/create/Details";

const EventEdit: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const eventID = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventData>();

  useEffect(() => {
    if (!eventID) {
      setError("Event ID not found");
      setLoading(false);
      return;
    }

    getEvent(eventID)
      .then(data => {
        setFormData(data);
      })
      .catch(err => {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
      })
      .finally(() => {
        console.log("Event loaded");
        setLoading(false);
      });
  }, [eventID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventID) return;

    changeEvent(eventID, {
      ...formData,
    }).then(() => router.push(`/event/${eventID}`));
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

  if (loading)
    return (
      <div className={styles.loading}>
        <LoaderCircle size={"5rem"} />
      </div>
    );
  if (error) router.push("/404");
  if (!formData) return;

  return (
    <EventContext.Provider value={{ formData, updateFormData }}>
      <main className={styles.main}>
        <form onSubmit={handleSubmit}>
          <h1 className={styles.title}>Rediger arrangement</h1>
          <BaseInformation />
          <Details />
          {formData.private && <Invites />}
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
