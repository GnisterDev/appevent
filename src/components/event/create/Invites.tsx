import Button from "@/components/Button";
import { UserPlus } from "lucide-react";
import React, { useState } from "react";
import styles from "./CreateEventComponents.module.css";
import inviteStyles from "./Invites.module.css";
import { UserData } from "@/firebase/User";
import Invitee from "./Invitee";
import InviteResult from "./InvitesResult";

interface InvitesProps {
  invitedUsers: UserData[];
  setInvitedUsers: (users: UserData[]) => void;
}

const Invites: React.FC<InvitesProps> = ({ invitedUsers, setInvitedUsers }) => {
  const [search, setSearch] = useState<string>("");

  const inviteUser = (user: UserData) => {
    setInvitedUsers([...invitedUsers, user]);
    setSearch("");
  };

  const removeInvite = (userID: string) => {
    setInvitedUsers(invitedUsers.filter(user => user.userID !== userID));
  };

  return (
    <div className={styles.module}>
      <div className={styles.title}>
        <UserPlus size={"1.5rem"} />
        <h2>Inviter</h2>
      </div>
      <div className={inviteStyles.content}>
        <input
          type="email"
          placeholder="Søk etter navn eller epost"
          className={styles.input}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button text="Inviter" className={inviteStyles.button} />
      </div>

      {search.length >= 3 && (
        <InviteResult
          search={search}
          invitedUsers={invitedUsers}
          onInvite={inviteUser}
        />
      )}

      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>
          Inviterte deltakere ({invitedUsers.length})
        </h3>
        <div className={inviteStyles.inviteeInfo}>
          {invitedUsers.length > 0 ? (
            invitedUsers.map(user => (
              <Invitee key={user.userID} user={user} onRemove={removeInvite} />
            ))
          ) : (
            <div className={inviteStyles.emptyState}>
              Ingen deltakere invitert ennå
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invites;
