import React from "react";
import styles from "./AuthInput.module.css";

interface AuthInputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required: boolean;
  icon?: React.ReactNode;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  icon,
}) => {
  return (
    <div className={styles.module}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputContainer}>
        {icon}
        <input
          className={styles.input}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
};

export default AuthInput;
