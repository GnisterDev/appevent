import { Globe } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "./LanguageSwitch.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LanguageSwitch = () => {
  const t = useTranslations("Global");
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState("no"); // Default to Norwegian

  useEffect(() => {
    const savedLocale = Cookies.get("locale") || "no";
    setCurrentLocale(savedLocale);
  }, []);

  const handleLanguageSwitch = () => {
    const newLocale = currentLocale === "no" ? "en" : "no";
    setCurrentLocale(newLocale);
    Cookies.set("locale", newLocale);
    router.refresh();
  };

  return (
    <div className={styles.module} onClick={handleLanguageSwitch}>
      <Globe size={"1.25rem"} />
      {t("otherLanguage")}
    </div>
  );
};

export default LanguageSwitch;
