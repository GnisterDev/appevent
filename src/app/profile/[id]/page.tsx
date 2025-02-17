"use client"; // Sørger for at koden kjøres i klienten

import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import { deleteUser, getUser } from "@/firebase/DatabaseService";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import { Trash } from "lucide-react";
import { isAdministrator } from "@/firebase/AuthService";

interface ProfileData {
  name: string;
  email: string;
  area: string;
  interests: string[];
}

const ProfilePage = () => {
  const router = useRouter();

  const { id } = useParams();
  const userID = Array.isArray(id) ? id[0] : id;
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!userID) return;

    getUser(userID).then(data => {
      if (data) setProfileData({ ...data, interests: [], area: "" });
      else router.push("/404");
    });
  }, [userID]);

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
      name: prev?.name || "",
      email: prev?.email || "",
    }));
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfileData(prev => ({
      ...prev,
      area: e.target.value,
      interests: [],
      name: prev?.name || "",
      email: prev?.email || "",
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProfileData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter(item => item !== value),
      };
    });
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
    <div className={styles.profileContainer}>
      <h1>Min Profil</h1>
      <div>
        <label>Navn:</label>
        <span>{profileData?.name || " ..."}</span>
      </div>
      <div>
        <label>E-post:</label>
        <span>{profileData?.email || " ..."}</span>
      </div>
      <div>
        <label>Område (fylke):</label>
        {editing ? (
          <select
            name="area"
            value={profileData?.area}
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
          <span>{profileData?.area || "Ikke angitt"}</span>
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
                  checked={profileData?.interests.includes(option)}
                  onChange={handleCheckboxChange}
                />
                {option}
              </label>
            </div>
          ))
        ) : (
          <span>
            {profileData &&
            profileData.interests &&
            profileData.interests.length > 0
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
        <div className={styles.deleteInfoButtonContainer}>
          <button
            onClick={handleDeleteInfo}
            className={styles.deleteInfoButton}
          >
            Slett informasjon
          </button>
        </div>
      </div>
      {isAdministrator() && (
        <Button
          text="Slett Bruker"
          icon={<Trash />}
          onClick={() => deleteUser(userID || "")}
          className={styles.deleteButton}
        />
      )}
    </div>
  );
};

export default ProfilePage;
