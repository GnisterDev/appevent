import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  title: string;
  children: React.ReactNode;
  color: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, color, className }) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className={`${styles.card} ${className}`}
    >
      <h3 className={styles.title}>{title}</h3>
      <p>{children}</p>
    </div>
  );
};

export default Card;
