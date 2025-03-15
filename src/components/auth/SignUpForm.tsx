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

const SignInForm = () => {
  const router = useRouter();

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
          Registrer deg
        </h3>
        <p style={{ fontSize: ".9rem" }}>
          Opprett en ny konto for å komme i gang
        </p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputs}>
          <AuthInput
            label="Navn"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Navn"
            icon={<User size={"1rem"} />}
            required
          />
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
          <Button text={"Registrer deg"} className={styles.loginButton} />
          <p>
            Har du allerede en konto?{" "}
            <Link href={"/signin"} className={styles.link}>
              Logg inn
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
