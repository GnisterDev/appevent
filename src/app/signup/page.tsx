"use client";

import SignUp from "@/components/auth/SignUpForm";
import React from "react";
import styles from "./signUp.module.css";
import Card from "@/components/Card";

const signUp = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.header}>
            <h1>Bli med i Appevent!</h1>
            <p>
              Registrer deg for å oppdage og dele arrangementer med venner og
              likesinnede.
            </p>
          </div>
          <Card
            title={"Oppdag arrangementer"}
            color="var(--secondary)"
            className={styles.card}
          >
            Del dine arrangementer med venner og få oversikt over hvem som
            deltar.
          </Card>
          <Card
            title={"Personlige tilpasninger"}
            color="color-mix(in srgb, var(--error) 25%, white)"
            className={styles.card}
          >
            Få tilpassede anbefalinger basert på dine interesser og tidligere
            deltakelser.
          </Card>
        </div>
        <div className={styles.form}>
          <SignUp />
        </div>
      </div>
    </main>
  );
};
export default signUp;
