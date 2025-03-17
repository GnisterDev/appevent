"use client";

import React from "react";
import styles from "./commentInput.module.css";
import { useState, useEffect } from "react";
import { useAuth } from "@/firebase/AuthService";
import { getUser } from "@/firebase/DatabaseService";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";

const CommentInput = ({
  onAddComment,
}: {
  onAddComment: (content: string) => void;
}) => {
  const t = useTranslations("Comment");
  const [text, setText] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  const { userID } = useAuth();

  useEffect(() => {
    if (!userID) return;
    getUser(userID)
      .then(user => {
        setUserName(user.name);
      })
      .catch(error => {
        console.error("Failed to fetch user:", error);
      });
  }, [userID]);

  const handleSubmit = () => {
    if (text.trim() === "") return;

    if (!userID || !userName) {
      console.error("Feil: userID eller userName er ikke satt!");
      return;
    }

    console.log("Sender kommentar:", text, "fra bruker:", userName);

    onAddComment(text);
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
      <Button
        text={t("send")}
        onClick={handleSubmit}
        className={styles.commentButton}
      />
    </div>
  );
};

export default CommentInput;
