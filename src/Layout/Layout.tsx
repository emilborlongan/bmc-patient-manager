import { ReactNode, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import LogoutIcon from "@mui/icons-material/Logout";
import Clock from "../components/Clock/Clock";
import BMCicon from "../assets/BMC_icon.png";

const drawerWidth = 240;

export default function Layout() {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("patient_app_logged_in");
        navigate("/");
    };

    const navItems: { to: string; label: string; icon: ReactNode }[] = [
        { to: "/welcome", label: "Home", icon: <HomeIcon /> },
        { to: "/list", label: "Patients", icon: <ListIcon /> },
        { to: "/prescriptions", label: "Prescriptions", icon: <LocalPharmacyIcon /> },
        { to: "/medcert", label: "Medical Certificate", icon: <DescriptionIcon /> },
    ];

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => setOpen((o) => !o)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box component="img" src={BMCicon} alt="BMC" sx={{ width: 32, height: 32 }} />
                        <Typography variant="h6" noWrap>
                            Dr. Merceditas Borlongan
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
            <Drawer
                variant="persistent"
                open={open}
                sx={{
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: open ? drawerWidth : 0,
                        boxSizing: "border-box",
                        transition: (theme) =>
                            theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
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
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    overflowY: "auto",
                    backgroundColor: "#d3d3d3",
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
