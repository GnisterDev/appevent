"use client";

import React from "react";
import styles from "./tags.module.css";
import { useRouter } from "next/navigation";

const EventTags = ({ tags }: { tags: string[] }) => {
  const router = useRouter();

  return (
    <div className={styles.tagsContainer}>
      {tags.map((tag, key) => (
        <div
          key={key}
          className={styles.tag}
          onClick={() => router.push("./signin")}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default EventTags;
