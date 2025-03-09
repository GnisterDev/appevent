"use client";
import React from "react";
import { useAuth } from "@/firebase/AuthService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import styles from "./profile.module.css";

const ForwardToProfile = () => {
  const { userID } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userID) {
      router.push(`/profile/${userID}`);
    }
  }, [userID, router]);

  return (
    <div className={styles.container}>
      <LoaderCircle size={"5rem"} />
    </div>
  );
};

export default ForwardToProfile;
