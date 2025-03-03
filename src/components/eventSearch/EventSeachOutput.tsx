"use client";
import styles from "./EventSearchOutput.module.css";
import React from "react";

const EventSearchOutput = () => {
  return (
    <div>
      {/*LISTER OPP ARRANGEMENTER */}
      <h3>Arrangementer</h3>
      <ul className={styles.arrangementOutput}>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
  );
};

export default EventSearchOutput;
