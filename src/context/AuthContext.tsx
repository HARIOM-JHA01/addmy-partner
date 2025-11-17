import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";
import type { Partner } from "../types";

interface AuthContextType {
  partner: Partner | null;
  loading: boolean;
  login: (
    tgid: string,
    name: string,
    username: string,
    email?: string
  ) => Promise<void>;
  logout: () => void;
  updatePartner: (partner: Partner) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await api.get("/partner/profile");
          if (response.data.success) {
            setPartner(response.data.data);
          }
        } catch (error) {
          localStorage.removeItem("authToken");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (
    tgid: string,
    name: string,
    username: string,
    email?: string
  ) => {
    // Fetch geo / IP data to include required fields
    let ipData: any = null;
    try {
      const resp = await fetch("https://ipapi.co/json/");
      if (resp.ok) {
        ipData = await resp.json();
      }
    } catch (err) {
      // ignore ipapi failures, we'll still attempt login
      console.warn("ipapi fetch failed", err);
    }

    const payload = {
      tgid,
      name,
      username,
      email,
      // API expects these fields
      telegram_username: username,
      country: ipData?.country_name || ipData?.country || "",
      countryCode: ipData?.country_code || ipData?.country_code_iso3 || "",
    };

    const response = await api.post("/partner/telegram-login", payload);

    if (response.data && response.data.success) {
      localStorage.setItem("authToken", response.data.data.token);
      setPartner(response.data.data.partner);
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setPartner(null);
  };

  const updatePartner = (updatedPartner: Partner) => {
    setPartner(updatedPartner);
  };

  return (
    <AuthContext.Provider
      value={{ partner, loading, login, logout, updatePartner }}
    >
      {children}
    </AuthContext.Provider>
  );
};
