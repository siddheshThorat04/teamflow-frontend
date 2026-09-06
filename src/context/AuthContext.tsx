import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface JwtPayload {
  sub: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUserEmail(decoded.sub);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  function login(token: string) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<JwtPayload>(token);
    setUserEmail(decoded.sub);
  }

  function logout() {
    localStorage.removeItem("token");
    setUserEmail(null);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!userEmail, userEmail, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}