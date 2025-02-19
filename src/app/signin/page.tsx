"use client";

import SignIn from "@/components/auth/SignIn";
import React from "react";
import styles from "./signIn.module.css";

const signIn = () => {
  return (
    <main className={styles.page}>
      <SignIn />
    </main>
  );
};
export default signIn;
