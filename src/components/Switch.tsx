import React, { useState } from "react";
import styles from "./Switch.module.css";

interface SwitchProps {
  on?: boolean;
  onClick?: () => void;
}

const Switch: React.FC<SwitchProps> = ({ on = false, onClick }) => {
  const [isOn, setIsOn] = useState<boolean>(on);

  return (
    <div
      onClick={() => {
        setIsOn(!isOn);
        if (onClick) onClick();
      }}
      className={`${styles.switch} ${isOn && styles.switchOn}`}
      role="switch"
      aria-checked={isOn}
    >
      <div
        className={`${styles.knob}
      ${isOn && styles.knobOn}`}
      />
    </div>
  );
};

export default Switch;
