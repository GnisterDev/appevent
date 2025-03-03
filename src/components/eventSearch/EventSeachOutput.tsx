"use client";
import styles from "./EventSearchOutput.module.css";
import React from "react";

const EventSearchOutput = () => {
  const handleItemClick = (e: React.MouseEvent<HTMLLIElement>) => {
    console.log("Trykket på:", e.currentTarget.textContent);
  };

  return (
    <div>
      {/*LISTER OPP ARRANGEMENTER */}
      <h3>Arrangementer</h3>
      <ul className={styles.arrangementOutput}>
        <li onClick={handleItemClick}> FOTBALLFEST</li>
        <li onClick={handleItemClick}>VINUNTZDAG</li>
        <li onClick={handleItemClick}>BEDPRESS MED BURGERKING</li>
      </ul>
    </div>
  );
};

export default EventSearchOutput;
