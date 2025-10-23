import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AuthInputField from "../components/AuthInputField";
import AuthHeader from "../components/AuthHeader";
import { loginUser, biometricLogin, visitorSession } from "../services/authService";
import { useAuth } from "../services/AuthContext"; // Importamos el hook

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setSession } = useAuth(); // Usamos el hook para acceder a setSession

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    try {
      setLoading(true);
      const newSession = await loginUser(email, password);
      setSession(newSession); // Esto hace que App.js se re-renderice a Home.
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setLoading(false);
      const newSession = await biometricLogin();
      setSession(newSession); // Huella exitosa -> a Home.
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función que usa un token especial para entrar en modo visitante
  const handleVisitorMode = async () => {
    const newSession = await visitorSession();
    setSession(newSession); // Modo visitante -> a Home.
  }

  return (
    <View style={styles.container}>
      {/* Logo y título */}
      <AuthHeader />

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

        {loading && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size="large" color="#FFA500" />
          </View>
        )}

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
