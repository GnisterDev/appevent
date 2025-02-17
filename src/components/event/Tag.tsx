import React from "react";
import { X } from "lucide-react";
import style from "./tag.module.css";

interface TagProps {
  text: string;
  onDelete?: () => void;
  color?: string;
}

const Tag = ({ text, onDelete, color }: TagProps) => {
  return (
    <div className={style.tag} style={{ backgroundColor: color }}>
      <span>{text}</span>
      {onDelete && (
        <div onClick={onDelete} className={style.delete}>
          <X size={"1.25rem"} />
        </div>
      )}
    </div>
  );
};

export default Tag;
