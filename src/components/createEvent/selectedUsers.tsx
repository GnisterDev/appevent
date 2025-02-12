"use client";

import React from "react";

interface SelectedUsersProps {
  selectedUsers: string[];
  onRemoveUser: (user: string) => void;
}

const Temp = () => {
  return (
    <div className="valgte-brukere">
      <h4>Inviterte: </h4>
      {selectedUsers.map((user, index) => (
        <span key={index} className="bruker-tag">
          {user} <button onClick={() => onRemoveUser(user)}>✖</button>
        </span>
      ))}
    </div>
  );
};

export default Temp;
