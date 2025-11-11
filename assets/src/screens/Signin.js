import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import AuthInputField from "../components/AuthInputField";
import AuthHeader from "../components/AuthHeader";
import { registerUser } from "../services/authService";
import { useAuth } from "../services/AuthContext"; // Importamos el hook
import { useTheme } from "../theme/ThemeContext";

export default function Signin({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setSession } = useAuth(); // Usamos el hook para acceder a setSession

  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleSignin = async () => {
    if (!name || !email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    try {
      setLoading(true);
      const newSession = await registerUser(name, email, password);
      setSession(newSession);
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
        <AuthHeader />

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

          {loading && (
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator size="large" color="#FFA500" />
            </View>
          )}
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

const getStyles = (theme) => StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.cardBackground,
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
