import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

import BMCicon from '../assets/BMC_icon.png'

export default function Login() {
  const { loggedIn, login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      navigate("/welcome");
    } else {
      setError("Incorrect Passcode.");
    }
  };

  if (loggedIn) {
    navigate("/welcome");
    return null;
  }

  return (
    <div style={{
      padding: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: '70%'
    }}>
      <form onSubmit={handleSubmit}>
        <h1><img src={BMCicon} width={200} height={200} alt="bmc" /></h1>


        <div style={{ display: "flex", justifyContent: "center", height: '30px' }}>
          <input
            style={{ backgroundColor: 'aliceblue', color: 'black' }}
            type="password"
            placeholder="Enter Passcode"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
        </div>

        {error && <div style={{ display: "flex", justifyContent: "center", height: '30px' }}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
        }
        <div style={{ display: "flex", justifyContent: "center", marginTop: '20px' }}>
          <button type="submit" style={{ backgroundColor: "#1976d2" }}>Proceed</button>
        </div>
      </form>

    </div>
  );
}
