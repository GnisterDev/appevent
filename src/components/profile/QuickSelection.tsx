import React, { useContext } from "react";
import styles from "./ProfileComponents.module.css";
import Button from "../Button";
import { Calendar, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/firebase/AuthService";
import { UserDisplayContext } from "@/firebase/contexts";
import { useTranslations } from "next-intl";

const QuickSelection = () => {
  const t = useTranslations("Profile.Info");
  const { userID } = useContext(UserDisplayContext);
  const router = useRouter();

  return (
    <div className={styles.module}>
      <h2 className={styles.title}>{t("quickSelection")}</h2>
      <div className={styles.column}>
        <Button
          text={t("myCalendar")}
          icon={<Calendar size={"1rem"} />}
          className={styles.button}
          onClick={() => router.push("/calendar")}
        />
        <Button
          text={t("settings")}
          icon={<Settings size={"1rem"} />}
          className={styles.button}
          onClick={() => router.push(`${userID}/edit`)}
        />
        <Button
          text={t("logout")}
          icon={<LogOut size={"1rem"} />}
          className={styles.logoutButton}
          onClick={() =>
            useLogout()
              .then(() => router.push("/signin"))
              .catch(() => console.log("Failed to sign out"))
          }
        />
      </div>
    </div>
  );
};

export default QuickSelection;
