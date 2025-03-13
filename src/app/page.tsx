"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { useLogout } from "../firebase/AuthService";
import { useTranslations } from "next-intl";
import Loading from "@/components/Loading";

import EventSearch from "@/components/eventSearch/EventSearch";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const t = useTranslations("HomePage");

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

  if (loading) {
    return <Loading />;
  }

  const signOut = async () => {
    useLogout()
      .then(() => router.push("/signin"))
      .catch(() => console.log("Failed to sign out"));
  };

  return (
    <div className={styles.page}>
      <button onClick={signOut}>Sign Out</button>
      <main className={styles.main}>
        <div>
          {t("subtext")}
          <code>{t("subtext-bold")}</code>
        </div>
        <button onClick={signOut}>{t("signOut")}</button>
        {/*SØKEFELT FOR ARRANGEMENTER*/}
        <EventSearch />
      </main>
    </div>
  );
}
