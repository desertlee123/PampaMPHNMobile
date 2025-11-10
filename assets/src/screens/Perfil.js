import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSession, saveSession } from "../services/storage";
import { useAuth } from "../services/AuthContext";
import { logoutUser } from "../services/authService";
import { lightTheme } from "../theme/colors";
import { API_BASE_URL } from "../services/api";

export default function Perfil({ navigation }) {
  const [session, setSessionInternal] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setSession } = useAuth();

  const MP_URL = "https://mpago.la/2BkJCW8";

  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = await getSession();
        console.log(stored);
        setSessionInternal(stored || null);
      } catch {
        setSessionInternal(null);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Seguro que querés salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logoutUser();
          setSession(null);
          setSessionInternal(null);
        },
      },
    ]);
  };

  const handleBecomePartner = async () => {
    try {
      Linking.openURL(MP_URL);
      const res = await fetch(`${API_BASE_URL}/user/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ role: "partner" }),
      });
      if (!res.ok) throw new Error("Error actualizando rol");

      const data = await res.json();
      const updated = { ...session, role: data.user.role };
      await saveSession(updated);
      setSession(updated);
      setSessionInternal(updated);
      Alert.alert("Socio confirmado", "Tu membresía se activó exitosamente.");
    } catch (err) {
      Alert.alert("Error", "No se pudo cambiar el rol.");
    }
  };

  const handleLeavePartner = async () => {
    Alert.alert("Dejar de ser socio", "¿Seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/user/role`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.token}`,
              },
              body: JSON.stringify({ role: "user" }),
            });
            if (!res.ok) throw new Error("Error");
            const data = await res.json();
            const updated = { ...session, role: data.user.role };
            await saveSession(updated);
            setSession(updated);
            setSessionInternal(updated);
            Alert.alert("Actualizado", "Ya no sos socio.");
          } catch {
            Alert.alert("Error", "Ocurrió un problema.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
      </View>
    );
  }

  if (!session || !session.email) {
    return (
      <View style={styles.container}>
        <Ionicons
          name="person-circle-outline"
          size={100}
          color="#ccc"
          style={{ marginBottom: 20 }}
        />
        <Text style={styles.title}>Invitado</Text>
        <Text style={styles.subtitle}>No has iniciado sesión</Text>

        <Pressable
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons name="log-in-outline" size={22} color="white" />
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </Pressable>
      </View>
    );
  }

  const { name, email, role } = session;

  return (
    <View style={styles.container}>
      <Ionicons
        name={role === "partner" ? "star-outline" : "person-circle-outline"}
        size={100}
        color={role === "partner" ? lightTheme.primary : "#ccc"}
        style={{ marginBottom: 20 }}
      />
      <Text style={styles.title}>{name || "Usuario"}</Text>
      <Text style={styles.subtitle}>{email}</Text>

      <Text style={styles.infoText}>
        {role === "partner"
          ? "Gracias por ser parte de nuestros socios 🤝"
          : "Estás logueado con una cuenta estándar."}
      </Text>

      {role === "user" && (
        <Pressable style={styles.partnerButton} onPress={handleBecomePartner}>
          <Ionicons name="star" size={22} color="white" />
          <Text style={styles.partnerButtonText}>Convertirse en socio</Text>
        </Pressable>
      )}

      {role === "partner" && (
        <Pressable
          style={[styles.partnerButton, { backgroundColor: "#888" }]}
          onPress={handleLeavePartner}
        >
          <Ionicons name="close" size={22} color="white" />
          <Text style={styles.partnerButtonText}>Dejar de ser socio</Text>
        </Pressable>
      )}

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: lightTheme.background,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: lightTheme.fonts.bold,
    color: lightTheme.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: lightTheme.text.secondary,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: lightTheme.text.secondary,
    marginVertical: 20,
    textAlign: "center",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightTheme.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
  },
  loginButtonText: { color: "white", marginLeft: 8, fontWeight: "bold" },
  partnerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightTheme.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
  },
  partnerButtonText: { color: "white", marginLeft: 8, fontWeight: "bold" },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutButtonText: { color: "white", fontWeight: "bold" },
});
