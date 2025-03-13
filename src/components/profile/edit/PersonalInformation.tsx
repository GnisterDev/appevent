import React, { useContext } from "react";
import styles from "./EditProfileComponents.module.css";
import { UserContext } from "@/firebase/contexts";
import { MapPin } from "lucide-react";

const PersonalInformation = () => {
  const { formData, updateFormData } = useContext(UserContext);

  return (
    <div className={styles.module}>
      <h2>Personlig informasjon</h2>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Navn</h3>
        <input
          type="text"
          name="name"
          placeholder="Skriv inn en visningsnavnet ditt"
          className={styles.input}
          value={formData.name}
          onChange={e => updateFormData(e.target.name, e.target.value)}
          required
        />
      </div>
      <div className={styles.singleInputGroup}>
        <div className={styles.title}>
          <MapPin size={"1rem"} />
          <h3 className={styles.title}>Lokasjon</h3>
        </div>
        <input
          type="text"
          name="location"
          placeholder="Skriv inn en visningsnavnet ditt"
          className={styles.input}
          value={formData.location}
          onChange={e => updateFormData(e.target.name, e.target.value)}
          required
        />
      </div>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Om meg</h3>
        <textarea
          name="description"
          className={`${styles.input} ${styles.textarea}`}
          value={formData.description}
          onChange={e => updateFormData(e.target.name, e.target.value)}
          placeholder="Fortell om deg selv"
          required
        />
      </div>
    </div>
  );
};

export default PersonalInformation;
