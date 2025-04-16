import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
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
      setError("Incorrect password.");
    }
  };

  if (loggedIn) {
    navigate("/welcome"); 
    return null;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🔒 Patient Record Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
