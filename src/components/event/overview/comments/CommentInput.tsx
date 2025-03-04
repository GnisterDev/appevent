"use client";

import React from "react";
import styles from "./commentInput.module.css";
import { useState, useEffect } from "react";

const CommentInput = ({
  onAddComment,
}: {
  onAddComment: (comment: string, userID: string) => void;
}) => {
  const [userID, setUserID] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    setUserID(storedUserID);
  });

  const handleSubmit = () => {
    if (text.trim() == "") return;
    onAddComment(text, userID);
    setText(""); // Nullstiller etter kommentaren er sendt
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.commentInput}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="..."
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default CommentInput;
