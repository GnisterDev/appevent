"use client";

import React, { useState } from "react";
import styles from "./Auth.module.css";
import { useRouter } from "next/navigation";
import { useLogin } from "@/firebase/AuthService";
import { LoginRequest } from "@/firebase/User";
import { Lock, LogIn, Mail } from "lucide-react";
import Button from "../Button";
import Link from "next/link";
import AuthInput from "./AuthInput";

const SignIn = () => {
  const router = useRouter();
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
          Logg inn
        </h3>
        <p style={{ fontSize: ".9rem" }}>Logg inn med e-post og passord</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputs}>
          <AuthInput
            label="E-post"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-post"
            icon={<Mail size={"1rem"} />}
            required
          />
          <AuthInput
            label="Passord"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Passord"
            icon={<Lock size={"1rem"} />}
            required
          />
        </div>
        <div className={styles.buttons}>
          <Button text={"Logg In"} className={styles.loginButton} />
          <p>
            Har du ikke en konto?{" "}
            <Link href={"/signup"} className={styles.link}>
              Registrer deg
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
