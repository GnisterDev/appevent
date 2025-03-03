"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { useLogout } from "../firebase/AuthService";

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
      <main className={styles.main}>
        <button onClick={signOut}>Sign Out</button>

        {/*SØKEFELT FOR ARRANGEMENTER*/}
        <EventSearch />

        {/*/LISTER OPP ARRANGEMENTER */}
        <div>
          <h3>Arrangementer</h3>
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
