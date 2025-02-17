// First, create a new file for the edit view: app/event/[id]/edit/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEvent, changeEvent } from "@/firebase/DatabaseService";
import styles from "./edit.module.css";
import Tag from "@/components/event/Tag";

const EventEdit = () => {
  const router = useRouter();
  const { id } = useParams();
  const eventID = Array.isArray(id) ? id[0] : id;
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    tags: [] as string[],
  });

  useEffect(() => {
    if (!eventID) return;
    getEvent(eventID).then(data => {
      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          startTime: data.startTime
            ? data.startTime.toDate().toISOString().split("T")[0]
            : "",
          tags: data.tags || [],
        });
      } else router.push("/404");
    });
  }, [eventID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventID) return;

    try {
      await changeEvent(eventID, {
        ...formData,
        startTime: new Date(formData.startTime),
      });
      router.push(`/event/${eventID}`);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...new Set([...prev.tags, tagInput.trim()])],
      }));
      setTagInput("");
    }
  };

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <h1>Rediger arrangement</h1>

        <div className={styles.formGroup}>
          <label htmlFor="title">Tittel</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Beskrivelse</label>
          <textarea
            className={styles.textarea}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location">Lokasjon</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startTime">Dato</label>
          <input
            type="date"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => handleAddTag(e)}
            placeholder="Press Enter to add tag"
          />
        </div>
        <div className={styles.tagGroup}>
          {formData.tags.map((tag, index) => (
            <Tag
              key={index}
              text={tag}
              onDelete={() =>
                setFormData(prev => ({
                  ...prev,
                  tags: prev.tags.filter(t => t !== tag),
                }))
              }
            />
          ))}
        </div>

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
  );
};

export default EventEdit;
