"use client";

import React, { useState } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("User signed in:", userCredential.user);
      setFormData({
        email: "",
        password: "",
      });
      return router.push("/");
    } catch (err: any) {
      console.error("Error signing in:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className="signin-container">
        <form className="signin-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>

          {error && <p className="error-message">{error}</p>}

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

          <button type="submit" className="signin-button">
            Sign In
          </button>
          <button type="button" onClick={() => router.push("/signup")}>
            Go to Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
