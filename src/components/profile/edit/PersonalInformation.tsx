import React, { useContext } from "react";
import styles from "./EditProfileComponents.module.css";
import { UserContext } from "@/firebase/contexts";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const PersonalInformation = () => {
  const t = useTranslations("Profile.Manage");
  const { formData, updateFormData } = useContext(UserContext);

  return (
    <div className={styles.module}>
      <h2>{t("personalInformation")}</h2>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>{t("name")}</h3>
        <input
          type="text"
          name="name"
          placeholder={t("namePlaceholder")}
          className={styles.input}
          value={formData.name}
          onChange={e => updateFormData(e.target.name, e.target.value)}
          required
        />
      </div>
      <div className={styles.singleInputGroup}>
        <div className={styles.title}>
          <MapPin size={"1rem"} />
          <h3 className={styles.title}>{t("location")}</h3>
        </div>
        <input
          type="text"
          name="location"
          placeholder={t("locationPlaceholder")}
          className={styles.input}
          value={formData.location}
          onChange={e => updateFormData(e.target.name, e.target.value)}
        />
      </div>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>{t("aboutMe")}</h3>
        <textarea
          name="description"
          className={`${styles.input} ${styles.textarea}`}
          value={formData.description}
          onChange={e => updateFormData(e.target.name, e.target.value)}
          placeholder={t("aboutMePlaceholder")}
        />
      </div>
    </div>
  );
};

export default PersonalInformation;
