// src/pages/MedicationListPage.tsx
import { useEffect, useState } from "react";
import {
  DataGrid, GridColDef, GridPaginationModel
} from "@mui/x-data-grid";
import {
  Container, Typography, Button,
  Dialog, DialogTitle, DialogContent,
  DialogActions, Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Medication } from "../../types/Medication";
import { MedicationService } from "../../db/MedicationService";
import MedicationForm from "./MedicationForm";

export default function MedicationListPage() {
  const [items, setItems] = useState<Medication[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<"add"|"update"|"delete"|null>(null);

  useEffect(() => void refresh(), []);

  const refresh = () => MedicationService.getAll().then(setItems);

  const handleSave = async (p: Medication) => {
    if (editing) {
      await MedicationService.update(p);
      setShowSuccess("update");
    } else {
      await MedicationService.add(p);
      setShowSuccess("add");
    }
    setDialogOpen(false);
    setEditing(null);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await MedicationService.remove(id);
    setConfirmId(null);
    setShowSuccess("delete");
    refresh();
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "brandName", headerName: "Brand Name", flex: 1 },
    {
      field: "actions", headerName: "Actions", width: 180, sortable: false,
      renderCell: (params) => (
        <Box>
          <Button size="small" onClick={() => { setEditing(params.row as Medication); setDialogOpen(true); }}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => setConfirmId(params.id as string)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Medications</Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => { setEditing(null); setDialogOpen(true); }}
      >
        Add Medication
      </Button>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={items}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5,10,20]}
        />
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Medication" : "Add Medication"}</DialogTitle>
        <DialogContent>
          <MedicationForm
            initial={editing ?? undefined}
            onSave={handleSave}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this Medication?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button color="error" onClick={() => handleDelete(confirmId!)}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar‐style Dialog */}
      <Dialog open={!!showSuccess} onClose={() => setShowSuccess(null)}>
        <DialogTitle>
          {showSuccess === "add" && "Added"}
          {showSuccess === "update" && "Updated"}
          {showSuccess === "delete" && "Deleted"}
        </DialogTitle>
        <DialogContent>
          Medication {showSuccess} successfully.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccess(null)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
