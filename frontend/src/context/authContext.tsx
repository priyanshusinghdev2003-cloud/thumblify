import { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../assets/assets";
import api from "../config/api";
import toast from "react-hot-toast";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  login: (user: { email: string; password: string }) => Promise<void>;
  signUp: (user: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  login: async () => Promise.resolve(),
  signUp: async () => Promise.resolve(),
  logout: async () => Promise.resolve(),
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  const signUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      if (data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
      }
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });
      if (data.user) {
        setUser(data.user as IUser);
        setIsLoggedIn(true);
      }
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };
  const logout = async () => {
    try {
      const { data } = await api.post("/auth/logout");
      setUser(null);
      setIsLoggedIn(false);
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/verify");
      if (data.user) {
        setUser(data.user as IUser);
        setIsLoggedIn(true);
      }
      toast.success(data.message, {
        style: {
          borderRadius: "10px",
          background: "#363636",
          color: "#fff",
        },
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        style: {
          borderRadius: "10px",
          background: "#363636",
          color: "#fff",
        },
      });
    }
  };
  useEffect(() => {
    (async () => {
      fetchUser();
    })();
  }, []);
  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    login,
    signUp,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
