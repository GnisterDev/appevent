"use client";

import SignUp from "@/components/auth/SignUp";
import React from "react";
import styles from "./signIn.module.css";

const signUp = () => {
  return (
    <main className={styles.page}>
      <SignUp />
    </main>
  );
};
export default signUp;
