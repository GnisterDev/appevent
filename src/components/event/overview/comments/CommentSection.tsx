"use client";

// Kommentar-feltet, der vi henter funksjon for å skrive kommentar: CommentInput, og funksjon for å vise kommentar: CommentItem
import React, { useState } from "react";
import styles from "./commentsection.module.css";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

interface Comment {
  text: string;
  user: string;
}

const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleAddComment = (text: string, userID: string) => {
    if (!text.trim()) return;

    const newComment = { user: userID, text: text };
    setComments(prevComments => [...prevComments, newComment]);
  };

  return (
    <div className={styles.commentContainer}>
      <h3>Kommentarer</h3>
      <div className={styles.commentWrapper}>
        {comments.map((comment, index) => (
          <CommentItem key={index} text={comment.text} user={comment.user} />
        ))}
      </div>
      <CommentInput onAddComment={handleAddComment} />
    </div>
  );
};

export default CommentSection;
