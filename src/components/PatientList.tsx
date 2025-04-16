import { Patient } from "../types/Patient";
import styles from "./PatientList.module.css";

interface Props {
  patients: Patient[];
  onDelete: (id: string) => void;
}

export default function PatientList({ patients, onDelete }: Props) {
  return (
    <div className={styles.plContainer}>
      <table className={styles.plTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Age</th>
            <th>Diagnosis</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.address}</td>
              <td>{p.age}</td>
              <td>{p.diagnosis}</td>
              <td>
                <button className={styles.plAction} onClick={() => onDelete(p.id)}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
