import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import styles from "./Invites.module.css";
import { UserData } from "@/firebase/User";
import { userSearch } from "@/firebase/DatabaseService";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

interface InviteResultProps {
  search: string;
  invitedUsers: UserData[];
  onInvite: (user: UserData) => void;
}

const InviteResult: React.FC<InviteResultProps> = ({
  search,
  invitedUsers,
  onInvite,
}) => {
  const t = useTranslations("Event.Manage.Invites");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<UserData[]>([]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.length > 2) {
        await findUsers();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const findUsers = async () => {
    if (search.length < 3) return;

    setLoading(true);
    userSearch(search)
      .then(users => {
        const filteredUsers = users.filter(
          user => !invitedUsers.some(invited => invited.userID === user.userID)
        );
        setSearchResults(filteredUsers);
      })
      .catch(err => console.error("Error searching for users:", err))
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.searchResults}>
      {loading && <div className={styles.info}>{t("searching")}</div>}
      {!loading && search.length >= 3 && searchResults.length == 0 && (
        <div className={styles.info}>{t("noResults")}</div>
      )}
      {!loading &&
        searchResults.length > 0 &&
        searchResults.map((user, key) => (
          <div
            className={styles.invitee}
            onClick={() => onInvite(user)}
            key={key}
          >
            <div className={styles.invitee}>
              <div className={styles.inviteePicture}>
                <User size={"1.75rem"} />
              </div>
              <div className={styles.inviteeInfo}>
                <span style={{ fontWeight: "bold" }}>{user.name}</span>
                <span>{user.email}</span>
              </div>
            </div>
            <Button text={t("invite")} className={styles.inviteeAdd} />
          </div>
        ))}
    </div>
  );
};

export default InviteResult;
