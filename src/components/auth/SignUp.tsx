"use client";

import React, { useState } from "react";
import styles from "./signIn.module.css";
import { useRouter } from "next/navigation";
import { useSignup } from "@/firebase/AuthService";
import { SignupRequest } from "@/firebase/User";
import { useTranslations } from "next-intl";

const SignInForm = () => {
  const router = useRouter();
  const t = useTranslations("Auth");

  //Brukernavn og passord
  const [formData, setFormData] = useState<SignupRequest>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); //Name email får verdien ... og Name password får verdien ...
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Hindrer siden fra å laste inn på nytt
    useSignup(formData)
      .then(() => router.push("/"))
      .catch(err => console.log(err));
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>{t("SignUp.title")}</h1>
        <br></br>
        <label>{t("SignUp.fullName")}</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />

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
        <label>{t("SignUp.choosePassword")}</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Passord"
        />
        <br></br>
        <label>{t("SignUp.repeatPassword")}</label>
        <input type="password" placeholder="Passord" />
        <button type="submit" className="registrerButton">
          {t("SignUp.registerButton")}
        </button>

        <button type="button" onClick={() => router.push("/signin")}>
          {t("SignUp.alreadyHaveAccount")}
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
