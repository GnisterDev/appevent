"use client";

import React, { useState } from "react";
import { auth } from "@/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("User created:", userCredential.user);
      setFormData({
        email: "",
        password: "",
      });
      return router.push("/");
    } catch (err: unknown) {
      console.error(
        "Error creating user:",
        err instanceof Error ? err.message : err
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
          <button type="button" onClick={() => router.push("/login")}>
            Go to Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
