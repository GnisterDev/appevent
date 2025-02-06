"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import authService from "@/firebase/AuthService";

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    (await authService.signup(formData))
      .onSuccess(() => {
        console.log("success");
        router.push("/");
      })
      .onFailure(error => {
        console.log("error");
        console.error(error);
      })
      .finally(() => {
        console.log("done");
      });
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
