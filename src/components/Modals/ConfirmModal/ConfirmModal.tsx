import Modal, { ModalAction } from "../Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, onConfirm, onCancel }: ConfirmModalProps) {
  const actions: ModalAction[] = [    
    { label: "Confirm", onClick: onConfirm, styleType: "primary" },
    { label: "Cancel", onClick: onCancel, styleType: "secondary" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      title="Confirm Deletion"
      message="Are you sure you want to delete this patient?"
      actions={actions}
    />
  );
}