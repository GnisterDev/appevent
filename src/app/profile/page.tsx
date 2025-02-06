"use client"; // Sørg for at det kjøres i klienten

import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";

interface ProfileData {
    name: string;
    email: string;
    area: string;
    interests: string[];
}

const ProfilePage = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        name: '',
        email: '',
        area: '',
        interests: []
    });

    useEffect(() => {
        // Hente inn fra User login når dette er ferdig
    }, []);

    const areaOptions = [
        "Oslo", "Viken", "Innlandet", "Vestfold og Telemark", "Agder",
        "Rogaland", "Vestland", "Møre og Romsdal", "Trøndelag",
        "Nordland", "Troms og Finnmark"
    ];

    const interestOptions = ["Ballsport", "Motorsport", "Helse", "Matlaging", "Musikk", "Kunst"];

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProfileData(prev => ({
            ...prev,
            area: e.target.value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            interests: checked ? [...prev.interests, value] : prev.interests.filter(item => item !== value)
        }));
    };

    return (
        <div className={styles.profileContainer}>
            <h1>Min Profil</h1>
            <div>
                <label>Navn:</label>
                <p>{profileData.name || 'Ikke angitt'}</p>
            </div>
            <div>
                <label>E-post:</label>
                <p>{profileData.email || 'Ikke angitt'}</p>
            </div>
            <div>
                <label>Område (fylke):</label>
                <select name="area" value={profileData.area} onChange={handleInputChange} required>
                    <option value="">Velg fylke</option>
                    {areaOptions.map(area => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Interesser:</label>
                {interestOptions.map(option => (
                    <div key={option}>
                        <label>
                            <input type="checkbox" value={option} checked={profileData.interests.includes(option)} onChange={handleCheckboxChange} />
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;
