import React from "react";
import styles from "./BaseInformation.module.css";
import { Globe } from "lucide-react";
import Switch from "@/components/Switch";

const BaseInformation = () => {
  return (
    <div className={styles.module}>
      <h2>Grunnleggende informasjon</h2>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Arrangementstittel</h3>
        <input type="text" className={styles.input} />
      </div>
      <div className={styles.doubleInputGroup}>
        <div className={styles.singleInputGroup}>
          <h3 className={styles.title}>Dato</h3>
          <input type="date" className={styles.input} />
        </div>
        <div className={styles.singleInputGroup}>
          <h3 className={styles.title}>Tidspunkt</h3>
          <input type="time" className={styles.input} />
        </div>
      </div>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Sted</h3>
        <input type="text" className={styles.input} />
      </div>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Type</h3>
        <input type="text" className={styles.input} />
      </div>
      <div className={styles.visibilityToggle}>
        <Switch on={true} onClick={() => {}} />
        <Globe size={"1.5rem"} />
        <h3>Offentlig arrangement</h3>
      </div>
    </div>
  );
};

export default BaseInformation;
