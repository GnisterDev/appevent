"use client";

import React from "react";
import styles from "./commentInput.module.css";
import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CommentInput = ({
  onAddComment,
}: {
  onAddComment: (comment: string, userId: string) => void;
}) => {
  const [text, setText] = useState("");
  const router = useRouter();
  const userId = router.id as string; // Skal hente brukerens ID, skjønner ikke helt hvordan jeg gjør dette
};

const handleSubmit = () => {
  if (text.trim() == "") return;
  onAddcomment(text, userId);
  setText(""); // Nullstiller etter kommentaren er sendt
};
