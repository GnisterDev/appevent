"use client";
import styles from "./EventSearchOutput.module.css";
import React from "react";
import { useRouter } from "next/navigation";

const EventSearchOutput = () => {
  const router = useRouter();

  const handleItemClick = (e: React.MouseEvent<HTMLLIElement>) => {
    console.log("Trykket på:", e.currentTarget.textContent);

    //DUMMY arrangement man blir kastet til
    router.push("/event/IvlQqr4hoYrGBBew2VR5");
  };

  return (
    <div>
      {/*LISTER OPP ARRANGEMENTER */}
      <h3>Arrangementer</h3>
      <ul className={styles.arrangementOutput}>
        <li onClick={handleItemClick}> Frokost Hos Oscar</li>
        <li onClick={handleItemClick}> 17.mai</li>
        <li onClick={handleItemClick}> BEDPRESS </li>
      </ul>
    </div>
  );
};

export default EventSearchOutput;
