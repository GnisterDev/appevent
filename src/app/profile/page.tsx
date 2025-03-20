"use client";
import React from "react";
import { useAuth } from "@/firebase/AuthService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading";

const ForwardToProfile = () => {
  const { userID } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userID) {
      router.push(`/profile/${userID}`);
    }
  }, [userID, router]);

  return <Loading />;
};

export default ForwardToProfile;
