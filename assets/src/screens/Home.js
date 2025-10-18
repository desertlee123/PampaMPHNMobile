import React from "react";
import { View, Text, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ setToken }) {
  const logout = async () => {
    await AsyncStorage.removeItem("@token");
    setToken(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Hola, soy Home 🏛️</Text>
      <Pressable onPress={logout} style={{ backgroundColor: "#FFA500", padding: 12, borderRadius: 10 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}
