"use client";

import React from "react";

const EventTag = ({ text, tagToRemove }) => {
  return (
    <div>
      {text}
      <button onClick={tagToRemove}>✖</button>
    </div>
  );
};

export default EventTag;
