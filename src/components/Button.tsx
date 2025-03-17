import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  className?: string;
  icon?: React.ReactElement;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ className, icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className}`}
      data-testid={`button-${text}`}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
