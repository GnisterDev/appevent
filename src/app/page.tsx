"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { useLogout } from "../firebase/AuthService";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        router.push("/login");
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
      .then(() => router.push("/login"))
      .catch(() => console.log("Failed to sign out"));
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div>
          This is the <code>HOMEPAGE</code>
        </div>
        <button onClick={signOut}>Sign Out</button>
      </main>
    </div>
  );
}
