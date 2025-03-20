import React, { useEffect, useState } from "react";
import styles from "./commentItem.module.css";
import { Comment } from "@/firebase/Comment";
import { getUser } from "@/firebase/DatabaseService";
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

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentUser}>
        <div>
          <strong>{author}</strong>{" "}
          <span>
            {comment.time
              .toDate()
              .toLocaleString("no-nb", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
              .replaceAll(".", "/")
              .replaceAll(",", "")}
          </span>
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
