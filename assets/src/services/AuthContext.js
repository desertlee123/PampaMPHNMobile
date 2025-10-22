import { createContext, useContext } from 'react';

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
