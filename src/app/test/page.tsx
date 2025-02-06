"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import AuthService from "@/firebase/AuthService";
import { SignupRequest } from "@/firebase/User";

const SignIn: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupRequest>({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    AuthService.signup(formData)
      .onSuccess(() => console.log("Success"))
      .onFailure(() => console.log("Failure"))
      .finally(() => console.log("Finally"));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <form className="signin-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

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
