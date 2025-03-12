import React from "react";
import styles from "./ProfileComponents.module.css";
import Button from "../Button";
import { Calendar, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/firebase/AuthService";

const QuickSelection = () => {
  const router = useRouter();

  return (
    <div className={styles.module}>
      <h2 className={styles.title}>Hurtigvalg</h2>
      <div className={styles.column}>
        <Button
          text="Min kalender"
          icon={<Calendar size={"1rem"} />}
          className={styles.button}
          onClick={() => router.push("/calendar")}
        />
        <Button
          text="Innstilinger"
          icon={<Settings size={"1rem"} />}
          className={styles.button}
        />
        <Button
          text="Logg ut"
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
