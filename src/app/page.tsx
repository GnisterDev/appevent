"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { useLogout } from "../firebase/AuthService";

import EventSearch from "@/components/eventSearch/EventSearch";
import EventSearchOutput from "@/components/eventSearch/EventSeachOutput";

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

  if (loading) {
    return <div>Loading...</div>;
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
        {/*SØKEFELT FOR ARRANGEMENTER*/}
        <EventSearch />

        {/*OUTPUT FOR ARR */}
        {["FEGFEGFEFEF"].map((value, key) => {
          return <div key={key}>{value}</div>;
        })}
      </main>
    </div>
  );
}
