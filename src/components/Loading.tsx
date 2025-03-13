import { LoaderCircle } from "lucide-react";
import React from "react";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.component}>
      <LoaderCircle size={"5rem"} />
    </div>
  );
};

export default Loading;
