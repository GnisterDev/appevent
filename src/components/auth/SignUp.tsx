"use client";

import React, { useState }from "react";
import styles from "./signInForm.module.css";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const router = useRouter();

  //Brukernavn og passord
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value})
  };      
  

  return (
      <div className = {styles.container}>
          <h1> Registrer deg! </h1>
          <br></br>
          <label> Email </label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"/>
          <label> Passord </label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Passord"/>

          <p> Passordet ditt er: {formData.password}</p>

        <button type="submit" className="registrerButton">
          Registrer
        </button>
      </div> 
  );
};

export default SignInForm;
