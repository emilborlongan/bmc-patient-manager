import { useState } from "react";
import BMCicon from '../assets/BMC_icon.png'
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Layout() {
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("patient_app_logged_in");
        navigate("/");
    };


    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Top bar */}
            <header
                style={{
                    height: "60px",
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 1rem",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                }}
            >
                <div
                    style={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "blue"
                    }}
                >
                    <span role="img" aria-label="logo"><img src={BMCicon} width={40} height={40} alt="bmc" /></span>
                    Merceditas Borlongan Clinic
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {/* Collapse Button */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "1.2rem",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                        }}
                        title="Toggle sidebar"
                    >
                        {collapsed ? "➡️" : "⬅️"}
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        style={{
                            backgroundColor: "#ef5350",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.4rem 0.8rem",
                            fontWeight: 500,
                            cursor: "pointer",
                        }}
                    >
                        🔒 Logout
                    </button>
                </div>
            </header>


            {/* Main layout */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Sidebar */}
                <aside
                    style={{
                        width: collapsed ? "60px" : "200px",
                        backgroundColor: "#fafafa",
                        borderRight: "1px solid #ddd",
                        transition: "width 0.2s ease",
                        padding: "1rem 0.5rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: collapsed ? "center" : "flex-start",
                        gap: "1rem",
                    }}
                >
                    <NavItem to="/welcome" icon="🏠" label="Home" collapsed={collapsed} active={pathname === "/welcome"} />
                    <NavItem to="/list" icon="📋" label="Patients" collapsed={collapsed} active={pathname === "/list"} />
                </aside>



                <main style={{ flex: 1, overflowY: "auto", padding: "2rem", backgroundColor: '#d3d3d3' }}>
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

interface NavItemProps {
    to: string;
    icon: string;
    label: string;
    collapsed: boolean;
    active?: boolean;
}

function NavItem({ to, icon, label, collapsed, active }: NavItemProps) {
    return (
        <Link
            to={to}
            style={{
                display: "flex",
                alignItems: "center",
                gap: collapsed ? 0 : "0.5rem",
                justifyContent: collapsed ? "center" : "flex-start",
                padding: "20px 10px",
                borderRadius: "8px",
                textDecoration: "none",
                backgroundColor: active ? "#e3f2fd" : "transparent",
                color: "black",
                fontWeight: 500,
                width: "80%",
                transition: "all 0.2s",
            }}
        >
            <span>{icon}</span>
            {!collapsed && <span>{label}</span>}
        </Link>
    );
}
