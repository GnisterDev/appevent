import React from "react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

const SearchInput: React.FC<SearchInputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  icon,
}) => {
  return (
    <label
      className={styles.inputContainer}
      htmlFor={name}
      data-testid={`input-${name}`}
    >
      {icon}
      <input
        className={styles.input}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
};

export default SearchInput;
