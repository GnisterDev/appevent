"use client";

// Kommentar-feltet, der vi henter funksjon for å skrive kommentar: CommentInput, og funksjon for å vise kommentar: CommentItem
import React, { useContext, useEffect, useState } from "react";
import styles from "./commentsection.module.css";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { Comment } from "@/firebase/Comment";
import { addComment, getComments } from "@/firebase/DatabaseService";
import { EventDisplayContext } from "@/firebase/contexts";
import { auth, db } from "@/firebase/config";
import { doc, Timestamp } from "firebase/firestore";

const CommentSection = () => {
  const eventData = useContext(EventDisplayContext);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!eventData || !eventData.eventID) return;

      setLoading(true);
      try {
        await getComments(eventData.eventID)
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
  }, [eventData]);

  const handleAddComment = async (content: string) => {
    if (!content.trim()) return;
    const comment = {
      author: doc(db, "users", auth.currentUser?.uid || "unknown"),
      content: content,
      time: Timestamp.now(),
    };
    addComment(eventData.eventID, comment);
    setComments(prev => [comment, ...prev]);
  };

  if (loading) return;

  return (
    <div className={styles.commentContainer}>
      <h3>Kommentarer</h3>
      <CommentInput onAddComment={handleAddComment} />
      <div className={styles.commentWrapper}>
        {comments
          .sort((a, b) => b.time.seconds - a.time.seconds)
          .map((comment, index) => (
            <CommentItem key={index} comment={comment} />
          ))}
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CommentSection;
