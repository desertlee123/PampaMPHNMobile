import { API_BASE_URL } from "./api";
import { saveSession, getSession, clearSession } from "./storage";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "@session";

// Iniciar sesión normal
async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    throw new Error(data.message || "Credenciales incorrectas");
  }

  const session = { token: data.token, role: data.user.role, email, };
  await saveSession(session);
  return session;
}

// Registro
async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    if (data.errors.password) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }
    if (data.errors.email) {
      throw new Error("Ese correo electrónico ya ha sido tomado.");
    }
  }

  const session = { token: data.token, role: data.user.role, email, };
  await saveSession(session);
  return session;
}

// Iniciar sesión biométrica
async function biometricLogin() {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    throw new Error("Tu dispositivo no soporta autenticación biométrica.");
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    throw new Error("No tenés ninguna huella registrada en el dispositivo.");
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Iniciar sesión con huella digital",
    fallbackLabel: "Usar contraseña",
  });

  if (!result.success) throw new Error("Autenticación cancelada o fallida.");

  const session = await getSession();
  if (!session) {
    throw new Error("No hay sesión previa guardada. Iniciá sesión manualmente primero.");
  }

  // Re-salvamos la sesión activa
  await saveSession(session);

  return session;
}

// Modo visitante
async function visitorSession() {
  const session = {
    token: "VISITOR_MODE",
    role: "visitor",
    email: "visitante@demo",
  };
  // Solo guardamos sesión temporal, NO reemplazamos @lastSession
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

// Logout
async function logoutUser() {
  await clearSession(false); // No borrar LAST_SESSION
}

// Validar token guardado
async function validateSession() {
  const session = await getSession();

  // Si no hay token o es visitante, no se valida
  if (!session || !session.token || session.token === "VISITOR_MODE") {
    // No hay token real → no validar
    return session;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/validate-token`, {
      method: "GET",
      headers: {
        Accept: "application/json", // para que Laravel no devuelva HTML
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!res.ok) {
      // Token inválido o expirado
      await clearSession(true);
      return null;
    }

    const data = await res.json();
    // opcional: actualizar datos del usuario
    const updatedSession = { ...session, role: data.role || session.role };
    await saveSession(updatedSession);
    return updatedSession;
  } catch (err) {
    console.warn("Error validando token:", err);
    return null;
  }
}

export {
  loginUser,
  registerUser,
  biometricLogin,
  visitorSession,
  logoutUser,
  validateSession
};
