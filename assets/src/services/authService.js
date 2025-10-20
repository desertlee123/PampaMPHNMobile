import { API_BASE_URL } from "./api";
import { saveSession } from "./storage";

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (!res.ok || !data.token) {
    throw new Error(data.message || "Credenciales incorrectas");
  }

  const session = {
    token: data.token,
    role: data.user.role,
    email,
  };

  await saveSession(session);
  return session;
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();

  if (!res.ok || !data.token) {
    throw new Error(data.message || "Error al registrar usuario");
  }

  const session = {
    token: data.token,
    role: data.user.role,
    email,
  };

  await saveSession(session);
  return session;
}

export async function visitorSession() {
  const session = {
    token: "VISITOR_MODE",
    role: "visitor",
    email: "visitante@demo",
  };
  await saveSession(session);
  return session;
}
