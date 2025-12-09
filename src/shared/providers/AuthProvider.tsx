import React, { createContext, useContext, useEffect, useState } from "react";
import { type User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { CircularProgress, Box } from "@mui/material";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔐 Setting up Firebase auth state listener");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔐 Auth state changed:", user ? user.email : "No user");

      if (user) {
        try {
          const idToken = await user.getIdToken();
          console.log("🔐 User ID Token:", idToken);
        } catch (error) {
          console.error("🔐 Error getting ID token:", error);
        }
      }

      setFirebaseUser(user);
      setLoading(false);
    });

    return () => {
      console.log("🔐 Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
