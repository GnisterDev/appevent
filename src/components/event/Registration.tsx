"use client";
// @refresh reset

import React from "react";
import styles from "./registration.module.css";
import Button from "./Button";

const info = {
  Påmeldingsfirst: "{date}",
  "Ledige plasser": "{reg} av {total}",
};

const Registration = () => {
  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <h3 className={styles.title}>Påmelding</h3>
        <p style={{ paddingTop: "0.5rem" }}>Sikre din plass på arrangementet</p>
      </div>
      <div style={{ padding: "1.5rem 0" }}>
        {Object.entries(info).map(([key, value]) => (
          <div className={styles.info} key={key}>
            <span>{key}</span>
            <span style={{ fontWeight: "bold" }}>{value}</span>
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        <Button
          text="Meld meg på"
          icon="/event/ticket.svg"
          className={`${styles.button} ${styles.registerButton}`}
          svgStyle={`${styles.svg} ${styles.registerSVG}`}
        />
        <Button
          text="Del arrangement"
          icon="/event/share.svg"
          className={`${styles.button} ${styles.shareButton}`}
          svgStyle={styles.svg}
        />
      </div>
    </div>
  );
};

export default Registration;
