"use client";

import React from "react";
import styles from "./tags.module.css";

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className={styles.tagsContainer}>
      {tags.map((tag, key) => (
        <div key={key} className={styles.tag}>
          {tag}
        </div>
      ))}
    </div>
  );
};

export default EventTags;
