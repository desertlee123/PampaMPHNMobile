// services/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "./storage";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children, setSession: externalSetSession }) => {
  const [session, setSessionInternal] = useState(null);

  // Cargar sesión inicial desde storage (solo una vez)
  useEffect(() => {
    const loadSession = async () => {
      const stored = await getSession();
      if (stored) setSessionInternal(stored);
    };
    loadSession();
  }, []);

  // Esta función sincroniza la sesión global y la del App.js
  const updateSession = (newSession) => {
    setSessionInternal(newSession);
    if (externalSetSession) externalSetSession(newSession);
  };

  return (
    <AuthContext.Provider value={{ session, setSession: updateSession }}>
      {children}
    </AuthContext.Provider>
  );
};

/* import { createContext, useContext } from 'react';

const AuthContext = createContext(null); // Crear el Contexto

// Hook para usar el contexto (método limpio para usarlo en cualquier pantalla)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context; // Solo devolvemos la función setSession
};

// Componente Provider que envuelve la app y expone la función setSession
export const AuthProvider = ({ children, setSession }) => {
  return (
    // El valor expuesto es setSession (la función que actualiza el estado en App.js)
    <AuthContext.Provider value={{ setSession }}>
      {children}
    </AuthContext.Provider>
  );
};
 */