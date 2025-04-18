import { useEffect, useState } from "react";
import PatientList from "../components/PatientList/PatientList";
import PatientForm from "../components/PatientForm/PatientForm";
import FormModal from "../components/Modals/FormModal";
import Modal from "../components/Modals/Modal";
import { Patient } from "../types/Patient";
import { PatientService } from "../db/PatientService";
import { useNavigate } from "react-router-dom";


export default function PatientApp() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAction, setSuccessAction] = useState<"add" | "update" | null>(null);
  const navigate = useNavigate();
  


  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => PatientService.getAll().then(setPatients);

  const openAdd = () => {
    setEditing(null);
    navigate("/add");
    return null;
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
