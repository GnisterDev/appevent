import React, { useEffect, useState } from "react";
import styles from "./commentItem.module.css";
import { Comment } from "@/firebase/Comment";
import { getUser } from "@/firebase/DatabaseService";
import { Timestamp } from "firebase/firestore";
import Button from "@/components/Button";
import { Trash } from "lucide-react";
import { isAdministrator } from "@/firebase/AuthService";

interface CommentItemInterface {
  comment: Comment;
  onDelete: (comment: Comment) => void;
}

const CommentItem: React.FC<CommentItemInterface> = ({ comment, onDelete }) => {
  const isAdmin = isAdministrator();
  const [author, setAuthor] = useState<string>("");

  useEffect(() => {
    getUser(comment.author.id).then(data => setAuthor(data.name));
  });

  function convertTimestamp(timestamp: Timestamp) {
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentUser}>
        <div>
          <strong>{author}</strong>{" "}
          <span>{convertTimestamp(comment.time)}</span>
        </div>
        {isAdmin && (
          <Button
            text=""
            icon={<Trash size={"1rem"} />}
            className={styles.deleteButton}
            onClick={() => onDelete(comment)}
          />
        )}
      </div>
      <p className={styles.commentText}>{comment.content}</p>
    </div>
  );
};

export default CommentItem;
