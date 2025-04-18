import { useState } from "react";
import PatientList from "../components/PatientList/PatientList";
import PatientForm from "../components/PatientForm/PatientForm";
import FormModal from "../components/Modals/FormModal";
import Modal from "../components/Modals/Modal";
import { Patient } from "../types/Patient";
import { PatientService } from "../db/PatientService";


export default function PatientApp() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAction, setSuccessAction] = useState<"add" | "update" | null>(null);



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
    setShowSuccess(true);
  };

  return (
    <>

      <PatientList />

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
