// src/components/Layout.tsx
import React, { useState, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { db } from "../db/db";
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Menu,
    MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import LogoutIcon from "@mui/icons-material/Logout";
import Clock from "../components/Clock/Clock";
import BMCicon from "../assets/BMC_icon.png";

const drawerWidth = 240;

export default function Layout() {
    const [open, setOpen] = useState(true);
    const [dataMenuAnchor, setDataMenuAnchor] = useState<HTMLElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("patient_app_logged_in");
        navigate("/");
    };

    const navItems = [
        { to: "/welcome", label: "Home", icon: <HomeIcon /> },
        { to: "/list", label: "Patients", icon: <ListIcon /> },
        { to: "/prescriptions", label: "Prescriptions", icon: <LocalPharmacyIcon /> },
        { to: "/medcert", label: "Medical Certificate", icon: <DescriptionIcon /> },
    ];

    // Data menu handlers
    const openDataMenu = (e: React.MouseEvent<HTMLElement>) => setDataMenuAnchor(e.currentTarget);
    const closeDataMenu = () => setDataMenuAnchor(null);

    const handleExport = async () => {
        const patients = await db.patients.toArray();
        const prescriptions = await db.prescriptions.toArray();
        const data = { patients, prescriptions };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `db-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        closeDataMenu();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const text = evt.target?.result as string;
                const { patients = [], prescriptions = [] } = JSON.parse(text);
                await db.transaction("rw", db.patients, db.prescriptions, async () => {
                    await db.patients.clear();
                    await db.prescriptions.clear();
                    await db.patients.bulkAdd(patients);
                    await db.prescriptions.bulkAdd(prescriptions);
                });
                window.location.reload();
            } catch {
                alert("Import failed: invalid file");
            }
        };
        reader.readAsText(file);
        closeDataMenu();
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* AppBar */}
            <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton color="inherit" edge="start" onClick={() => setOpen((o) => !o)}>
                            <MenuIcon />
                        </IconButton>
                        <Box component="img" src={BMCicon} alt="BMC" sx={{ width: 32, height: 32 }} />
                        <Typography variant="h6" noWrap>
                            Dr. Merceditas Borlongan
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Clock />
                        <IconButton color="inherit" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Persistent Drawer */}
            <Drawer
                variant="persistent"
                open={open}
                sx={{
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: open ? drawerWidth : 0,
                        boxSizing: "border-box",
                        transition: (t) =>
                            t.transitions.create("width", {
                                easing: t.transitions.easing.sharp,
                                duration: t.transitions.duration.enteringScreen,
                            }),
                    },
                }}
            >
                <Toolbar />
                <Divider />
                <List>
                    {navItems.map(({ to, label, icon }) => (
                        <ListItemButton
                            key={to}
                            selected={pathname === to}
                            onClick={() => navigate(to)}
                        >
                            <ListItemIcon>{icon}</ListItemIcon>
                            {open && <ListItemText primary={label} />}
                        </ListItemButton>
                    ))}
                </List>
                <Box sx={{ flexGrow: 1 }} />
                <Divider />
                <List>
                    <ListItemButton onClick={openDataMenu}>
                        <ListItemIcon><ImportExportIcon /></ListItemIcon>
                        {open && <ListItemText primary="Data" />}
                    </ListItemButton>
                    <Menu
                        anchorEl={dataMenuAnchor}
                        open={Boolean(dataMenuAnchor)}
                        onClose={closeDataMenu}
                    >
                        <MenuItem onClick={handleExport}>Export Database</MenuItem>
                        <MenuItem onClick={() => fileInputRef.current?.click()}>
                            Import Database
                        </MenuItem>
                    </Menu>
                    {/* hidden file input */}
                    <input
                        type="file"
                        accept="application/json"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                    />
                </List>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: "auto", backgroundColor: "#d3d3d3" }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
