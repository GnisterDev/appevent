import React from "react";
import { User } from "lucide-react";
import styles from "./Invites.module.css";
import { UserData } from "@/firebase/User";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";

interface InviteeProps {
  user: UserData;
  onRemove: (userID: string) => void;
}

const Invitee: React.FC<InviteeProps> = ({ user, onRemove }) => {
  const t = useTranslations("Event.Manage.Invites");
  return (
    <div className={styles.invitee}>
      <div className={styles.invitee}>
        <div className={styles.inviteePicture}>
          <User size={"1.75rem"} />
        </div>
        <div className={styles.inviteeInfo}>
          <span style={{ fontWeight: "bold" }}>{user.name}</span>
          <span>{user.email}</span>
        </div>
      </div>
      <Button
        text={t("remove")}
        className={styles.inviteeRemove}
        onClick={e => {
          e.preventDefault();
          onRemove(user.userID);
        }}
      />
    </div>
  );
};

export default Invitee;
