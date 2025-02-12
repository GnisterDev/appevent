"use client";

import React from "react";
import styles from "./tags.module.css";
import { useRouter } from "next/navigation";

const EventTags = ({ tags }: { tags: string[] }) => {
  const router = useRouter();

  const handleTagClick = () => {
    router.push("/signup");
  };

  return (
    <div className={styles.tagsContainer}>
      {tags.map((tag, key) => {
        return (
          <div key={key} className={styles.tag} onClick={handleTagClick}>
            {` ${tag} `}
          </div>
        );
      })}
    </div>
  );
};

export default EventTags;
