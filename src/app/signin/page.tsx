"use client";

import SignIn from "@/components/auth/SignInForm";
import React from "react";
import styles from "./signIn.module.css";
import Card from "@/components/Card";
import { useTranslations } from "next-intl";

const signIn = () => {
  const t = useTranslations("Auth.SignIn");

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
        </div>
        <div className={styles.form}>
          <SignIn />
        </div>
      </div>
    </main>
  );
};
export default signIn;
