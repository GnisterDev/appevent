"use client";

import React, { useState }from "react";
import styles from "./signIn.module.css";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const router = useRouter();

  //Brukernavn og passord
  const [formData, setFormData] = useState({
    fornavn: "",
    etternavn: "",
    email: "",
    password: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value})  //Name email får verdien ... og Name password får verdien ...
  };      
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Hindrer siden fra å laste inn på nytt
    console.log(formData.fornavn + " Du er registrert!!");
    
  }

  return (
      <div className = {styles.container}>
        <form className = {styles.form} onSubmit={handleSubmit}>
          <h1> Registrer deg! </h1>
          <br></br>
          <label>Fult navn</label>
          <input  type="text" name="fornavn" value={formData.fornavn} onChange={handleChange} placeholder="Fornavn"/>
          <input  type="text" name="etternavn" value={formData.etternavn} onChange={handleChange} placeholder="Etternavn"/>
          <br></br>

          <label> Email </label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"/>
          <br></br>
          <label> Velg passord </label>
          <input type = "password" name="password" value={formData.password} onChange={handleChange} placeholder="Passord"/>
          <br></br>
          <label> Gjenta passord </label>
          <input type = "password" placeholder="Passord"/>
          

          <p> {formData.fornavn}, passordet ditt er: {formData.password}</p>

          <button type="submit" className="registrerButton">
            Registrer
          </button>

          <button type="button" onClick={() => router.push("/signIn")}>
              Har allerede bruker
          </button>
        </form>
      </div> 
  );
};

export default SignInForm;
