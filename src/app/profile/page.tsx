"use client";
import React from "react";
import { useAuth } from "@/firebase/AuthService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ForwardToProfile = () => {
  const { userID } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userID) {
      router.push(`/profile/${userID}`);
    }
  }, [userID, router]);

  return <div>Redirecting</div>;
};

export default ForwardToProfile;
