import { createContext, useContext, useEffect, useState } from "react";
import { setPersistence, browserSessionPersistence} from "firebase/auth";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    setPersistence(auth, browserSessionPersistence).catch((err) =>
      console.error("Failed to set session persistence:", err)
    );

    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
