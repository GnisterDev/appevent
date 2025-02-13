"use client";

import { Calendar, Plus, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import styles from "./Navbar.module.css";
import Button from "../Button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className={styles.navigationBar}>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <Link href="/" className={styles.flex_center}>
            <Calendar style={{ color: "var(--primary)" }} />
            <span className={styles.logoText}>Appevent</span>
          </Link>
          <div className={`${styles.flex_center} ${styles.links}`}>
            <Link href="/" className={styles.link}>
              Utforsk
            </Link>
            <Link href="/" className={styles.link}>
              Mine Arrangement
            </Link>
            <Link href="/" className={styles.link}>
              Kalender
            </Link>
          </div>
          <div className={styles.flex_center}>
            <Button
              onClick={() => router.push("/event")}
              text="Opprett Arrangement"
              icon={<Plus />}
              className={styles.addEventButton}
            />
            <Link className={styles.profile} href="/profile">
              <User />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
