"use client"; // Sørger for at koden kjøres i klienten

import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import { useAuth } from "@/firebase/AuthService";
import { useRouter } from "next/navigation";

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
    interests: [],
  });

  const [editing, setEditing] = useState(false);
  const [backupData, setBackupData] = useState<ProfileData | null>(null);

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
    "Troms og Finnmark",
  ];

  const interestOptions = [
    "Ballsport",
    "Motorsport",
    "Helse",
    "Matlaging",
    "Musikk",
    "Kunst",
  ];

  const handleDeleteInfo = () => {
    setProfileData(prev => ({
      ...prev,
      area: "",
      interests: [],
    }));
  };

  const { userID } = useAuth();
  const router = useRouter();
  useEffect(() => {
    // if (!userID) return;
    // const fetchUserData = async () => {
    //   const { name, email } = await getUser(userID);
    //   setProfileData(prev => ({
    //     ...prev,
    //     name: name,
    //     email: email,
    //   }));
    // };
    // fetchUserData();
    const fetchUser = async () => {
      const { userID } = await useAuth();
      router.push(`/profile/${userID}`);
    };
    fetchUser();
  }, [userID]);

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfileData(prev => ({
      ...prev,
      area: e.target.value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter(item => item !== value),
    }));
  };

  const handleSaveChanges = () => {
    console.log("Lagret profil:", profileData);
    setEditing(false);
  };

  const handleCancelEditing = () => {
    if (backupData) {
      setProfileData(backupData);
    }
    setEditing(false);
  };

  return (
    <main className={styles.profileContainer}>
      <h1>Min Profil</h1>
      <div>
        <label>Navn: </label>
        <span>{profileData.name || " ..."}</span>
      </div>
      <div>
        <label>E-post: </label>
        <span>{profileData.email || " ..."}</span>
      </div>
      <div>
        <label>Område (fylke):</label>
        {editing ? (
          <select
            name="area"
            value={profileData.area}
            onChange={handleAreaChange}
            required
          >
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
            {profileData.interests.length > 0
              ? profileData.interests.join(", ")
              : "Ikke angitt"}
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
          <button
            onClick={() => {
              setBackupData(profileData);
              setEditing(true);
            }}
          >
            Rediger profil
          </button>
        )}
        <div className={styles.deleteButtonContainer}>
          <button onClick={handleDeleteInfo} className={styles.deleteButton}>
            Slett informasjon
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
