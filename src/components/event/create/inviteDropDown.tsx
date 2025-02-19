"use client";

import React from "react";

interface InviteDropdownProps {
  availableUsers: string[];
  onSelectUser: (user: string) => void; // Definerer hvilke props komponenten forventer
}

const InviteDropDown: React.FC<InviteDropdownProps> = ({
  availableUsers,
  onSelectUser,
}) => {
  return (
    <div className="dropdown-menyen">
      <h3>Inviter venner</h3>
      <ul>
        {availableUsers.map((user, index) => (
          <li key={index}>
            <button onClick={() => onSelectUser(user)}>{user}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InviteDropDown;
