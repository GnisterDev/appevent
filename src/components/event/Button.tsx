import React from "react";

interface ButtonProps {
  className?: string | string[];
  svgStyle?: string;
  icon: string;
  text: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, icon, text, svgStyle }) => {
  return (
    <button
      className={Array.isArray(className) ? className.join(" ") : className}
    >
      <img src={icon} alt="icon" className={svgStyle} />
      {text}
    </button>
  );
};

export default Button;
