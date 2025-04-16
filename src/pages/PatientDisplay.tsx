import { useEffect, useState } from "react";
import PatientList from "../components/PatientList";
import PatientForm from "../components/PatientForm";
import FormModal from "../components/Modals/FormModal";
import Modal from "../components/Modals/Modal";
import { Patient } from "../types/Patient";
import { PatientService } from "../db/PatientService";

export default function PatientApp() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [successAction, setSuccessAction] = useState<"add" | "update" | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => PatientService.getAll().then(setPatients);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (p: Patient) => {
    setEditing(p);
    setModalOpen(true);
  };

  const handleSave = async (p: Patient) => {
    if (editing) {
      await PatientService.update(p);
      setSuccessAction("update");
    } else {
      await PatientService.add(p);
      setSuccessAction("add");
    }
    setModalOpen(false);
    setEditing(null);
    refresh();
    setShowSuccess(true);
  };

  const handleDelete = async (id: string) => {
    await PatientService.remove(id);
    refresh();
  };

  return (
    <>
      <div style={{ marginBottom: "1rem", textAlign: "right" }}>
        <button
          onClick={openAdd}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          ➕ Add New Patient Entry
        </button>
      </div>

      <PatientList patients={patients} onDelete={handleDelete} onEdit={openEdit} />

      {/* Form modal for both Add & Edit */}
      <FormModal
        isOpen={modalOpen}
        title={editing ? "Edit Patient" : "Add New Patient"}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <PatientForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </FormModal>

      {/* Success notification modal */}
      <Modal
        isOpen={showSuccess}
        title={successAction === "update" ? "Patient Updated" : "Patient Added"}
        message={
          successAction === "update"
            ? "Patient record successfully updated."
            : "Patient record successfully created."
        }
        actions={[
          {
            label: "OK",
            onClick: () => setShowSuccess(false),
            styleType: "primary",
          },
        ]}
      />
    </>
  );
}
