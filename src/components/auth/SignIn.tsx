"use client";

import React, { useState } from "react";
import styles from "./signIn.module.css";
import { useRouter } from "next/navigation";
import { useLogin } from "@/firebase/AuthService";
import { LoginRequest } from "@/firebase/User";
import { useTranslations } from "next-intl";

const SignIn = () => {
  const router = useRouter();
  const t = useTranslations("Auth");

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
        <h1>{t("SignIn.title")}</h1>
        <br></br>
        <label>{t("email")}</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <br></br>
        <label>{t("password")}</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Passord"
        />

        <button type="submit" className="registrerButton">
          {t("SignIn.loginButton")}
        </button>

        <button type="button" onClick={() => router.push("/signup")}>
          {t("SignIn.noAccount")}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
