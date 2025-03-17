"use client";

import { Calendar, Plus, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import styles from "./Navbar.module.css";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitch from "./LanguageSwitch";

const Navbar = () => {
  const router = useRouter();
  const t = useTranslations("Navbar");

  return (
    <nav className={styles.navigationBar}>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <Link href="/" className={styles.flex_center}>
            <Calendar style={{ color: "var(--primary)" }} />
            <span className={styles.logoText}>{t("appName")}</span>
          </Link>
          <div className={`${styles.flex_center} ${styles.links}`}>
            <Link href="/" className={styles.link}>
              {t("explore")}
            </Link>
            <Link href="/" className={styles.link}>
              {t("yourEvents")}
            </Link>
            <Link href="/calendar" className={styles.link}>
              {t("calendar")}
            </Link>
          </div>
          <div className={styles.flex_center}>
            <Button
              onClick={() => router.push("/event/create")}
              text={t("create")}
              icon={<Plus />}
              className={styles.addEventButton}
            />
            <Link className={styles.profile} href={`/profile`}>
              <User />
            </Link>
          </div>
        </div>
      </div>
      <LanguageSwitch />
    </nav>
  );
};

export default Navbar;
