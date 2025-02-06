"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const signOut = async () => {
    await auth.signOut();
    router.push("/login");
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
