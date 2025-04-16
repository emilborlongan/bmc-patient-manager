import styles from "./Modal.module.css";

export interface ModalAction {
  label: string;
  onClick: () => void;
  /** "primary" | "secondary" to pick styling */
  styleType?: "primary" | "secondary";
}

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  actions: ModalAction[];
}

export default function Modal({ isOpen, title, message, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonRow}>
          {actions.map((act, i) => (
            <button
              key={i}
              onClick={act.onClick}
              className={
                act.styleType === "primary" 
                  ? styles.primaryBtn 
                  : styles.secondaryBtn
              }
            >
              {act.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
