"use client";

import SignUp from "@/components/auth/SignUp";
import React from "react";
import styles from "./signIn.module.css";

const signUp = () => {
  return (
    <div className={styles.page}>
      <SignUp />
    </div>
  );
};
export default signUp;
