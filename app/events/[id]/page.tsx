"use client";

import React from "react";
import { useParams } from "next/navigation";

const EventPage: React.FC = () => {
  const params = useParams();
  const id = params.id;

  return <h1>{id}</h1>;
};

export default EventPage;