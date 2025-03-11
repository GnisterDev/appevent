import React, { useContext, useState } from "react";
import styles from "./CreateEventComponents.module.css";
import { EventContext } from "@/firebase/Event";
import Tag from "../Tag";

const Details = () => {
  const { formData, updateFormData } = useContext(EventContext);
  const [tagInput, setTagInput] = useState("");

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;
    if (formData.tags.includes(trimmedTag)) return;
    updateFormData("tags", [...formData.tags, trimmedTag]);
    setTagInput("");
  };

  return (
    <div className={styles.module}>
      <h2>Detaljer</h2>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Beskrivelse</h3>
        <textarea
          name="description"
          className={`${styles.input} ${styles.textarea}`}
          value={formData.description}
          onChange={e => updateFormData(e.target.name, e.target.value)}
          placeholder="Fortell om arrangementet"
          required
        />
      </div>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Merkelapper</h3>
        <input
          type="text"
          name="tags"
          placeholder="Skriv merkelapp ogg trykk Enter"
          className={styles.input}
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={e => addTag(e)}
        />
        <div className={styles.tagGroup}>
          {formData.tags.map((tag, index) => (
            <Tag
              key={index}
              text={tag}
              onDelete={() =>
                updateFormData(
                  "tags",
                  formData.tags.filter(listTags => listTags !== tag)
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;
