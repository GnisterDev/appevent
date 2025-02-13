"use client";

import SignIn from "@/components/auth/SignIn";
import React from "react";
import styles from "./signIn.module.css";

const signIn = () => {
  return (
    <div className={styles.page}>
      <SignIn />
    </div>
  );
};
export default signIn;
