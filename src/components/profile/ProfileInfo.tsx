import React from "react";
import styles from "./ProfileComponents.module.css";
import { useTranslations } from "next-intl";

const ProfileInfo = () => {
  const t = useTranslations("Profile.Info");
  return (
    <div className={styles.module}>
      <h2 className={styles.title}>{t("statistics")}</h2>
      <div>
        <div className={styles.statisticsInfo}>
          <span>{t("organized")}</span>
          <span style={{ fontWeight: "bold" }}>{"0"}</span>
        </div>
        <div className={styles.statisticsInfo}>
          <span>{t("enrolled")}</span>
          <span style={{ fontWeight: "bold" }}>{"0"}</span>
        </div>
        <div className={styles.statisticsInfo}>
          <span>{t("invitedTo")}</span>
          <span style={{ fontWeight: "bold" }}>{"0"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
