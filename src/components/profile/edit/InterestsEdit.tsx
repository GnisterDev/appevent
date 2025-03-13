import React, { useContext, useState } from "react";
import styles from "./EditProfileComponents.module.css";
import { Heart } from "lucide-react";
import { UserContext } from "@/firebase/contexts";
import Tag from "@/components/event/Tag";
import { UserContextType } from "@/firebase/User";

const InterestsEdit = () => {
  const { formData, updateFormData } = useContext<UserContextType>(UserContext);
  const [interestInput, setInterestInput] = useState<string>("");

  const addInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const trimmedInterest = interestInput.trim();
    if (!trimmedInterest) return;
    if (formData.interests.includes(trimmedInterest)) return;
    updateFormData("interests", [...formData.interests, trimmedInterest]);
    setInterestInput("");
  };

  return (
    <div className={styles.module}>
      <div className={styles.title}>
        <Heart size={"1.5rem"} />
        <h2>Interesser</h2>
      </div>
      <div className={styles.singleInputGroup}>
        <h3 className={styles.title}>Legg til interesse</h3>
        <input
          type="text"
          name="interests"
          placeholder="Skriv interesse og trykk Enter"
          className={styles.input}
          value={interestInput}
          onChange={e => setInterestInput(e.target.value)}
          onKeyDown={e => addInterest(e)}
        />
      </div>
      <div className={styles.tags}>
        {formData.interests.map((interest, index) => (
          <Tag
            key={index}
            text={interest}
            onDelete={() =>
              updateFormData(
                "interests",
                formData.interests.filter(listTags => listTags !== interest)
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default InterestsEdit;
