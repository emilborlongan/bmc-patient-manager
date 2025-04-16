import { useMemo, useState } from "react";
import { Patient } from "../types/Patient";
import ConfirmModal from "./Modals/ConfirmModal/ConfirmModal";
import styles from "./PatientList.module.css";
import { sortBy } from "../utils/helpers";

interface Props {
  patients: Patient[];
  onDelete: (id: string) => void;
  onEdit: (patient: Patient) => void;
}

export default function PatientList({ patients, onDelete, onEdit }: Props) {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof Patient>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // **Confirm modal state**
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(
    () => patients.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase())),
    [patients, filter]
  );

  const sorted = useMemo(() => sortBy(filtered, sortKey, sortAsc), [filtered, sortKey, sortAsc]);

  const handleSort = (key: keyof Patient) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className={styles.plContainer}>
      <input
        className={styles.plFilterInput}
        placeholder="Search by name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <table className={styles.plTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("address")}>Address</th>
            <th onClick={() => handleSort("age")}>Age</th>
            <th onClick={() => handleSort("diagnosis")}>Diagnosis</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((p) => (
            <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => onEdit(p)}>
              <td>{p.name}</td>
              <td>{p.address}</td>
              <td>{p.age}</td>
              <td>{p.diagnosis}</td>
              <td>
                <button
                  className={styles.plAction}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmId(p.id);
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirm‑delete popup */}
      <ConfirmModal
        isOpen={confirmId !== null}
        onConfirm={() => {
          onDelete(confirmId!);
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
