import { useState, useEffect } from "react";

const STORAGE_KEY = "patient_app_logged_in";
const PASSWORD = "admin123";

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const login = (password: string): boolean => {
    if (password === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLoggedIn(false);
  };

  return { loggedIn, login, logout };
}