import { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { getSession } from "../services/storage";
import { logoutUser } from "../services/authService";
import { useAuth } from "../services/AuthContext"; // Importamos el hook
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [session, setSessionInternal] = useState(null); // Estado interno para la sesión
  const [loading, setLoading] = useState(null);

  const { setSession } = useAuth(); // Usamos el hook para el setter global (solo para Logout)

  const navigation = useNavigation();

  useEffect(() => {
    const loadSession = async () => {
      const stored = await getSession(); // Lee del storage, SIN props
      setSessionInternal(stored);
      setLoading(false);
    };
    loadSession();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setSession(null);
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Sesión no válida. Iniciá sesión nuevamente.</Text>
        <Pressable onPress={() => setSession(null)}>
          <Text style={{ color: "orange", marginTop: 10 }}>Volver al login</Text>
        </Pressable>
      </View>
    );
  }

  const role = session.role;

  console.log("ROL ACTUAL: ", role);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        {role === "visitor" && "Bienvenido visitante 🕵️"}
        {role === "user" && "Hola usuario registrado 🏛️"}
        {role === "partner" && "Bienvenido socio 🤝"}
      </Text>

      <Pressable onPress={handleLogout} style={{ backgroundColor: "#6B7280", padding: 12, borderRadius: 10 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar sesión</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Galeria")} style={{ backgroundColor: "#6B72D0", padding: 12, borderRadius: 10, marginTop: 10 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Ir a Galería</Text>
      </Pressable>

    </View>
  );
}
