"use client";

// Kommentar-feltet, der vi henter funksjon for å skrive kommentar: CommentInput, og funksjon for å vise kommentar: CommentItem
import React, { useContext, useEffect, useState } from "react";
import styles from "./commentsection.module.css";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { Comment } from "@/firebase/Comment";
import {
  addComment,
  deleteComment,
  getComments,
} from "@/firebase/DatabaseService";
import { EventDisplayContext } from "@/firebase/contexts";
import { useTranslations } from "next-intl";

const CommentSection = () => {
  const t = useTranslations("Comment");
  const { eventID } = useContext(EventDisplayContext);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!eventID) return;

      setLoading(true);
      try {
        await getComments(eventID)
          .then(setComments)
          .catch(err => setError(err));
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [eventID]);

  const handleAddComment = async (content: string) => {
    if (!content.trim()) return;

    addComment(eventID, content).then(comment =>
      setComments(prev => [comment, ...prev])
    );
  };

  const handleRemoveComment = async (comment: Comment) => {
    deleteComment(eventID, comment.commentID);
    setComments(prev => prev.filter(c => c.commentID !== comment.commentID));
  };

  if (loading) return;

  return (
    <div className={styles.commentContainer}>
      <h3>{t("comments")}</h3>
      <CommentInput onAddComment={handleAddComment} />
      <div className={styles.commentWrapper}>
        {comments
          .sort((a, b) => b.time.seconds - a.time.seconds)
          .map((comment, index) => (
            <CommentItem
              key={index}
              comment={comment}
              onDelete={handleRemoveComment}
            />
          ))}
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CommentSection;
