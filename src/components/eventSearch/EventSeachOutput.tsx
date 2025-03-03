"use client";
import styles from "./EventSearchOutput.module.css";
import React from "react";
import { useRouter } from "next/navigation";

const EventSearchOutput = () => {
  const router = useRouter();

  const handleItemClick = (e: React.MouseEvent<HTMLLIElement>) => {
    console.log("Trykket på:", e.currentTarget.textContent);

    //DUMMY arrangement man blir kastet til
    router.push("/event/9f38PGPK9RsyuCexqtFG");
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
