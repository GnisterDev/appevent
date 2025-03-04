import React from "react";
import styles from "./commentItem.module.css";

const CommentItem = ({ user, text }: { user: string; text: string }) => {
  return (
    <div className={styles.commentItem}>
      <p className={styles.commentUser}>{user}</p>
      <p className={styles.commenyText}>{text}</p>
    </div>
  );
};

export default CommentItem;
