import React, { useContext } from "react";
import styles from "./ProfileComponents.module.css";
import { Heart } from "lucide-react";
import { UserDisplayContext } from "@/firebase/contexts";
import Tag from "../event/Tag";

const Interests = () => {
  const userData = useContext(UserDisplayContext);

  return (
    <div className={styles.module}>
      <div className={styles.title}>
        <Heart size={"1.5rem"} />
        <h2>Interesser</h2>
      </div>
      <div className={styles.tags}>
        {userData.interests.map((tag, index) => (
          <Tag key={index} text={tag} />
        ))}
      </div>
    </div>
  );
};

export default Interests;
