"use client";

import SignUp from "@/components/auth/SignUpForm";
import React from "react";
import styles from "./signUp.module.css";
import Card from "@/components/Card";
import { useTranslations } from "next-intl";

const signUp = () => {
  const t = useTranslations("Auth.SignUp");

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.header}>
            <h1>{t("title")}</h1>
            <p>{t("subtitle")}</p>
          </div>
          <Card
            title={t("cards.0.title")}
            color="var(--secondary)"
            className={styles.card}
          >
            {t("cards.0.content")}
          </Card>
          <Card
            title={t("cards.1.title")}
            color="color-mix(in srgb, var(--error) 25%, white)"
            className={styles.card}
          >
            {t("cards.1.content")}
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
