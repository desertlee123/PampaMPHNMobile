import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSession, saveSession } from "../services/storage";
import { useAuth } from "../services/AuthContext";
import { logoutUser } from "../services/authService";
import { lightTheme } from "../theme/colors";
import { API_BASE_URL } from "../services/Api";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";

export default function Perfil({ navigation }) {
  const [session, setSessionInternal] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setSession } = useAuth();
  const isFocused = useIsFocused(); // detecta si la pantalla está activa
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = await getSession();
        setSessionInternal(stored || null);
      } catch {
        setSessionInternal(null);
      } finally {
        setLoading(false);
      }
    };
    loadSession();

    if (isFocused) {
      // cada vez que vuelve a enfocarse, recarga sesión
      setLoading(true);
      loadSession();
    }
  }, [isFocused]);

  // CORRECCIÓN: Usar la navegación anidada para volver a Home después de cerrar sesión
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
          // Asegurarse de volver a la pantalla principal
          navigation.navigate("MainApp", { screen: "Home" });
        },
      },
    ]);
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
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // --- Vista Invitado/No Logueado ---
  if (!session || !session.email) {
    return (
      <View style={styles.container}>
        <View style={styles.guestCard}>
          <Ionicons
            name="finger-print-outline"
            size={120}
            color="#aaa"
            style={{ marginBottom: 20 }}
          />
          <Text style={styles.guestTitle}>¡Hola, Invitado!</Text>
          <Text style={styles.guestSubtitle}>
            Parece que no has iniciado sesión aún.
          </Text>

          <Pressable
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons name="log-in-outline" size={24} color="white" />
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // --- Vista Logueado (User/Partner) ---
  const { name, email, role } = session;
  const isPartner = role === "partner";

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {/* Profile Icon */}
        <View
          style={[
            styles.iconWrapper,
            isPartner
              ? { borderColor: theme.primary }
              : { borderColor: "#ccc" },
          ]}
        >
          <Ionicons
            name={isPartner ? "star" : "person"}
            size={80}
            color={isPartner ? theme.primary : theme.text.secondary}
          />
          {isPartner && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Socio</Text>
            </View>
          )}
        </View>

        {/* User Info */}
        <Text style={styles.userTitle}>{name || "Usuario"}</Text>
        <Text style={styles.userSubtitle}>
          {isPartner ? email : email || "Visitante"}
        </Text>
        <Text style={styles.infoText}>
          {isPartner
            ? "¡Gracias por ser parte de nuestros socios! Tienes acceso premium 🚀"
            : "Estás logueado con una cuenta estándar."}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Become Partner Button */}
        {!isPartner && role === "user" && (
          <Pressable
            style={styles.primaryActionButton}
            onPress={() => navigation.navigate("Suscripcion")}
          >
            <Ionicons name="star-outline" size={22} color="white" />
            <Text style={styles.actionButtonText}>Convertirse en socio</Text>
          </Pressable>
        )}

        {/* Leave Partner Button */}
        {isPartner && (
          <Pressable
            style={styles.secondaryActionButton}
            onPress={handleLeavePartner}
          >
            <Ionicons name="close-circle-outline" size={22} color="white" />
            <Text style={styles.actionButtonText}>Cancelar suscripción</Text>
          </Pressable>
        )}

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="white" />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.background,
    padding: 24,
  },

  // --- Profile Card (Logged In) ---
  profileCard: {
    width: "100%",
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginTop: 40,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Android Shadow
    elevation: 8,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  userTitle: {
    fontSize: 30,
    fontWeight: "900", // Extra Bold
    color: theme.text.primary,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: theme.text.secondary,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: theme.text.secondary,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  // --- Guest Card (Not Logged In) ---
  guestCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginTop: "40%", // Center it more vertically on the screen
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.text.primary,
  },
  guestSubtitle: {
    fontSize: 16,
    color: theme.text.secondary,
    marginBottom: 30,
  },

  // --- Buttons ---
  actionsContainer: {
    width: "100%",
    marginTop: 30,
    paddingHorizontal: 10,
    gap: 15, // Espacio entre botones
  },

  // Login Button (Used in Guest View)
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    elevation: 5,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },

  // Primary Action Button (e.g., Become Partner)
  primaryActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 4,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  actionButtonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },

  // Secondary Action Button (e.g., Cancel Partner)
  secondaryActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6b7280", // Gray-ish color for less emphasis
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#374151",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  // Logout Button (Red, prominent)
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#ef4444", // Red color
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoutButtonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
});
