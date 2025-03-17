"use client";

import React, { useState } from "react";
import styles from "./Auth.module.css";
import { useRouter } from "next/navigation";
import { useSignup } from "@/firebase/AuthService";
import { SignupRequest } from "@/firebase/User";
import { Lock, Mail, User, UserPlus } from "lucide-react";
import AuthInput from "./AuthInput";
import Button from "../Button";
import Link from "next/link";
import { useTranslations } from "next-intl";

const SignUpForm = () => {
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    useSignup(formData)
      .then(() => router.push("/"))
      .catch(err => console.log(err));
  };

  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <UserPlus size={"2rem"} />
          {t("SignUp.form.title")}
        </h3>
        <p style={{ fontSize: ".9rem" }}>{t("SignUp.form.subtitle")}</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputs}>
          <AuthInput
            label={t("name")}
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("Placeholder.name")}
            icon={<User size={"1rem"} />}
            required
          />
          <AuthInput
            label={t("email")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("Placeholder.email")}
            icon={<Mail size={"1rem"} />}
            required
          />
          <AuthInput
            label={t("password")}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t("Placeholder.password")}
            icon={<Lock size={"1rem"} />}
            required
          />
        </div>
        <div className={styles.buttons}>
          <Button
            text={t("SignUp.form.title")}
            className={styles.loginButton}
          />
          <p>
            {t("SignUp.form.prompt")}{" "}
            <Link href={"/signin"} className={styles.link}>
              {t("SignIn.form.title")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
