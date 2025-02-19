"use client";

import React from "react";

interface SelectedUsersProps {
  availableUsers: string[];
  selectedUsers: string[];
  onSelectUser: (user: string) => void; // Definerer hvilke props komponenten forventer
  onRemoveUser: (user: string) => void;
}

const SelectedUsers: React.FC<SelectedUsersProps> = ({
  availableUsers,
  selectedUsers,
  onSelectUser,
  onRemoveUser,
}) => {
  return (
    <div className="valgte-brukere">
      <h4>Inviterte: </h4>
      <select onChange={e => onSelectUser(e.target.value)} defaultValue="">
        {" "}
        {/** Når brukeren velger et navn, så kaller vi onSelectUser med brukeren navn, og defalutvalue sørger at vi starter uten valgt bruker */}
        <option value="" disabled>
          Velg en bruker
        </option>{" "}
        {/** Dette vises da først i dropdown menyen */}
        {/** Looper gjennom og viser brukere som ikke allerede er invitert i menyen, de som er invitert fjernes */}
        {availableUsers
          .filter(user => !selectedUsers.includes(user))
          .map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
      </select>
      <div className="inviterte-liste">
        <h4>Inviterte: </h4>
        {/** Viser liste over inviterte om det er inviterte brukere */}
        {selectedUsers.length > 0 ? (
          selectedUsers.map((user, index) => (
            <span key={index} className="bruker-tag">
              {user} <button onClick={() => onRemoveUser(user)}>✖</button>
            </span>
          ))
        ) : (
          <p>Ingen iniviterte</p>
        )}
      </div>
    </div>
  );
};

export default SelectedUsers;
