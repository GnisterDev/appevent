"use client";

// Kommentar-feltet, der vi henter funksjon for å skrive kommentar: CommentInput, og funksjon for å vise kommentar: CommentItem
import React, { useState } from "react";
import styles from "./commentsection.module.css";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

interface Comment {
  id: number;
  text: string;
  userID: string;
}

const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleAddComment = (text: string, userID: string) => {
    const newComment = { id: comments.length + 1, text, userID };
    setComments([...comments, newComment]);
  };

  return (
    <div>
      <CommentInput onAddComment={handleAddComment} />
      <h3>Kommentarer</h3>
      <div>
        {comments.map((comment, index) => (
          <CommentItem
            key={index}
            text={comment.text}
            userID={comment.userID}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
