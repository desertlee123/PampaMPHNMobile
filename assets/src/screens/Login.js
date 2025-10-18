import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://192.168.0.106:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Respuesta del backend:", data);
      if (data.token) {
        await AsyncStorage.setItem("@token", data.token);
        setToken(data.token);
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (e) {
      console.log(e);
      alert("Error de conexión");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo y título */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Image source={require("../../../assets/icon.png")} style={{ width: 48, height: 48 }} />
        </View>
        <Text style={styles.title}>PAMPA MPHN</Text>
        <Text style={styles.subtitle}>Museo Provincial de Historia Nacional</Text>
      </View>

      {/* Formulario */}
      <View style={styles.card}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="nombre@gmail.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </Pressable>

        <View style={styles.separatorBox}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>O continuar con</Text>
          <View style={styles.separator} />
        </View>

        <Pressable style={styles.fingerprintBtn}>
          <Text style={{ fontSize: 24 }}>🔒</Text>
        </Pressable>
      </View>

      {/* Registro */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.footerText}>
          ¿No tenés una cuenta?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Signin")}>
            Registrate
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2E9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: { alignItems: "center", marginBottom: 20 },
  logoBox: {
    backgroundColor: "#FFA500",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#111827" },
  subtitle: { color: "#6B7280", marginBottom: 20 },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  label: { color: "#111827", fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  button: {
    backgroundColor: "#FFA500",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  separatorBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  separator: { flex: 1, height: 1, backgroundColor: "#ccc" },
  separatorText: { marginHorizontal: 8, color: "#6B7280" },
  fingerprintBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    padding: 10,
    alignSelf: "center",
  },
  footerText: { color: "#6B7280" },
  link: { color: "#FFA500", fontWeight: "bold" },
});