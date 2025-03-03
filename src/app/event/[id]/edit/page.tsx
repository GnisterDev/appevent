"use client";
import React from "react";
import styles from "./edit.module.css";
import BaseInformation from "@/components/event/create/BaseInformation";
import Invites from "@/components/event/create/Invites";

const EventEdit = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit}>
        <h1 className={styles.title}>Rediger arrangement</h1>
        <BaseInformation />
        <Invites />
      </form>
    </main>
  );
};

export default EventEdit;
