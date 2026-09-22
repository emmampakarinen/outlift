import { createContext, useContext } from "react";
import type { Coordinates, User } from "../shared/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

type LocationContextType = {
  userLocation: Coordinates | null;
};

export const LocationContext = createContext<LocationContextType>({
  userLocation: null,
});

export function useUserLocation() {
  return useContext(LocationContext);
}
