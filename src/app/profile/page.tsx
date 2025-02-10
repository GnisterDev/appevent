"use client"; // Sørger for at koden kjøres i klienten

import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import { getUser } from "../../firebase/DatabaseService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";

interface ProfileData {
  name: string;
  email: string;
  area: string;
  interests: string[];
}

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    area: "",
    interests: []
  });

  const [editing, setEditing] = useState(false);

  const areaOptions = [
    "Oslo",
    "Viken",
    "Innlandet",
    "Vestfold og Telemark",
    "Agder",
    "Rogaland",
    "Vestland",
    "Møre og Romsdal",
    "Trøndelag",
    "Nordland",
    "Troms og Finnmark"
  ];

  const interestOptions = [
    "Ballsport",
    "Motorsport",
    "Helse",
    "Matlaging",
    "Musikk",
    "Kunst"
  ];

  // Vent til Firebase har satt opp auth-tilstanden
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("Ingen bruker er logget inn.");
        return;
      }
      try {
        const [fetchedName, fetchedEmail, fetchedType] = await getUser(user.uid);
        console.log("Hentet data:", fetchedName, fetchedEmail, fetchedType);
        if (!fetchedName) {
          console.log("Brukerdokumentet finnes ikke for bruker-ID:", user.uid);
        }
        setProfileData(prev => ({
          ...prev,
          name: fetchedName || "",
          email: fetchedEmail || ""
        }));
      } catch (error) {
        console.error("Feil ved henting av brukerdata:", error);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfileData(prev => ({
      ...prev,
      area: e.target.value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter(item => item !== value)
    }));
  };

  const handleSaveChanges = () => {
    // Her kan du sende oppdaterte data til backend
    console.log("Lagret profil:", profileData);
    setEditing(false);
  };

  const handleCancelEditing = () => {
    setEditing(false);
  };

  return (
    <div className={styles.profileContainer}>
      <h1>Min Profil</h1>
      <div>
        <label>Navn:</label>
        <span>{profileData.name || "Ikke angitt"}</span>
      </div>
      <div>
        <label>E-post:</label>
        <span>{profileData.email || "Ikke angitt"}</span>
      </div>
      <div>
        <label>Område (fylke):</label>
        {editing ? (
          <select name="area" value={profileData.area} onChange={handleAreaChange} required>
            <option value="">Velg fylke</option>
            {areaOptions.map(area => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        ) : (
          <span>{profileData.area || "Ikke angitt"}</span>
        )}
      </div>
      <div>
        <label>Interesser:</label>
        {editing ? (
          interestOptions.map(option => (
            <div key={option}>
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={profileData.interests.includes(option)}
                  onChange={handleCheckboxChange}
                />
                {option}
              </label>
            </div>
          ))
        ) : (
          <span>
            {profileData.interests.length > 0 ? profileData.interests.join(", ") : "Ikke angitt"}
          </span>
        )}
      </div>
      <div className={styles.buttonContainer}>
        {editing ? (
          <>
            <button onClick={handleSaveChanges}>Lagre endringer</button>
            <button onClick={handleCancelEditing}>Avbryt</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)}>Rediger profil</button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
