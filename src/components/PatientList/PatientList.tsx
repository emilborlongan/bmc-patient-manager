import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import { useNavigate } from "react-router-dom";
import { Patient } from "../../types/Patient";
import { PatientService } from "../../db/PatientService";

import styles from "./PatientList.module.css"

export default function PatientListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    PatientService.getAll().then(setPatients);
  }, []);

  const refresh = () => PatientService.getAll().then(setPatients);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1.5 },
    { field: "age", headerName: "Age", type: "number", width: 100 },
    {
      field: "checkupDate",
      headerName: "Last Checkup",
      type: "date",
      width: 150,
      valueGetter: (params) =>
        params ? new Date(params) : null,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            onClick={() => navigate(`/edit/${params.id}`)}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => setDeleteId(params.id as string)}
          >
            Delete
          </Button>

          <Button
            size="small"
            startIcon={<LocalPharmacyIcon />}
            onClick={() => navigate(`/prescriptions/generate/${params.id}`)}
          >
            Rx
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container className={styles.gridContainer} sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Patient Records
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => navigate("/add")}
      >
        Add Patient
      </Button>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={patients}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this patient?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={async () => {
              await PatientService.remove(deleteId!);
              setDeleteId(null);
              refresh();
              setShowDeleteSuccess(true);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
      >
        <DialogTitle>Patient Deleted</DialogTitle>
        <DialogContent>
          Patient record successfully deleted.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteSuccess(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}