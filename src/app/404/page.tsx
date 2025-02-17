import Button from "@/components/Button";
import React from "react";
import styles from "./404.module.css";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className={styles.container}>
      <h1>404 - Fant ikke ressursen</h1>
      <p>Beklager, arrangementet du leter etter eksisterer ikke.</p>
      <Link href="/">
        <Button text="Tilbake til hjemmeside" className={styles.button} />
      </Link>
    </main>
  );
};

export default NotFound;
