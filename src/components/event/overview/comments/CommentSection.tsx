"use client";

import React, { useState } from "react";
import styles from "./commentsection.module.css";

interface Comment {
  id: number;
  text: string;
  userID: string;
}

const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const addComment = (text: string, userId: string) => {
    const newComment = { id: comments.length + 1, text, userId };
    setComments([...comments, newComment]);
  };
};
