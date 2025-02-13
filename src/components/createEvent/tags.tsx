"use client";

import React, { MouseEventHandler } from "react";

interface EventTagInterface {
  text: string;
  tagToRemove: MouseEventHandler;
}

const EventTag: React.FC<EventTagInterface> = ({ text, tagToRemove }) => {
  return (
    <div>
      {text}
      <button onClick={tagToRemove}>✖</button>
    </div>
  );
};

export default EventTag;
