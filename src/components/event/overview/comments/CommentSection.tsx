"use client";

// Kommentar-feltet, der vi henter funksjon for å skrive kommentar: CommentInput, og funksjon for å vise kommentar: CommentItem
import React, { useState } from "react";
import styles from "./commentsection.module.css";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { Comment, DefaultComment } from "@/firebase/Comment";

const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<Comment>();

  const handleAddComment = (text: string, userID: string, userName: string) => {
    if (!text.trim()) return;

    const newComment = { text, user: userID, name: userName };
    setComments(prevComments => [
      ...prevComments,
      { text, user: userID, name: userName },
    ]);
  };

  return (
    <div className={styles.commentContainer}>
      <h3>Kommentarer</h3>
      <CommentInput onAddComment={handleAddComment} />
      <div className={styles.commentWrapper}>
        {comments.map((comment, index) => (
          <CommentItem key={index} text={comment.text} name={comment.name} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
