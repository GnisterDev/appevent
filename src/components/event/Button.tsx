import React from "react";

interface ButtonProps {
  className?: string | string[];
  icon?: React.ReactElement;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ className, icon, text }) => {
  return (
    <button
      className={Array.isArray(className) ? className.join(" ") : className}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
