import React, { useContext, useState } from "react";
import styles from "./participantsInfo.module.css";
import Participant from "./Participant";
import { ChevronDown } from "lucide-react";
import { EventDisplayContext } from "@/firebase/contexts";
import { useTranslations } from "next-intl";

const ParticipantsInfo: React.FC = () => {
  const t = useTranslations("Event.Info");
  const [show, setShow] = useState(true);
  const { participants } = useContext(EventDisplayContext);

  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <ChevronDown
            onClick={() => setShow(!show)}
            className={`${styles.icon} ${show && styles.open}`}
            data-testid="chevron-icon"
          />
          <h3 className={styles.title}>{t("registeredParticipants")}</h3>
        </div>
        <div className={styles.tag}>
          <p>
            {participants.length} {t("total")}
          </p>
        </div>
      </div>
      {show && (
        <div className={styles.participants}>
          {participants.map((user, index) => (
            <Participant key={index} name={user.name} userID={user.userID} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantsInfo;
