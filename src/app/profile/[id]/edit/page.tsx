"use client";
import React, { useEffect, useState } from "react";
import { UserContext } from "@/firebase/contexts";
import { useParams, useRouter } from "next/navigation";
import { changeUser, getUser } from "@/firebase/DatabaseService";
import { UserData } from "@/firebase/User";
import Loading from "@/components/Loading";
import PersonalInformation from "@/components/profile/edit/PersonalInformation";
import styles from "./editProfile.module.css";

const UserEdit: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const userID = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserData>();

  useEffect(() => {
    if (!userID) {
      setError("UserID not found");
      setLoading(false);
      return;
    }

    getUser(userID)
      .then(data => {
        setFormData(data);
      })
      .catch(err => {
        console.error("Error fetching user:", err);
        setError("Failed to load user details");
      })
      .finally(() => {
        console.log("User loaded");
        setLoading(false);
      });
  }, [userID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userID) return;

    changeUser(userID, {
      ...formData,
    }).then(() => router.push(`/profile/${userID}`));
  };

  const updateFormData = (field: string, value: unknown) => {
    setFormData(
      prevData =>
        ({
          ...prevData,
          [field]: value,
        } as UserData)
    );
  };

  if (loading) return <Loading />;
  if (error) router.push("/404");
  if (!formData) return;

  return (
    <UserContext.Provider value={{ formData, updateFormData }}>
      <main className={styles.main}>
        <form onSubmit={handleSubmit}>
          <h1 className={styles.title}>Rediger profil</h1>
          <PersonalInformation />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Lagre endringer
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.back()}
            >
              Avbryt
            </button>
          </div>
        </form>
      </main>
    </UserContext.Provider>
  );
};

export default UserEdit;
