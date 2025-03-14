import Button from "@/components/Button";
import { UserPlus } from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import styles from "./CreateEventComponents.module.css";
import inviteStyles from "./Invites.module.css";
import { UserData } from "@/firebase/User";
import Invitee from "./Invitee";
import InviteResult from "./InvitesResult";
import { EventContext } from "@/firebase/contexts";
import { getDoc, DocumentReference } from "firebase/firestore";

interface InvitesProps {
  invitedUsers: UserData[];
  setInvitedUsers: (users: UserData[]) => void;
}

const Invites: React.FC<InvitesProps> = ({ invitedUsers, setInvitedUsers }) => {
  const { formData, updateFormData } = useContext(EventContext);
  const [search, setSearch] = useState<string>("");
  const [participants, setParticipants] = useState<UserData[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] =
    useState<boolean>(false);

  // Fetch participant data from document references
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!formData?.participants || formData.participants.length === 0) {
        setParticipants([]);
        return;
      }

      setIsLoadingParticipants(true);
      try {
        // Create an array of promises to get each document
        const participantPromises = formData.participants.map(
          async (docRef: DocumentReference) => {
            const userSnap = await getDoc(docRef);
            if (userSnap.exists()) {
              const userData = userSnap.data() as UserData;
              return {
                ...userData,
                userID: userSnap.id,
              };
            }
            return null;
          }
        );

        // Wait for all promises to resolve
        const users = await Promise.all(participantPromises);

        // Filter out any null values and the organizer
        const validUsers = users.filter(
          (user): user is UserData =>
            user !== null && user.userID !== formData.organizer?.id
        );

        setParticipants(validUsers);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setIsLoadingParticipants(false);
      }
    };

    fetchParticipants();
  }, [formData.participants, formData.organizer?.id]);

  const inviteUser = (user: UserData) => {
    setInvitedUsers([...invitedUsers, user]);
    setSearch("");
  };

  const removeInvite = (userID: string) => {
    setInvitedUsers(invitedUsers.filter(user => user.userID !== userID));
  };

  const removeParticipant = (userID: string) => {
    const updatedParticipants = formData.participants.filter(
      (participantRef: DocumentReference) => {
        const refId = participantRef.id;
        return refId !== userID;
      }
    );
    updateFormData("participants", updatedParticipants);
  };

  return (
    <div className={styles.module}>
      <div className={styles.title}>
        <UserPlus size={"1.5rem"} />
        <h2>Inviter</h2>
      </div>
      <div className={inviteStyles.content}>
        <input
          type="text"
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
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>
          Registrerte deltakere ({participants.length})
        </h3>
        <div className={inviteStyles.inviteeInfo}>
          {isLoadingParticipants ? (
            <div className={inviteStyles.loading}>Laster deltakere...</div>
          ) : participants.length > 0 ? (
            participants.map(user => (
              <Invitee
                key={user.userID}
                user={user}
                onRemove={removeParticipant}
              />
            ))
          ) : (
            <div className={inviteStyles.emptyState}>
              Ingen deltakere registrert ennå
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invites;
