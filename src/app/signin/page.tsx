"use client";

import SignIn from "@/components/auth/SignInForm";
import React from "react";
import styles from "./signIn.module.css";
import Card from "@/components/Card";

const signIn = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.info}>
          <div>
            <h1>Velommen tilbake!</h1>
            <p>
              Logg inn for å se dine arrangementer, administrere invitasjoner,
              og mer.
            </p>
          </div>
          <Card
            title={"Oppdag arrangementer"}
            color="var(--secondary)"
            className={styles.card}
          >
            Finn arrangementer i nærheten, delta i spennende arrangementer, og
            hold kontakten med venner.
          </Card>
        </div>
        <div className={styles.form}>
          <SignIn />
        </div>
      </div>
    </main>
  );
};
export default signIn;
