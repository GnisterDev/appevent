"use client";

import React from "react";
import styles from "./commentInput.module.css";
import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CommentInput = ({
  onAddComment,
}: {
  onAddComment: (comment: string, userID: string) => void;
}) => {
  const [comment, setComment] = useState("");
  const [userID, setUserID] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    setUserID(storedUserID);
  });

  const handleSubmit = () => {
    if (!userID) {
      alert("Du må være logget inn for å kommentere!");
      return;
    }
    if (text.trim() == "") return;
    onAddComment(text, userID);
    setText(""); // Nullstiller etter kommentaren er sendt
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="..."
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default CommentInput;
