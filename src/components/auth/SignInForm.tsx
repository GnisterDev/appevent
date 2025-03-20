"use client";

import React, { useState } from "react";
import styles from "./Auth.module.css";
import { useRouter } from "next/navigation";
import { useLogin } from "@/firebase/AuthService";
import { LoginRequest } from "@/firebase/User";
import { Lock, LogIn, Mail } from "lucide-react";
import Button from "@/components/Button";
import Link from "next/link";
import AuthInput from "./AuthInput";
import { useTranslations } from "next-intl";

const SignInForm = () => {
  const router = useRouter();
  const t = useTranslations("Auth");
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    useLogin(formData)
      .then(() => router.push("/"))
      .catch(err => console.log(err));
  };

  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <LogIn size={"2rem"} />
          {t("SignIn.form.title")}
        </h3>
        <p style={{ fontSize: ".9rem" }}>{t("SignIn.form.subtitle")}</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputs}>
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
            text={t("SignIn.form.title")}
            className={styles.loginButton}
          />
          <p>
            {t("SignIn.form.prompt")}{" "}
            <Link href={"/signup"} className={styles.link}>
              {t("SignUp.form.title")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
