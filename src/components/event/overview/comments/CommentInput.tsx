"use client";

import React from "react";
import styles from "./commentInput.module.css";
import { useState, useEffect } from "react";

const CommentInput = ({
  onAddComment,
}: {
  onAddComment: (comment: string, userID: string, userName: string) => void;
}) => {
  const [userID, setUserID] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    const storedUserName = localStorage.getItem("userName");
    setUserID(storedUserID);
    setUserName(storedUserName);
  }, []);

  const handleSubmit = () => {
    if (text.trim() === "") return;

    if (!userID || !userName) {
      console.error("Feil: userID eller userName er ikke satt!");
      return;
    }

    console.log("Sender kommentar:", text, "fra bruker:", userName);

    onAddComment(text, userID, userName);
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
