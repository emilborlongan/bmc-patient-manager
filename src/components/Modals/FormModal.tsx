import React from "react";
import styles from "./Modal.module.css";

interface Props {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function FormModal({ isOpen, title, onClose, children }: Props) {
  if (!isOpen) return null;
  return (
    <div className={`${styles.overlay}`}>
      <div className={`${styles.modal}  ${styles.inputModal}`}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "black" }}>
          <h2>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>
            ✖️
          </button>
        </header>
        <div style={{ marginTop: "1rem" }}>{children}</div>
      </div>
    </div>
  );
}
