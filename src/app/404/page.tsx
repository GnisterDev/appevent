import Button from "@/components/Button";
import React from "react";
import styles from "./404.module.css";
import Link from "next/link";
import { useTranslations } from "next-intl";

const NotFound = () => {
  const t = useTranslations("NotFound");

  return (
    <main className={styles.container}>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <Link href="/">
        <Button text={t("backButton")} className={styles.button} />
      </Link>
    </main>
  );
};

export default NotFound;
