import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import AuthInputField from "../components/AuthInputField";
import { API_BASE_URL } from "../services/api";
import { registerUser } from "../services/authService";

export default function Signin({ navigation, setToken }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async () => {
    if (!name || !email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    /* try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        }),
      });

      const data = await res.json();
      console.log("Respuesta del backend (Registro):", data);

      if (res.ok && data.token) {
        await AsyncStorage.setItem("@token", data.token);
        await AsyncStorage.setItem("@role", data.user.role); // Guardamos el rol
        setToken({ token: data.token, role: data.user.role }); // cambio
      } else {
        let errorMsg = "Error al registrar. Verifica tu información.";
        if (data.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          if (firstErrorKey) {
            errorMsg = data.errors[firstErrorKey][0];
          }
        } else if (data.message) {
          errorMsg = data.message;
        }
        alert(errorMsg);
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión.");
    } */

    try {
      setLoading(true);
      const session = await registerUser(name, email, password);
      setToken(session);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentWrapper}>

        {/* Logo y título */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <MaterialIcons name="museum" size={48} color="white" />
          </View>
          <Text style={styles.title}>PAMPA MPHN</Text>
          <Text style={styles.subtitle}>Museo Provincial de Historia Nacional</Text>
        </View>

        {/* Formulario */}
        <View style={styles.card}>

          <AuthInputField
            label="Nombre de usuario"
            iconName="person"
            placeholder="Tu nombre"
            value={name}
            onChangeText={setName}
          />

          <AuthInputField
            label="Correo Electrónico"
            iconName="email"
            placeholder="nombre@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <AuthInputField
            label="Contraseña"
            iconName="lock"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={{ marginBottom: 20 }}
          />

          <Pressable style={styles.button} onPress={handleSignin}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </Pressable>
        </View>

        {/* Login Link */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.footerText}>
            ¿Ya tenés una cuenta?{" "}
            <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
              Iniciá sesión
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FDF2E9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
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
  button: {
    backgroundColor: "#FFA500",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  footerText: { color: "#6B7280" },
  link: { color: "#FFA500", fontWeight: "bold" },
});
