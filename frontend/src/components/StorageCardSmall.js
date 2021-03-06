import { useState } from "react";
import styles from "./StorageCardSmall.module.css";

export default function StorageCardSmall({ storageName, imgSrc, classes }) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  return (
    <div
      className={`relative flex justify-center items-center ${classes}`}
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}
    >
      <img
        src={imgSrc}
        alt={imgSrc}
        className={`${isMouseOver ? null : `opacity-60`}`}
        style={{
          width: "200px",
          height: "150px",
          cursor: "pointer",
        }}
      />
      <div
        className={`absolute top-auto left-auto w-auto px-2 ${
          isMouseOver ? `${styles.textActive} text-lg` : `${styles.textInactive} text-lg`
        }`}
        style={{
          cursor: "pointer",
        }}
      >
        {storageName}
      </div>
    </div>
  );
}
