"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import Loading from "@/components/Loading";

import EventSearch from "@/components/eventSearch/EventSearch";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        router.push("/signin");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Loading />;

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 style={{ fontSize: "3rem" }}>
            Oppdag spennende{" "}
            <span style={{ color: "var(--primary)" }}>arrangementer</span>
          </h1>
          <p className={styles.subtext}>
            Finn og delta på arrangementer som passer deg. Opprett egne
            arrangementer og del opplevelsene med andre.
          </p>
        </div>
        <EventSearch />
      </div>
    </main>
  );
}
