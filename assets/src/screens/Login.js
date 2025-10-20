import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import AuthInputField from "../components/AuthInputField";
import { API_BASE_URL } from "../services/api";
import * as LocalAuthentication from "expo-local-authentication";
import { loginUser } from "../services/authService";

export default function Login({ navigation, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    /* try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Respuesta del backend (Login):", data);

      if (data.token) {
        const session = {
          token: data.token,
          role: data.user.role,
          email: email,
        };
        // Guardamos todo junto
        await AsyncStorage.setItem("@session", JSON.stringify(session));
        await AsyncStorage.setItem("@lastSession", JSON.stringify(session)); // Copia de respaldo para la huella
        setToken(session);

      } else {
        alert("Credenciales incorrectas");
      }
    } catch (e) {
      console.log(e);
      alert("Error de conexión");
    } */

    try {
      setLoading(true);
      const session = await loginUser(email, password);
      setToken(session);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función que usa un token especial para entrar en modo visitante
  const handleVisitorMode = async () => {
    const session = {
      token: "VISITOR_MODE",
      role: "visitor",
      email: "visitante@demo",
    };
    await AsyncStorage.setItem("@session", JSON.stringify(session));
    setToken(session);
  }

  const handleBiometricLogin = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        alert("Tu dispositivo no soporta autenticación biométrica.");
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        alert("No tenés ninguna huella registrada en el dispositivo.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Iniciar sesión con huella digital",
        fallbackLabel: "Usar contraseña",
      });

      if (result.success) {
        let stored = await AsyncStorage.getItem("@session");
        if (!stored) stored = await AsyncStorage.getItem("@lastSession"); // lee respaldo si la sesión normal fue borrada

        if (stored) {
          const session = JSON.parse(stored);
          console.log("Inicio con huella exitoso:", session);
          setToken(session);
        } else {
          alert("No hay sesión previa guardada. Iniciá sesión manualmente primero.");
        }
      } else {
        alert("Autenticación cancelada o fallida.");
      }
    } catch (error) {
      console.log("Error biométrico:", error);
      alert("Ocurrió un error al usar la huella.");
    }
  };

  return (
    <View style={styles.container}>
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
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ marginTop: 12, marginBottom: 20 }}
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </Pressable>

        <View style={styles.separatorBox}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>O continuar con</Text>
          <View style={styles.separator} />
        </View>

        <Pressable style={styles.fingerprintBtn} onPress={handleBiometricLogin}>
          <MaterialIcons name="fingerprint" size={32} color="#111827" />
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
        {/* NUEVO: Continuar como visitante */}
        <Pressable style={styles.visitorButton} onPress={handleVisitorMode}>
          <Text style={styles.visitorButtonText}>Continuar como visitante</Text>
        </Pressable>
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
  // NUEVOS ESTILOS PARA EL BOTÓN DE VISITANTE
  visitorButton: {
    marginTop: 15,
  },
  visitorButtonText: {
    textAlign: 'center',
    color: "#6B7280",
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});
