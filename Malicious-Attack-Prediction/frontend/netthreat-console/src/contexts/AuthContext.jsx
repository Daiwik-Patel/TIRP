import { createContext, useContext, useState } from "react";

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

/**
 * Stores the DRF token in localStorage and remembers whether
 * the user is “user” or “admin” so <RequireRole> can gate pages.
 */
export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.token || "");
  const [role, setRole]   = useState(() => localStorage.role  || null);

  const login = (tok, who) => {
    localStorage.token = tok;
    localStorage.role  = who;      // "user" | "admin"
    setToken(tok);
    setRole(who);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole(null);
  };

  return (
    <AuthCtx.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
