// src/pages/GeneratePrescriptionPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Patient } from "../../types/Patient";
import { Prescription } from "../../types/Prescription";
import { Medication } from "../../types/Medication";
import { PatientService } from "../../db/PatientService";
import { PrescriptionService } from "../../db/PrescriptionService";
import { MedicationService } from "../../db/MedicationService";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
const FIELD_STYLE: React.CSSProperties = {
    display: "inline-block",
    minWidth: 120,
    borderBottom: "1px solid #000",
    padding: "2px 4px",
};

import homelogo from '../../assets/home.jpg'
import bgLogo from '../../assets/BMC_icon.png'

const GeneratePrescriptionPage: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [patient, setPatient] = useState<Patient>();
    const [prescription, setPrescription] = useState<Prescription>();
    const [meds, setMeds] = useState<Medication[]>([]);

    useEffect(() => {
        if (!patientId) {
            navigate("/list");
            return;
        }

        async function loadData(): Promise<void> {
            const allPatients = await PatientService.getAll();
            const p = allPatients.find((x) => x.id === patientId);
            if (!p) {
                navigate("/list");
                return;
            }
            setPatient(p);

            const allPres = await PrescriptionService.getAll();
            const theirs = allPres
                .filter((pr) => pr.patientId === patientId)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const pres = theirs[0];
            if (!pres) {
                navigate("/list");
                return;
            }
            setPrescription(pres);

            const allMeds = await MedicationService.getAll();
            setMeds(
                allMeds.filter((m) =>
                    pres.items.some((it) => it.medicationId === m.id)
                )
            );
            setLoading(false);
        }

        loadData();
    }, [patientId, navigate]);


    if (loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!patient || !prescription) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography>No prescription found.</Typography>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </Box>
        );
    }

    return (
        <>
            <Box
                id="print-area"
                sx={{
                    height: "90%",
                    maxWidth: 800,
                    mx: "auto",
                    my: 2,
                    position: "relative",
                    bgcolor: "#fff",
                    boxShadow: 2,
                }}
            >
                {/* Header image */}

                <Box
                    component="img"
                    src={homelogo}
                    alt="Prescription Header"
                    sx={{ width: "100%", display: "block" }}
                />

                {/* Background image */}

                <Box
                    component="img"
                    src={bgLogo}
                    alt="Watermark Logo"
                    sx={{
                        position: "absolute",
                        top: "65%",       // tweak to vertically center under text
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60%",
                        opacity: 0.1,
                        zIndex: 0,
                        pointerEvents: "none", // click-through
                    }}
                />


                {/* Separator line */}
                <Box
                    sx={{
                        borderTop: "2px solid #000",
                        mx: 2,
                        mt: 1,
                    }}
                />

                {/* Fillable fields */}
                <Box sx={{ p: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        Patient's Name:{" "}
                        <span style={FIELD_STYLE}>{patient.name}</span>
                    </Typography>

                    <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                        <Typography variant="body2">
                            Sex: <span style={FIELD_STYLE}>{patient.gender}</span>
                        </Typography>
                        <Typography variant="body2">
                            Age: <span style={FIELD_STYLE}>{patient.age}</span>
                        </Typography>
                        <Typography variant="body2">
                            Date:{" "}
                            <span style={FIELD_STYLE}>
                                {new Date(prescription.date).toLocaleDateString()}
                            </span>
                        </Typography>
                    </Box>

                    <Typography variant="body1" gutterBottom>
                        Address:{" "}
                        <span
                            style={{
                                ...FIELD_STYLE,
                                minWidth: 300,
                            }}
                        >
                            {patient.address}
                        </span>
                    </Typography>

                    {/* RX icon */}
                    <Typography variant="h3" sx={{ mt: 3, mb: 2 }}>
                        Rx
                    </Typography>

                    {/* Medications list */}
                    <Box sx={{ ml: 2 }}>
                        {prescription.items.map((it, i) => {
                            const med = meds.find((m) => m.id === it.medicationId)!;
                            return (
                                <Typography key={it.medicationId} variant="body2" sx={{ mb: 1 }}>
                                    {i + 1}. {med.name}
                                    {med.brandName ? ` (${med.brandName})` : ""} — Qty: {it.quantity}
                                </Typography>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
            {/* Footer with actions */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    p: 2,
                    borderTop: "1px solid #ccc",
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => window.print()}
                >
                    Print
                </Button>
                <Button variant="contained" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </Box>
        </>
    );
};

export default GeneratePrescriptionPage;
