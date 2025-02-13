"use client";

import React, { useState } from "react";
import styles from "./signIn.module.css";
import { useRouter } from "next/navigation";
import { useLogin } from "@/firebase/AuthService";
import { LoginRequest } from "@/firebase/User";

const SignIn = () => {
  const router = useRouter();

  //Brukernavn og passord
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Hindrer siden fra å laste inn på nytt
    useLogin(formData)
      .then(() => router.push("/"))
      .catch(err => console.log(err));
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1> Logg inn! </h1>
        <br></br>
        <label> Email </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <br></br>
        <label> Passord </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Passord"
        />

        <button type="submit" className="registrerButton">
          Logg inn
        </button>

        <button type="button" onClick={() => router.push("/signUp")}>
          Har ikke bruker
        </button>
      </form>
    </div>
  );
};

export default SignIn;
