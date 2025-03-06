import React from "react";
import styles from "./commentItem.module.css";

const CommentItem = ({
  user,
  name,
  text,
}: {
  user: string;
  name: string;
  text: string;
}) => {
  return (
    <div className={styles.commentItem}>
      <p className={styles.commentUser}>
        <strong>{name}</strong>
      </p>
      <p className={styles.commentText}>{text}</p>
    </div>
  );
};

export default CommentItem;
