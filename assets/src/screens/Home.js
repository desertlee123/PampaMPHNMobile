import React from "react";
import { View, Text, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ session, setSession }) {
  const logout = async () => {
    await AsyncStorage.removeItem("@session");
    // NO borramos @lastSession, así la huella sigue funcionando
    setSession(null);
  };

  const role = session?.role;
  const isVisitor = role === "visitor" || role === "VISITOR_MODE";
  const isPartner = role === "partner";
  const isUser = role === "user";

  console.log("ROL ACTUAL: ", role);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        {isVisitor && "Bienvenido visitante 🕵️"}
        {isUser && "Hola usuario registrado 🏛️"}
        {isPartner && "Bienvenido socio 🤝"}
      </Text>

      {isVisitor && (
        <Text style={{ color: "#6B7280", marginBottom: 20 }}>
          Tenés acceso limitado al contenido.
        </Text>
      )}

      {isUser && (
        <Pressable style={{ backgroundColor: "#FFA500", padding: 12, borderRadius: 10, marginBottom: 10 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Ver Galería</Text>
        </Pressable>
      )}

      {isPartner && (
        <Pressable style={{ backgroundColor: "#4CAF50", padding: 12, borderRadius: 10, marginBottom: 10 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Pagar con Mercado Pago 💳</Text>
        </Pressable>
      )}

      <Pressable onPress={logout} style={{ backgroundColor: "#6B7280", padding: 12, borderRadius: 10 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}
